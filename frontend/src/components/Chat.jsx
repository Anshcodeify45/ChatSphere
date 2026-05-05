import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { socket } from "../socket";
import Messageinput from "./Messageinput";

// typing CSS
const typingCSS = `
.dot {
  width: 6px;
  height: 6px;
  background-color: white;
  border-radius: 50%;
  display: inline-block;
  animation: bounce 1.2s infinite ease-in-out;
}

.dot:nth-child(2) { animation-delay: 0.2s; }
.dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
  40% { transform: scale(1); opacity: 1; }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
`;

function Chat({ selectedUser, onlineUsers = [] }) {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const senderId = currentUser?._id;
  const receiverId = selectedUser?._id;
  const isOnline = onlineUsers.includes(selectedUser?._id);

  // inject css
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = typingCSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      if (!senderId || !receiverId) return;

      const res = await axios.get(
        `http://localhost:8080/api/messages/${senderId}/${receiverId}`
      );
      setMessages(res.data);
    };

    fetchMessages();
  }, [senderId, receiverId]);

  // receive message
  useEffect(() => {
    const handler = (data) => {
      const isChat =
        (String(data.senderId) === String(senderId) &&
          String(data.receiverId) === String(receiverId)) ||
        (String(data.senderId) === String(receiverId) &&
          String(data.receiverId) === String(senderId));

      if (!isChat) return;

      setMessages((prev) => {
        const exists = prev.some((m) => m._id === data._id);
        return exists ? prev : [...prev, data];
      });
    };

    socket.on("receive_message", handler);
    return () => socket.off("receive_message", handler);
  }, [senderId, receiverId]);

  // typing
  useEffect(() => {
    socket.on("typing", ({ senderId }) => {
      if (String(senderId) === String(receiverId)) setIsTyping(true);
    });

    socket.on("stop_typing", ({ senderId }) => {
      if (String(senderId) === String(receiverId)) setIsTyping(false);
    });

    return () => {
      socket.off("typing");
      socket.off("stop_typing");
    };
  }, [receiverId]);

  // auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/*  HEADER (PROFILE SECTION) */}
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid #1f2937",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "linear-gradient(90deg, #0f172a, #111827)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* avatar */}
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "#2563eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
            }}
          >
            {selectedUser.name?.charAt(0).toUpperCase()}
          </div>

          {/* name */}
          <div>
            <div style={{ fontSize: "15px", fontWeight: "bold" }}>
              {selectedUser.name}
            </div>
            <div style={{ fontSize: "12px", color: "#9ca3af", display: "flex", alignItems: "center", gap: "6px" }}>
                    {isTyping ? (
                      "typing..."
                    ) : isOnline ? (
                      <>
                        <span
                          style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            background: "#22c55e",
                            display: "inline-block",
                          }}
                        />
                        online
                      </>
                    ) : (
                      <>
                        <span
                          style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            background: "#6b7280",
                            display: "inline-block",
                          }}
                        />
                        offline
                      </>
                    )}
                  </div>
          </div>
        </div>

        <div style={{ color: "#9ca3af" }}>⋮</div>
      </div>

      {/*  CHAT BODY */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "12px",
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          background:
            "radial-gradient(circle at top, #0f172a, #020617)",
        }}
      >
        {messages.map((msg) => {
          const isMe = String(msg.senderId) === String(senderId);

          return (
            <div
              key={msg._id}
              style={{
                display: "flex",
                justifyContent: isMe ? "flex-end" : "flex-start",
                animation: "fadeIn 0.2s ease-in-out",
              }}
            >
              <div
                style={{
                  background: isMe ? "#2563eb" : "#1f2937",
                  padding: "10px 12px",
                  borderRadius: isMe
                    ? "14px 14px 4px 14px"
                    : "14px 14px 14px 4px",
                  maxWidth: "65%",
                  color: "white",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                  wordBreak: "break-word",
                }}
              >
                {msg.text}

                <div
                  style={{
                    fontSize: "10px",
                    marginTop: "4px",
                    opacity: 0.6,
                    textAlign: "right",
                  }}
                >
                  {msg.createdAt
                    ? new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </div>
              </div>
            </div>
          );
        })}

        {/* typing indicator */}
        {isTyping && (
          <div style={{ display: "flex" }}>
            <div
              style={{
                background: "#1f2937",
                padding: "10px 14px",
                borderRadius: "12px",
                display: "flex",
                gap: "6px",
              }}
            >
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <Messageinput
        senderId={senderId}
        receiverId={receiverId}
        setMessages={setMessages}
      />
    </div>
  );
}

export default Chat;