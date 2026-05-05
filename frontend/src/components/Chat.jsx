import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { socket } from "../socket";
import Messageinput from "./Messageinput";

// ✅ CSS as const
const typingCSS = `
.dot {
  width: 6px;
  height: 6px;
  background-color: white;
  border-radius: 50%;
  display: inline-block;
  animation: bounce 1.2s infinite ease-in-out;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
}

.dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0.6);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}
`;

function Chat({ selectedUser }) {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const senderId = currentUser?._id;
  const receiverId = selectedUser?._id;

  // ✅ Inject CSS ONCE
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = typingCSS;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // ✅ FETCH MESSAGES
  useEffect(() => {
    const fetchMessages = async () => {
      if (!senderId || !receiverId) return;

      try {
        const res = await axios.get(
          `http://localhost:8080/api/messages/${senderId}/${receiverId}`
        );
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchMessages();
  }, [senderId, receiverId]);

  // ✅ SOCKET: RECEIVE MESSAGE
  useEffect(() => {
    const handler = (data) => {
      const isChat =
        (String(data.senderId) === String(senderId) &&
          String(data.receiverId) === String(receiverId)) ||
        (String(data.senderId) === String(receiverId) &&
          String(data.receiverId) === String(senderId));

      if (!isChat) return;

      setMessages((prev) => {
        const exists = prev.some((msg) => msg._id === data._id);
        if (exists) return prev;
        return [...prev, data];
      });
    };

    socket.on("receive_message", handler);
    return () => socket.off("receive_message", handler);
  }, [senderId, receiverId]);

  // ✅ SOCKET: TYPING
  useEffect(() => {
    socket.on("typing", ({ senderId }) => {
      if (String(senderId) === String(receiverId)) {
        setIsTyping(true);
      }
    });

    socket.on("stop_typing", ({ senderId }) => {
      if (String(senderId) === String(receiverId)) {
        setIsTyping(false);
      }
    });

    return () => {
      socket.off("typing");
      socket.off("stop_typing");
    };
  }, [receiverId]);

  // ✅ AUTO SCROLL
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // ✅ EMPTY STATE
  if (!selectedUser) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
        }}
      >
        Select a user to start chat
      </div>
    );
  }

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          padding: "12px",
          borderBottom: "1px solid #333",
          color: "white",
        }}
      >
        {selectedUser.name}
      </div>

      {/* CHAT BODY */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "10px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
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
                marginBottom: "8px",
              }}
            >
              <div
                style={{
                  background: isMe ? "#2563eb" : "#374151",
                  padding: "10px",
                  borderRadius: "10px",
                  maxWidth: "60%",
                  color: "white",
                }}
              >
                {msg.text}

                <div
                  style={{
                    fontSize: "10px",
                    marginTop: "4px",
                    opacity: 0.7,
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

        {/* ✅ TYPING BUBBLE */}
        {isTyping && (
          <div style={{ display: "flex", marginTop: "5px" }}>
            <div
              style={{
                background: "#374151",
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