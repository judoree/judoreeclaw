import { Agent, callable, routeAgentRequest } from "agents";

export type PingPongState = {
  pingPongCount: number;
};

export class ChattingRoomAgent extends Agent<Env, PingPongState> {
  initialState = {
    pingPongCount: 0,
  };

  @callable()
  increment() {
    this.setState({
      pingPongCount: this.state.pingPongCount + 1,
    });
  }

  @callable()
  decrement() {
    this.setState({
      pingPongCount: this.state.pingPongCount - 1,
    });
  }
}

export default {
  async fetch(request, env) {
    const agentResponse = await routeAgentRequest(request, env);
    if (agentResponse) return agentResponse;
    return new Response(null, { status: 404 });
  },
} satisfies ExportedHandler<Env>;
