import express from "express";
import {
  createPost,
  readAllPosts,
  readMyPosts,
  readSinglePost,
  updatePost,
  deletePost,
  toggleLike,
  readPostsByUser,
  readPostsByTag,
  searchPosts,
} from "../controllers/postController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
//
const router = express.Router();

// ✅ All posts (optional: public)
router.get("/", readAllPosts);

// ✅ My posts (protected)
router.get("/me", authMiddleware, readMyPosts);


// ✅ Toggle like (protected)
router.post("/:id/like", authMiddleware, toggleLike);

// ✅ User posts
router.get("/user/:userId", readPostsByUser);

// ✅ Posts by tag
router.get("/tag/:tag", readPostsByTag);
// ✅ Search
router.get("/search", searchPosts);

// ✅ Single post (protected)
router.get("/:id", authMiddleware, readSinglePost);



// ✅ Create / Update / Delete (protected)
router.post("/", authMiddleware, createPost);
router.put("/:id", authMiddleware, updatePost);
router.delete("/:id", authMiddleware, deletePost);

export default router;
