import express from "express";
import cors from "cors";
import http from "http";
import mongoose from "mongoose";
import { Server } from "socket.io";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

//  CORS 
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://chat-sphere-iota-sepia.vercel.app"
  ],
  credentials: true
}));

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// SOCKET SETUP
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://chat-sphere-iota-sepia.vercel.app"
    ],
    methods: ["GET", "POST"]
  }
});

// Store online users
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // User comes online 
  socket.on("add_user", (userId) => {
    onlineUsers.set(String(userId), socket.id);

    io.emit("online_users", Array.from(onlineUsers.keys()));
    console.log("ONLINE USERS:", onlineUsers);
  });

  // typing
  socket.on("typing", ({ senderId, receiverId }) => {
    const receiverSocketId = onlineUsers.get(String(receiverId));
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("typing", { senderId });
    }
  });

  // stop typing
  socket.on("stop_typing", ({ senderId, receiverId }) => {
    const receiverSocketId = onlineUsers.get(String(receiverId));
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("stop_typing", { senderId });
    }
  });

  // send message
  socket.on("send_message", (data) => {
    const receiverSocketId = onlineUsers.get(String(data.receiverId));
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receive_message", data);
    }
  });

  //  disconnect 
  socket.on("disconnect", () => {
    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }

    io.emit("online_users", Array.from(onlineUsers.keys()));
    console.log("User disconnected:", socket.id);
  });
});

// HOME ROUTE
app.get("/", (req, res) => {
  res.send("Chat API Running");
});

// MONGODB CONNECTION & SERVER START
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    server.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.log(err));