import { useState } from "react";
import axios from "axios";
import { socket } from "../socket";

function Messageinput({ senderId, receiverId, setMessages }) {
  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    if (!message.trim() || !receiverId) return;

    const msgData = {
      senderId,
      receiverId,
      message,
      createdAt: new Date(),
    };

    try {
      // 1. Save in DB
      const res = await axios.post(
        "http://localhost:8080/api/messages",
        msgData
      );

      const savedMessage = res.data;

      // 2. Update UI instantly
      setMessages((prev) => [...prev, savedMessage]);

      // 3. Send via socket (REAL-TIME)
      socket.emit("send_message", savedMessage);

      setMessage("");
    } catch (err) {
      console.log("Error sending message:", err);
    }
  };

  return (
    <>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        style={{
          flex: 1,
          padding: "10px",
          borderRadius: "20px",
          border: "1px solid #ccc",
          outline: "none",
        }}
      />

      <button
        onClick={sendMessage}
        style={{
          marginLeft: "10px",
          padding: "10px 16px",
          borderRadius: "20px",
          border: "none",
          background: "#075e54",
          color: "white",
          cursor: "pointer",
        }}
      >
        Send
      </button>
    </>
  );
}

export default Messageinput;