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

  // 🔥 RESET CHAT WHEN USER CHANGES
  useEffect(() => {
    setMessages([]); // important reset
  }, [receiverId]);

  // ✅ FETCH MESSAGES
  useEffect(() => {
    if (!receiverId || !senderId) return;

    axios
      .get(`http://localhost:8000/api/messages/${senderId}/${receiverId}`)
      .then((res) => {
        setMessages(res.data);
      })
      .catch((err) => console.log(err));
  }, [receiverId, senderId]);

  // ✅ REALTIME SOCKET
  useEffect(() => {
    const handler = (data) => {
      const isChat =
        (String(data.senderId) === String(senderId) &&
          String(data.receiverId) === String(receiverId)) ||
        (String(data.senderId) === String(receiverId) &&
          String(data.receiverId) === String(senderId));

      if (isChat) {
        setMessages((prev) => [...prev, data]);
      }
    };

    socket.on("receive_message", handler);

    return () => socket.off("receive_message", handler);
  }, [receiverId, senderId]);

  // 🔥 AUTO SCROLL
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!selectedUser) {
    return (
      <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
        Select a user to start chat
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      
      {/* HEADER */}
      <div style={{ padding: "12px", borderBottom: "1px solid #333" }}>
        {selectedUser.name}
      </div>

      {/* CHAT BODY */}
      <div style={{ flex: 1, overflowY: "auto", padding: "10px" }}>
        {messages.map((msg, i) => {
          const isMe = String(msg.senderId) === String(senderId);

          return (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: isMe ? "flex-end" : "flex-start",
                marginBottom: "8px"
              }}
            >
              <div
                style={{
                  background: isMe ? "#2563eb" : "#374151",
                  padding: "10px",
                  borderRadius: "10px",
                  maxWidth: "60%",
                  color: "white"
                }}
              >
                {msg.text}

                {/* time */}
                <div style={{ fontSize: "10px", marginTop: "4px", opacity: 0.7 }}>
                  {msg.createdAt
                    ? new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit"
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