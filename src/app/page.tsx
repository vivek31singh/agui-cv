"use client";

import dynamic from "next/dynamic";
import { AgentState } from "@/lib/types";
import { useCoAgent } from "@copilotkit/react-core";
import { CopilotChat, useCopilotChatSuggestions } from "@copilotkit/react-ui";
import { useState, useEffect } from "react";

const ResumePreview = dynamic(() => import("@/components/ResumePreview").then(mod => mod.ResumePreview), {
  ssr: false,
  loading: () => <div className="flex h-full w-full items-center justify-center bg-gray-100">Loading Preview...</div>
});

export default function ResumeBuilderPage() {
  // Mock PDF URL for now - in real app this comes from backend
  const [pdfUrl, setPdfUrl] = useState<string | null>("/api/pdf");

  // 🪁 Shared State with Agent
  const { state } = useCoAgent<AgentState>({
    name: "resumeAgent",
    initialState: {
      proverbs: [], 
      resumeLastUpdated: Date.now(),
    },
  });

  // Refresh PDF when the agent updates the timestamp
  useEffect(() => {
    if (state.resumeLastUpdated) {
      setPdfUrl(`/api/pdf?t=${state.resumeLastUpdated}`);
    }
  }, [state.resumeLastUpdated, setPdfUrl]);

  // 💡 Chat Suggestions - Quick Start Templates
  useCopilotChatSuggestions({
    instructions: "Suggest quick-start templates for creating a resume",
    minSuggestions: 2,
    maxSuggestions: 3,
  });

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

      {/* Right Panel - PDF Preview */}
      <div className="w-1/2 h-full bg-gray-50 relative flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-white shadow-sm z-10 flex justify-between items-center">
            <span className="font-medium text-gray-600">Live Preview</span>
            <div className="space-x-2">
                <button className="px-3 py-1 text-sm bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors" disabled>Download PDF</button>
            </div>
        </div>
        <div className="flex-1 relative overflow-hidden">
            <ResumePreview pdfUrl={pdfUrl} />
        </div>
      </div>
    </div>
  );
}
