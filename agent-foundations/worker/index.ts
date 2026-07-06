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

  onStart() {
    void this.sql`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nickname TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at INTEGER NOT NULL
      )
    `;
  }

  onStateChanged(
    // 누가 눌렀는지 체크 가능
    state: ChattingRoomState | undefined,
    source: Connection | "server"
  ): void {
    console.log("new state", state);
    console.log("who did it", source);
  }

  validateStateChange(
    _nextState: ChattingRoomState,
    source: Connection | "server"
  ): void {
    if (source !== "server") throw new Error("cant do this.");
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
    const messageObj = {
      nickname: "anon",
      message: message.toString(),
      created_at: Date.now(),
    };
    void this.sql`
      INSERT INTO messages (nickname, message, created_at) VALUES (${messageObj.nickname}, ${messageObj.message}, ${messageObj.created_at})
      `;
    this.broadcast(JSON.stringify(messageObj), [connection.id]);
  }
}

export default {
  async fetch(request, env) {
    const agentResponse = await routeAgentRequest(request, env);
    if (agentResponse) return agentResponse;
    return new Response(null, { status: 404 });
  },
} satisfies ExportedHandler<Env>;
