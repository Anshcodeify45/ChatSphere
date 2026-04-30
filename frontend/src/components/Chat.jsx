import { useEffect, useState } from "react";
import axios from "axios";
import { socket } from "../socket";
import Messageinput from "./Messageinput";

function Chat({ selectedUser }) {
  const [messages, setMessages] = useState([]);
  console.log("MESSAGES:", messages);

  const senderId = "69ec4fab48df3ed351a7b649";
  const receiverId = selectedUser?._id;

  // ✅ 1. Register user in socket (ONCE)
  useEffect(() => {
    socket.emit("add_user", senderId);
  }, [senderId]);

  // ✅ 2. Fetch old messages when user changes
  useEffect(() => {
    if (!receiverId) return;

    axios
      .get(`http://localhost:8080/api/messages/${senderId}/${receiverId}`)
      .then((res) => setMessages(res.data))
      .catch((err) => console.log(err));
  }, [receiverId]);

  // ✅ 3. Real-time message listener (ONLY ONE)
  useEffect(() => {
    if (!receiverId) return;

    const handler = (data) => {
  const isValidChat =
    (data.senderId === senderId && data.receiverId === receiverId) ||
    (data.senderId === receiverId && data.receiverId === senderId);

  if (isValidChat) {
    console.log("RECEIVED MESSAGE:", data); // ✅ correct log

    setMessages((prev) => [...prev, data]); // ✅ correct update
  }
};

    socket.on("receive_message", handler);

    return () => {
      socket.off("receive_message", handler);
    };
  }, [receiverId, senderId]);

  // ---------- helpers ----------
  const formatTime = (time) => {
    const date = new Date(time);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusIcon = (status) => {
    if (status === "sent") return "✔";
    if (status === "delivered") return "✔✔";
    if (status === "seen") return "✔✔";
  };

  if (!selectedUser) {
    return <h3 style={{ padding: 20 }}>Select a user to start chat</h3>;
  }

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#e5ddd5",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "15px",
          background: "#075e54",
          color: "white",
          fontWeight: "bold",
        }}
      >
        {selectedUser?.name}
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          padding: "15px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {messages.map((msg, index) => {
          const isMe = String(msg.senderId) === String(senderId);

          return (
            <div
              key={index}
              style={{
                alignSelf: isMe ? "flex-end" : "flex-start",
                maxWidth: "60%",
                padding: "10px 14px",
                borderRadius: "10px",
                background: isMe ? "#dcf8c6" : "white",
                fontSize: "14px",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span>{msg.message}</span>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "5px",
                    marginTop: "4px",
                  }}
                >
                  <span style={{ fontSize: "10px", color: "#555" }}>
                    {msg.createdAt ? formatTime(msg.createdAt) : ""}
                  </span>

                  <span
                    style={{
                      fontSize: "10px",
                      color: msg.status === "seen" ? "blue" : "gray",
                    }}
                  >
                    {getStatusIcon(msg.status)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div
        style={{
          display: "flex",
          padding: "10px",
          background: "#f0f0f0",
        }}
      >
        <Messageinput
          senderId={senderId}
          receiverId={receiverId}
          setMessages={setMessages}
        />
      </div>
    </div>
  );
}

export default Chat;