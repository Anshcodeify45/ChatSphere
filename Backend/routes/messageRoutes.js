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

// ✅ Get chat messages
router.get("/conversations/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: userId },
        { receiverId: userId }
      ]
    })
      .populate("senderId", "name email")
      .populate("receiverId", "name email")
      .sort({ createdAt: -1 });

    const usersMap = new Map();

    messages.forEach((msg) => {
      const isSender = String(msg.senderId._id) === String(userId);
      const otherUser = isSender ? msg.receiverId : msg.senderId;

      usersMap.set(String(otherUser._id), {
        _id: otherUser._id,
        name: otherUser.name,
        email: otherUser.email,
        lastMessage: msg.text,
        time: msg.createdAt
      });
    });

    res.json([...usersMap.values()]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:senderId/:receiverId", async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;