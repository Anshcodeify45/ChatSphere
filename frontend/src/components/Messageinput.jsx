import { useState } from "react";
import axios from "axios";
import { socket } from "../socket";

function Messageinput({ senderId, receiverId, setMessages }) {
  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    if (!message.trim()) return;

    const msgData = {
      senderId,
      receiverId,
      text: message,
    };

    try {
      const res = await axios.post(
        "http://localhost:8080/api/messages",
        msgData
      );

      const savedMessage = res.data;

      setMessages((prev) => [...prev, savedMessage]);

      socket.emit("send_message", savedMessage);
      socket.emit("refresh_sidebar");
      setMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  // 🔥 Enter to send
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div
      style={{
        padding: "12px",
        borderTop: "1px solid #374151",
        background: "#020617",
        display: "flex",
        alignItems: "center",
        gap: "10px"
      }}
    >
      {/* Input */}
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        style={{
          flex: 1,
          padding: "10px 14px",
          borderRadius: "20px",
          border: "none",
          outline: "none",
          background: "#1e293b",
          color: "white",
          fontSize: "14px"
        }}
      />

      {/* Send Button */}
      <button
        onClick={sendMessage}
        style={{
          padding: "10px 16px",
          borderRadius: "20px",
          border: "none",
          background: "#2563eb",
          color: "white",
          cursor: "pointer",
          fontWeight: "bold"
        }}
      >
        Send
      </button>
    </div>
  );
}

export default Messageinput;