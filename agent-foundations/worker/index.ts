import {
  Agent,
  callable,
  routeAgentRequest,
  type Connection,
  type ConnectionContext,
  type WSMessage,
} from "agents";

export type ChattingRoomState = {
  currentlyOnline: number;
};

export class ChattingRoomAgent extends Agent<Env, ChattingRoomState> {
  initialState = {
    currentlyOnline: 0,
  };

  onStateChanged(
    // 누가 눌렀는지 체크 가능
    state: ChattingRoomState | undefined,
    source: Connection | "server"
  ): void {
    console.log("new state", state);
    console.log("who did it", source);
  }
  onConnect() {
    this.setState({
      currentlyOnline: this.state.currentlyOnline + 1,
    });
  }
  onClose() {
    this.setState({
      currentlyOnline: this.state.currentlyOnline - 1,
    });
  }
  onMessage(connection: Connection, message: WSMessage) {
    console.log(message);
    connection.send("love you back");
  }
}

export default {
  async fetch(request, env) {
    const agentResponse = await routeAgentRequest(request, env);
    if (agentResponse) return agentResponse;
    return new Response(null, { status: 404 });
  },
} satisfies ExportedHandler<Env>;
