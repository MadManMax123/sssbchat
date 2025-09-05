import { useEffect, useState } from "react";
import { getHistory, sendMessage } from "./api";

export default function Chat({ username }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    async function fetchHistory() {
      const history = await getHistory();
      setMessages(history);
    }
    fetchHistory();
    const interval = setInterval(fetchHistory, 3000); // poll every 3s
    return () => clearInterval(interval);
  }, []);

  async function handleSend() {
    const receiver = username === "userA" ? "userB" : "userA";
    await sendMessage(username, receiver, input);
    setInput("");
  }

  return (
    <div className="p-4">
      <div className="border h-64 overflow-y-scroll mb-2">
        {messages.map((msg, i) => (
          <div key={i} className={msg.sender === username ? "text-right" : "text-left"}>
            <b>{msg.sender}</b>: {msg.message}
          </div>
        ))}
      </div>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}
