import { useEffect, useState } from "react";
import axios from "axios";
import { socket } from "../socket";
import Messageinput from "./Messageinput";

function Chat({ selectedUser }) {
  const [messages, setMessages] = useState([]);

  const senderId = "69ec4fab48df3ed351a7b649";
  const receiverId = selectedUser?._id;

 
  if (!selectedUser) {
    return <h3 style={{ padding: 20 }}>Select a user to start chat</h3>;
  }

  // Load old messages
  useEffect(() => {
    if (!receiverId) return;

    axios
      .get(`http://localhost:8080/api/messages/${senderId}/${receiverId}`)
      .then((res) => setMessages(res.data))
      .catch((err) => console.log(err));

  }, [receiverId]);

  // Real-time messages
  useEffect(() => {
    const handler = (data) => {
      setMessages((prev) => [...prev, data]);
    };

    socket.on("receive_message", handler);

    return () => socket.off("receive_message", handler);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Chat with {selectedUser.name}</h2>

      {/* Messages Box */}
      <div
        style={{
          height: 300,
          overflowY: "scroll",
          border: "1px solid gray",
          padding: 10
        }}
      >
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>
              {msg.senderId === senderId ? "You" : selectedUser.name}:
            </strong>{" "}
            {msg.message}
          </div>
        ))}
      </div>

      {/* Input Component */}
      <Messageinput
        senderId={senderId}
        receiverId={receiverId}
        setMessages={setMessages}
      />
    </div>
  );
}

export default Chat;