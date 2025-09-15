import express from "express";
import { addComment, getComments, deleteComment } from "../controllers/commentController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET comments for a post
router.get("/:postId", getComments);

// POST new comment
router.post("/:postId", authMiddleware, addComment);

// DELETE comment by ID
router.delete("/:id", authMiddleware, deleteComment);

export default router;
