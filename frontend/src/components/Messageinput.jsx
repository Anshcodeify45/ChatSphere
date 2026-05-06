import { useState } from "react";
import axios from "axios";
import { socket } from "../socket";

function Messageinput({ senderId, receiverId, setMessages }) {
  const [message, setMessage] = useState("");
  const [typingTimeout, setTypingTimeout] = useState(null);


  const sendMessage = async () => {
  if (!message.trim()) return;

  const msgData = {
    senderId,
    receiverId,
    text: message,
  };

  try {
    const res = await axios.post(
      "https://chatsphere-s39q.onrender.com/api/messages",
      msgData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const savedMessage = res.data;

    console.log("MESSAGE SENT:", savedMessage);

    // update UI immediately
    setMessages((prev) => [...prev, savedMessage]);

    // socket emit (real-time)
    socket.emit("send_message", savedMessage);

    socket.emit("refresh_sidebar");

    setMessage("");
  } catch (err) {
    console.log("SEND MESSAGE ERROR:", err.response?.data || err.message);
  }
};

  //Enter to send
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  

const handleTyping = () => {
  socket.emit("typing", { senderId, receiverId });

  if (typingTimeout) clearTimeout(typingTimeout);

  const timeout = setTimeout(() => {
    socket.emit("stop_typing", { senderId, receiverId });
  }, 1000);

  setTypingTimeout(timeout);
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
    onChange={(e) => {
      setMessage(e.target.value);
      handleTyping();
    }}
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