import Notification from "../models/notificationModel.js";

export async function getNotifications(req, res) {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .populate("sender", "username")   // ✅ gives username instead of ObjectId
      .populate("post", "title")        // ✅ gives post title
      .sort({ createdAt: -1 });

    // Format response so frontend gets clean fields
    const formatted = notifications.map((n) => ({
      id: n._id,
      type: n.type,
      read: n.read,
      time: n.createdAt,
      senderName: n.sender?.username || "Unknown",
      postTitle: n.post?.title || "Untitled",
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ message: "Error fetching notifications" });
  }
}
