import cloudinary from "cloudinary";
import User from "../models/userModel.js";

export const uploadAvatar = async (req, res) => {
  try {
    if (!req.files?.avatar) {
      return res.status(400).json({ message: "No image provided" });
    }

    const file = req.files.avatar;
    const uploadRes = await cloudinary.v2.uploader.upload(file.tempFilePath, {
      folder: "avatars",
      public_id: `${req.user._id}_avatar`,
      overwrite: true,
      transformation: [{ width: 300, height: 300, crop: "fill", gravity: "face" }],
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: uploadRes.secure_url },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (err) {
    console.error("Error uploading avatar:", err);
    res.status(500).json({ message: err.message || "Error uploading avatar" });
  }
};
//
// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: err.message || "Error fetching user" });
  }
};
// Follow a user
export const followUser = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const loggedInUserId = req.user._id.toString();

    if (targetUserId === loggedInUserId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    // Ensure both users exist
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) return res.status(404).json({ message: "User not found" });

    const loggedInUser = await User.findById(loggedInUserId);
    if (!loggedInUser) {
      return res.status(401).json({ message: "Invalid logged-in user" });
    }

    // Atomic updates
    await User.findByIdAndUpdate(targetUserId, {
      $addToSet: { followers: loggedInUserId },
    });

    await User.findByIdAndUpdate(loggedInUserId, {
      $addToSet: { following: targetUserId },
    });

    const updatedTarget = await User.findById(targetUserId).select("-password");

    res.json({
      message: "Followed successfully",
      followers: updatedTarget.followers.length,
    });
  } catch (err) {
    console.error("Follow error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

export const unfollowUser = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const loggedInUserId = req.user._id.toString();

    if (targetUserId === loggedInUserId) {
      return res.status(400).json({ message: "You cannot unfollow yourself" });
    }

    await User.findByIdAndUpdate(targetUserId, {
      $pull: { followers: loggedInUserId },
    });

    await User.findByIdAndUpdate(loggedInUserId, {
      $pull: { following: targetUserId },
    });

    const updatedTarget = await User.findById(targetUserId).select("-password");

    res.json({
      message: "Unfollowed successfully",
      followers: updatedTarget.followers.length,
    });
  } catch (err) {
    console.error("Unfollow error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

