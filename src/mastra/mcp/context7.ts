
import { MCPClient } from "@mastra/mcp";

export const context7MCP = new MCPClient({
    servers: {
        context7: {
            command: "npx",
            args: ["-y", "@upstash/context7-mcp"],
        }
    }
})