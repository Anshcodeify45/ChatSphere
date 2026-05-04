import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    text: String, // ✅ FINAL FIELD
    status: {
      type: String,
      default: "sent",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);