import express from "express";
import cors from "cors";
import http from "http";
import mongoose from "mongoose";
import { Server } from "socket.io";
import authRoutes from "./routes/authRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());



app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // user joins with their ID
  socket.on("add_user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  // send message
  socket.on("send_message", (data) => {
    const receiverSocketId = onlineUsers.get(data.receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receive_message", data);
    }
  });

  socket.on("disconnect", () => {
    for (let [userId, sockId] of onlineUsers.entries()) {
      if (sockId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
  });
});

app.get("/", (req, res) => {
  res.send("Chat API Running");
});

mongoose.connect("mongodb://anishpatnaik45:anshcode45@ac-9toov8i-shard-00-00.xr2kykj.mongodb.net:27017,ac-9toov8i-shard-00-01.xr2kykj.mongodb.net:27017,ac-9toov8i-shard-00-02.xr2kykj.mongodb.net:27017/?ssl=true&replicaSet=atlas-8rzsgx-shard-0&authSource=admin&appName=Cluster0")
  .then(() => {
    console.log("MongoDB Atlas connected");

    server.listen(8080, () => {
      console.log("Server running on port 8080");
    });
  })
  .catch(err => console.log("DB Error:", err));