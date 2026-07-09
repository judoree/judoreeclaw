import { AIChatAgent } from "@cloudflare/ai-chat";
import { routeAgentRequest } from "agents";

export class PotatoChatAgent extends AIChatAgent<Env> {
  async onChatMessage() {
    console.log(JSON.stringify(this.messages));
    return new Response("hello");
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
