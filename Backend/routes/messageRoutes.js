import express from "express";
import Message from "../models/Message.js";

const router = express.Router();

// ✅ Send message
router.post("/", async (req, res) => {
  try {
    const { senderId, receiverId, text } = req.body;

    const msg = await Message.create({
      senderId,
      receiverId,
      text,
      status: "sent",
    });

    res.json(msg);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Get messages
router.get("/:senderId/:receiverId", async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;