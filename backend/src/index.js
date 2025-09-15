import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server as SocketServer } from "socket.io";
import jwt from "jsonwebtoken";

import dbConnect from "./config/dbConnect.js";
import Notification from "./models/notificationModel.js";
import Post from "./models/postModel.js";
import User from "./models/userModel.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

dbConnect();

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json({ limit: "20mb" }));

// --- Routes ---
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import userRoutes from "./routes/userRoutes.js";

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/image", uploadRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api", notificationRoutes);

// --- Server ---
const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: { origin: process.env.CLIENT_URL || "*", methods: ["GET", "POST"] },
});

// Map to track online users
const onlineUsers = new Map(); // userId -> socketId

// Socket authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error("No token provided"));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    onlineUsers.set(decoded.id, socket.id);
    next();
  } catch (err) {
    next(new Error("Invalid token"));
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.userId);

  // Handle post likes
  socket.on("likePost", async ({ postId }) => {
    try {
      const post = await Post.findById(postId).populate("author", "username");
      if (!post) return;

      // ✅ Only notify if liker is NOT the author
      if (post.author._id.toString() !== socket.userId) {
        const actor = await User.findById(socket.userId).select("username");

        const notification = await Notification.create({
          user: post.author._id,  // recipient
          sender: socket.userId,   // actor
          post: postId,
          type: "like",
        });

        // Emit only to the recipient if online
        const recipientSocketId = onlineUsers.get(post.author._id.toString());
        if (recipientSocketId) {
          io.to(recipientSocketId).emit("newNotification", {
            id: notification._id,
            type: "like",
            postId: post._id,
            postTitle: post.title,
            senderId: socket.userId,
            senderName: actor.username,
            time: notification.createdAt,
          });
        }
      }
    } catch (err) {
      console.error("likePost error:", err.message);
    }
  });

  // Handle post comments
  socket.on("commentPost", async ({ postId, commentId }) => {
    try {
      const post = await Post.findById(postId).populate("author", "username");
      if (!post) return;

      // ✅ Only notify if commenter is NOT the author
      if (post.author._id.toString() !== socket.userId) {
        const actor = await User.findById(socket.userId).select("username");

        const notification = await Notification.create({
          user: post.author._id,  // recipient
          sender: socket.userId,   // actor
          post: postId,
          type: "comment",
        });

        const recipientSocketId = onlineUsers.get(post.author._id.toString());
        if (recipientSocketId) {
          io.to(recipientSocketId).emit("newNotification", {
            id: notification._id,
            type: "comment",
            postId: post._id,
            postTitle: post.title,
            commentId,
            senderId: socket.userId,
            senderName: actor.username,
            time: notification.createdAt,
          });
        }
      }
    } catch (err) {
      console.error("commentPost error:", err.message);
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.userId);
    onlineUsers.delete(socket.userId);
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export { io };
