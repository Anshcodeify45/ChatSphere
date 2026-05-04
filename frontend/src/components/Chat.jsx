import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { socket } from "../socket";
import Messageinput from "./Messageinput";

function Chat({ selectedUser }) {
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef();

  const user = JSON.parse(localStorage.getItem("user"));
  const senderId = user?._id;
  const receiverId = selectedUser?._id;

  // ✅ Fetch messages
  useEffect(() => {
    if (!receiverId) return;

    axios
      .get(`http://localhost:8080/api/messages/${senderId}/${receiverId}`)
      .then((res) => setMessages(res.data));
  }, [receiverId]);

  // ✅ Real-time listener
  useEffect(() => {
    const handler = (data) => {
      const isValidChat =
        (String(data.senderId) === String(senderId) &&
          String(data.receiverId) === String(receiverId)) ||
        (String(data.senderId) === String(receiverId) &&
          String(data.receiverId) === String(senderId));

      if (isValidChat) {
        setMessages((prev) => [...prev, data]);
      }
    };

    socket.on("receive_message", handler);
    return () => socket.off("receive_message", handler);
  }, [receiverId, senderId]);

  // ✅ Auto scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!selectedUser)
    return (
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <h3>Select user</h3>
      </div>
    );

  const formatTime = (date) => {
  const d = new Date(date);
  return d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
};

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
        background: "#0f172a",
        color: "white"
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "15px",
          borderBottom: "1px solid #374151",
          fontWeight: "bold"
        }}
      >
        {selectedUser.name}
      </div>

      {/* Messages */}
      <div
        className="hide-scrollbar"
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "10px",
          display: "flex",
          flexDirection: "column"
        }}
      >
        {messages.map((msg, i) => {
          const isMyMessage = String(msg.senderId) === String(senderId);

          return (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: isMyMessage ? "flex-end" : "flex-start",
                marginBottom: "8px"
              }}
            >
              <div
                style={{
                  maxWidth: "60%",
                  padding: "10px",
                  borderRadius: isMyMessage
                    ? "10px 10px 0 10px"
                    : "10px 10px 10px 0",
                  background: isMyMessage ? "#2563eb" : "#374151",
                  color: "white"
                }}
              >
                {msg.text}

                {/* Time */}
            <span
              style={{
                fontSize: "11px",
                color: "#9ca3af",
                marginTop: "6px",   // 🔥 increased spacing
                paddingLeft: "4px"
              }}
            >
              {formatTime(msg.createdAt || new Date())}
            </span>
              </div>
            </div>
          );
        })}

        {/* Auto scroll target */}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <Messageinput
        senderId={senderId}
        receiverId={receiverId}
        setMessages={setMessages}
      />
    </div>
  );
}

export default Chat;