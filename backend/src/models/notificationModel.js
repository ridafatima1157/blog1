import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // recipient
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // actor
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    type: { type: String, enum: ["like", "comment", "follow"], required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
