import { Agent } from "@mastra/core/agent";
import { weatherTool, generateResume } from "@/mastra/tools";
import { LibSQLStore } from "@mastra/libsql";
import { z } from "zod";
import { Memory } from "@mastra/memory";

export const AgentState = z.object({
  proverbs: z.array(z.string()).default([]),
  resumeLastUpdated: z.number().optional(),
});

export const resumeAgent = new Agent({
  name: "Resume Agent",
  tools: { weatherTool, generateResume },
  model: "openrouter/openai/gpt-4o-mini",
  instructions: "You are a helpful AI resume assistant. When you use the generateResume tool to update the resume, you MUST also update the 'resumeLastUpdated' state to the current timestamp (Date.now()) so the frontend knows to refresh the preview.",
  memory: new Memory({
    storage: new LibSQLStore({ url: "file::memory:" }),
    options: {
      workingMemory: {
        enabled: true,
        schema: AgentState,
      },
    },
  }),
});
