import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { socket } from "../socket";
import Messageinput from "./Messageinput";

function Chat({ selectedUser }) {
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const senderId = currentUser?._id;
  const receiverId = selectedUser?._id;

  // ✅ FETCH MESSAGES (Single Source of Truth)
  useEffect(() => {
    const fetchMessages = async () => {
      if (!senderId || !receiverId) return;

      try {
        console.log("Fetching messages...");

        const res = await axios.get(
          `http://localhost:8080/api/messages/${senderId}/${receiverId}`
        );

        console.log("DATA:", res.data);

        setMessages(res.data); // ✅ clean set (no race condition)
      } catch (err) {
        console.log(err);
      }
    };

    fetchMessages();
  }, [senderId, receiverId]);

  // ✅ SOCKET (Realtime messages with duplicate protection)
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

  // ✅ AUTO SCROLL (only when messages exist)
  useEffect(() => {
    if (messages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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
    <div style={{ flex: 1, display: "flex",height:"100%"  ,flexDirection: "column" }}>
      {/* HEADER */}
      <div style={{ padding: "12px", borderBottom: "1px solid #333", color: "white" }}>
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