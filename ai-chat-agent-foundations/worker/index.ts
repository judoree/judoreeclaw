import { AIChatAgent } from "@cloudflare/ai-chat";
import { routeAgentRequest } from "agents";
import { convertToModelMessages, isLoopFinished, streamText } from "ai";
import { createWorkersAI } from "workers-ai-provider";
import { getLocation, getWether } from "./tools.ts";

export class PotatoChatAgent extends AIChatAgent<Env> {
  async onChatMessage() {
    const workersAi = createWorkersAI({
      binding: this.env.AI,
    });
    const result = streamText({
      model: workersAi("@cf/zai-org/glm-4.7-flash"),
      messages: await convertToModelMessages(this.messages),
      tools: {
        getWether,
        getLocation,
      },
      stopWhen: isLoopFinished(),
    });
    return result.toUIMessageStreamResponse();
  }
}
export default {
  async fetch(request, env) {
    return (
      (await routeAgentRequest(request, env)) ??
      new Response(null, { status: 404 })
    );
  },
} satisfies ExportedHandler<Env>;
