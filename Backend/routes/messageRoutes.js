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

router.get("/conversations/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }]
    })
    .populate("senderId", "name")
    .populate("receiverId", "name")
    .sort({ createdAt: -1 });

    const usersMap = new Map();

    messages.forEach((msg) => {
      const sender = msg.senderId;
      const receiver = msg.receiverId;

      const otherUser =
        String(sender._id) === String(userId) ? receiver : sender;

      if (!otherUser) return;

      usersMap.set(String(otherUser._id), otherUser);
    });

    res.json([...usersMap.values()]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Get messages (KEEP THIS BELOW)
router.get("/:senderId/:receiverId", async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    })
      .populate("senderId", "name")
      .populate("receiverId", "name")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;