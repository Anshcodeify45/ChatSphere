import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
});

// Login 
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email, password }).select("-password");

  if (!user) return res.status(400).json({ msg: "Invalid" });

  res.json(user);
});

//get users
router.get("/users", async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

export default router;