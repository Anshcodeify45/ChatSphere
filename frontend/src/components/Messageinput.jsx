import { useState } from "react";
import axios from "axios";
import { socket } from "../socket";

function Messageinput({ senderId, receiverId, setMessages }) {
  const [message, setMessage] = useState("");

  const sendMessage = async () => {
  const newMsg = { senderId, receiverId, message };

  await axios.post("http://localhost:8080/api/messages", newMsg);

  socket.emit("send_message", newMsg);
  setMessage("");
};

  return (
    <div style={{ marginTop: "10px" }}>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default Messageinput;