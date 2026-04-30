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
      text, // ✅ consistent field
      status: "sent"
    });

    res.json(msg);
  } catch (error) {
    console.log("SEND ERROR:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Get messages between two users
router.get("/:senderId/:receiverId", async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId }
      ]
    }).sort({ createdAt: 1 });

    // ✅ update seen status only if not already seen
    await Message.updateMany(
      {
        senderId: receiverId,
        receiverId: senderId,
        status: { $ne: "seen" }
      },
      { status: "seen" }
    );

    res.json(messages);
  } catch (error) {
    console.log("FETCH ERROR:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;