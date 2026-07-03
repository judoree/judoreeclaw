import { Agent } from "agents";

export class ChattingRoomAgent extends Agent {}

export default {
  fetch() {
    return new Response(null, { status: 404 });
  },
} satisfies ExportedHandler<Env>;
