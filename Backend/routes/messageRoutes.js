import express from "express";
import Message from "../models/Message.js";

const router = express.Router();

// Send message
router.post("/", async (req, res) => {
  const msg = await Message.create(req.body);
  res.json(msg);
});

// Get messages between two users
router.get("/:senderId/:receiverId", async (req, res) => {
  const messages = await Message.find({
    $or: [
      {
        senderId: req.params.senderId,
        receiverId: req.params.receiverId
      },
      {
        senderId: req.params.receiverId,
        receiverId: req.params.senderId
      }
    ]
  });

  res.json(messages);
});

export default router;