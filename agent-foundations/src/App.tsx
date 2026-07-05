import { useAgent } from "agents/react";
import type { ChattingRoomAgent, ChattingRoomState } from "../worker/index";
import { useState } from "react";

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [message, setMessage] = useState("");

  const agent = useAgent<ChattingRoomAgent, ChattingRoomState>({
    agent: "ChattingRoomAgent",
    onOpen: () => setIsConnected(true),
    onMessage: (event) => console.log(event),
    // onStateUpdate: (state) => setPingPongs(state.pingPongCount),
  });

  const sendMessage = () => {
    agent.send(message);
    setMessage("");
  };

  if (!isConnected) return <h1>connecting...</h1>;

  return (
    <div>
      <h1>Chatting Room Agent</h1>
      <h3>Online ppl: {agent?.state?.currentlyOnline}</h3>
      <hr />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          autoFocus
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default App;
