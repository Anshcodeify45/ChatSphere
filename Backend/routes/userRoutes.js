import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;

    const users = await User.find({
      _id: { $ne: userId },
    }).select("-password");

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;