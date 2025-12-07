"use client";

import dynamic from "next/dynamic";
import { AgentState } from "@/lib/types";
import { useCoAgent, useCopilotReadable } from "@copilotkit/react-core";
import { CopilotChat, useCopilotChatSuggestions } from "@copilotkit/react-ui";
import { useState } from "react";
import { useCopilotAction } from "@copilotkit/react-core";
import { parseResumeFile, estimateTokenCount } from "@/lib/resume-parser";

// Dynamically import PdfPreview to avoid SSR issues with pdfjs
const PdfPreview = dynamic(
  () => import("@/components/PdfPreview").then((mod) => mod.PdfPreview),
  { ssr: false }
);

export default function ResumeBuilderPage() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [latexContent, setLatexContent] = useState<string>("");
  const [uploadedResumeText, setUploadedResumeText] = useState<string>("");
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  // Make uploaded resume context available to the agent via CopilotKit
  useCopilotReadable({
    description: "The user's existing resume content that they uploaded. Use this as context to understand their background, work experience, education, skills, and achievements when generating or improving their new resume. Preserve all factual information unless the user requests specific changes.",
    value: uploadedResumeText,
  });

  // Handler for uploading resume via button
  const handleUploadResume = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.docx,.txt';

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setIsUploading(true);
      try {
        const extractedText = await parseResumeFile(file);
        const tokenCount = estimateTokenCount(extractedText);

        setUploadedResumeText(extractedText);
        setUploadedFileName(file.name);
      } catch (error) {
        console.error('Error parsing resume:', error);
        alert(`Failed to parse resume: ${(error as Error).message}. Please try a different file.`);
      } finally {
        setIsUploading(false);
      }
    };

    input.click();
  };

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

  const { state } = useCoAgent<AgentState>({
    name: "resumeAgent",
    initialState: {
      latexContent: "",
    },
  });

  useCopilotChatSuggestions({
    instructions: "Suggest options for creating a resume: templates for creating from scratch or improving existing content (note: users can upload their resume using the 'Upload Resume' button)",
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
    <div className="flex flex-col h-screen w-full bg-slate-50">
      {/* Single Unified Header */}
      <div className="flex-shrink-0 h-20 px-6 border-b border-slate-200 bg-slate-900 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-11 h-11 bg-slate-800 rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-2xl">📝</span>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-white tracking-tight truncate leading-tight">
              AGUI CV
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              AI Resume Builder
            </p>
          </div>
        </div>

        {/* Action Buttons (visible on desktop, hidden on mobile to save space) */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={handleUploadResume}
            disabled={isUploading}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-600 text-white text-sm font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            aria-label="Upload resume"
          >
            {isUploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <span>📄</span>
                <span>Upload</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={!latexContent || isDownloading}
            className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:bg-slate-600 text-white text-sm font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            aria-label="Download PDF"
          >
            {isDownloading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <span>📥</span>
                <span>Download</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Upload Status Banner */}
      {uploadedFileName && (
        <div className="flex-shrink-0 px-6 py-3 bg-emerald-50 border-b border-emerald-200 animate-slideIn">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">✓</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-emerald-900 truncate">
                {uploadedFileName}
              </p>
              <p className="text-xs text-emerald-600">
                {uploadedResumeText.length.toLocaleString()} characters
              </p>
            </div>
            <button
              onClick={() => {
                setUploadedResumeText("");
                setUploadedFileName("");
              }}
              className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-100 hover:bg-emerald-200 flex items-center justify-center text-emerald-700 transition-colors"
              aria-label="Clear uploaded resume"
            >
              <span className="text-sm">✕</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area - Two Panels */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
        {/* Preview Panel (order-1 on mobile, order-2 on desktop) */}
        <div className="order-1 md:order-2 w-full md:w-1/2 h-1/2 md:h-full flex flex-col bg-slate-50 border-b md:border-b-0 md:border-l border-slate-200">
          {/* Mobile Action Buttons */}
          <div className="md:hidden flex-shrink-0 px-4 py-3 border-b border-slate-200 bg-white flex items-center gap-3">
            <button
              onClick={handleUploadResume}
              disabled={isUploading}
              className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white text-sm font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
              aria-label="Upload resume"
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <span>📄</span>
                  <span>Upload</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={!latexContent || isDownloading}
              className="flex-1 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:bg-slate-300 text-white text-sm font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
              aria-label="Download PDF"
            >
              {isDownloading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>📥</span>
                  <span>Download</span>
                </>
              )}
            </button>
          </div>

          {/* Preview Area */}
          <div className="flex-1 min-h-0 overflow-hidden p-3 sm:p-6">
            <div className="h-full rounded-lg overflow-hidden shadow-lg border border-slate-200 bg-white">
              <PdfPreview latexContent={latexContent} />
            </div>
          </div>
        </div>

        {/* Chat Panel (order-2 on mobile, order-1 on desktop) */}
        <div className="order-2 md:order-1 w-full md:w-1/2 h-1/2 md:h-full flex flex-col bg-white">
          <div className="flex-1 min-h-0 overflow-hidden">
            <CopilotChat
              labels={{
                title: "Resume Assistant",
                initial: "I built this hoping it would be genuinely helpful for your career journey. Let's create a resume that opens doors for you.\n\nIf you'd like to connect, I'm on [LinkedIn](https://www.linkedin.com/in/vivek-singh05/) and [X](https://x.com/VivekSingh_003).",
              }}
              className="h-full"
            />
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx global>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        
        /* Scrollbar */
        ::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #94a3b8;
          border-radius: 5px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
      `}</style>
    </div>
  );
}
