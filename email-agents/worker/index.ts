import { AIChatAgent } from "@cloudflare/ai-chat";
import { routeAgentEmail, routeAgentRequest } from "agents";
import { createAddressBasedEmailResolver, type AgentEmail } from "agents/email";
import PostalMime from "postal-mime";

export class EmailAgent extends AIChatAgent<Env> {
  async onEmail(email: AgentEmail) {
    const raw = await email.getRaw();
    const parsed = await PostalMime.parse(raw);
    console.log(parsed.to, parsed.from, parsed.text);
  }
}

export default {
  fetch(request, env) {
    console.log(request.url);
    return (
      routeAgentRequest(request, env) ?? new Response(null, { status: 404 })
    );
  },
  async email(message, env) {
    await routeAgentEmail(message, env, {
      resolver: createAddressBasedEmailResolver("EmailAgent"),
    });
  },
} satisfies ExportedHandler<Env>;
