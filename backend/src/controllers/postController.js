import Post from "../models/postModel.js";
import { io } from "../index.js";
import Notification from "../models/notificationModel.js";

// 🔹 Create Post
export async function createPost(req, res) {
  try {
    const { title, content, tags, imageUrl } = req.body;
    const newPost = new Post({
      title,
      content,
      tags,
      image: imageUrl || "",
      author: req.user.id,
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Error creating post" });
  }
}

// 🔹 Read all posts
export async function readAllPosts(req, res) {
  const posts = await Post.find().populate("author", "username");
  res.json(posts);
}

// 🔹 Read my posts
export async function readMyPosts(req, res) {
  try {
    const posts = await Post.find({ author: req.user._id }).populate(
      "author",
      "username"
    );
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching your posts" });
  }
}

// 🔹 Read single post
export async function readSinglePost(req, res) {
  try {
    const post = await Post.findById(req.params.id).populate(
      "author",
      "username"
    );
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = req.user.id;
    const isLiked = post.likes.includes(userId);

    res.json({
      ...post.toObject(),
      likes: post.likes.length,
      isLiked,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching post" });
  }
}

// 🔹 Update post
export async function updatePost(req, res) {
  try {
    const updated = await Post.findOneAndUpdate(
      { _id: req.params.id, author: req.user.id },
      req.body,
      { new: true }
    );
    if (!updated)
      return res
        .status(404)
        .json({ message: "Post not found or unauthorized" });
    res.json(updated);
  } catch {
    res.status(500).json({ message: "Error updating post" });
  }
}

// 🔹 Delete post
export async function deletePost(req, res) {
  try {
    const deleted = await Post.findOneAndDelete({
      _id: req.params.id,
      author: req.user.id,
    });
    if (!deleted)
      return res
        .status(404)
        .json({ message: "Post not found or unauthorized" });
    res.json({ message: "Post deleted" });
  } catch {
    res.status(500).json({ message: "Error deleting post" });
  }
}

// 🔹 Toggle Like
export async function toggleLike(req, res) {
  try {
    const post = await Post.findById(req.params.id).populate("author", "username");
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = req.user._id.toString();
    const username = req.user.username;

    let isLiked = post.likes.some((id) => id.toString() === userId);

    if (!isLiked) {
      post.likes.push(userId);
      isLiked = true;

      // ✅ Only create notification if liker is NOT author
      if (post.author._id.toString() !== userId) {
        const notification = await Notification.create({
          user: post.author._id,
          sender: userId,
          post: post._id,
          type: "like",
        });

        // Emit notification
        io.emit("newNotification", {
          id: notification._id,
          type: "like",
          postId: post._id,
          postTitle: post.title,
          senderId: userId,
          senderName: username,
          time: notification.createdAt,
        });
      }
    } else {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
      isLiked = false;
    }

    await post.save();
    res.json({ likes: post.likes.length, isLiked });
  } catch (err) {
    console.error("Error toggling like:", err.message);
    res.status(500).json({ message: "Error toggling like", error: err.message });
  }
}

// 🔹 Fetch posts by user
export async function readPostsByUser(req, res) {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ author: userId })
      .populate("author", "username")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user posts" });
  }
}

// 🔹 Fetch posts by tag
export async function readPostsByTag(req, res) {
  try {
    const { tag } = req.params;
    const posts = await Post.find({ tags: tag })
      .populate("author", "username")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching posts by tag" });
  }
}

// 🔹 Search posts
export async function searchPosts(req, res) {
  try {
    const { q } = req.query;
    const posts = await Post.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      { $unwind: "$author" },
      {
        $match: {
          $or: [
            { title: { $regex: q, $options: "i" } },
            { content: { $regex: q, $options: "i" } },
            { tags: { $regex: q, $options: "i" } },
            { "author.username": { $regex: q, $options: "i" } },
          ],
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    res.json(posts);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: "Error searching posts" });
  }
}
