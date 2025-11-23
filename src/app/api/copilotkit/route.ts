import {
  CopilotRuntime,
  OpenAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { MastraAgent } from "@ag-ui/mastra"
import { NextRequest } from "next/server";
import { mastra } from "@/mastra";
import OpenAI from "openai";
 
// 1. Configure OpenAI client to use OpenRouter
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY, // OpenRouter API key from .env.local
  baseURL: "https://openrouter.ai/api/v1",
});

const serviceAdapter = new OpenAIAdapter({
  model: "openai/gpt-4o-mini", // OpenRouter model identifier
  openai,
});

// 2. Build a Next.js API route that handles the CopilotKit runtime requests.
export const POST = async (req: NextRequest) => {

  // 3. Create the CopilotRuntime instance and utilize the Mastra AG-UI
  //    integration to get the remote agents. Cache this for performance.
  const runtime = new CopilotRuntime({
    agents: MastraAgent.getLocalAgents({ mastra }),
  });

  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: "/api/copilotkit",
  });
 
  return handleRequest(req);
};