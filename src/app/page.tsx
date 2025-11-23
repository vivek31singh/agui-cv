"use client";

import dynamic from "next/dynamic";
import { AgentState } from "@/lib/types";
import { useCoAgent } from "@copilotkit/react-core";
import { CopilotChat, useCopilotChatSuggestions } from "@copilotkit/react-ui";
import { useState } from "react";
import { useCopilotAction } from "@copilotkit/react-core";

// Dynamically import PdfPreview to avoid SSR issues with pdfjs
const PdfPreview = dynamic(
  () => import("@/components/PdfPreview").then((mod) => mod.PdfPreview),
  { ssr: false }
);

export default function ResumeBuilderPage() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [latexContent, setLatexContent] = useState<string>("");

  useCopilotAction({
    name: "previewResume",
    description: "Render the resume preview with the given LaTeX content",
    parameters: [
      {
        name: "latex",
        type: "string",
        description: "The LaTeX content to render",
        required: true,
      },
    ],
    handler: async ({ latex }) => {
      setLatexContent(latex);
      return "Preview updated successfully";
    },
  });

  // 🪁 Shared State with Agent
  const { state } = useCoAgent<AgentState>({
    name: "resumeAgent",
    initialState: {
      latexContent: "",
    },
  });

  // 💡 Chat Suggestions - Quick Start Templates
  useCopilotChatSuggestions({
    instructions: "Suggest quick-start templates for creating a resume",
    minSuggestions: 2,
    maxSuggestions: 3,
  });

  const handleDownloadPDF = async () => {
    if (!latexContent) return;

    setIsDownloading(true);
    try {
      const response = await fetch("/api/compile-latex", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ latexContent }),
      });

      if (!response.ok) {
        throw new Error("Failed to compile PDF");
      }

      // Get PDF blob and download
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "resume.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Failed to download PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-100 overflow-hidden">
      {/* Left Panel - Chat Interface */}
      <div className="w-1/2 h-full border-r border-gray-200 bg-white flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <h1 className="text-xl font-bold text-gray-800">AGUI CV</h1>
        </div>
        <div className="flex-1 overflow-hidden">
          <CopilotChat
            labels={{
              title: "Resume Assistant",
              initial: "I built this hoping it would be genuinely helpful for your career journey. Let's create a resume that opens doors for you.\n\nIf you'd like to connect, I'm on [LinkedIn](https://linkedin.com/in/vivek31singh) and [X](https://x.com/vivek31singh).",
            }}
            className="h-full"
          />
        </div>
      </div>

      {/* Right Panel - Resume Preview */}
      <div className="w-1/2 h-full bg-gray-50 flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Resume Preview</h2>
          <button
            onClick={handleDownloadPDF}
            disabled={!latexContent || isDownloading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isDownloading ? "Downloading..." : "📥 Download PDF"}
          </button>
        </div>
        <div className="flex-1 overflow-hidden">
          <PdfPreview latexContent={latexContent} />
        </div>
      </div>
    </div>
  );
}
