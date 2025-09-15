import express from "express";
import fileUpload from "express-fileupload";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  uploadAvatar,
  getUserById,
  unfollowUser,
  followUser,
} from "../controllers/userController.js";

const router = express.Router();

// Upload avatar
router.put(
  "/avatar",
  fileUpload({ useTempFiles: true, tempFileDir: "C:/Temp/" }),
  authMiddleware,
  uploadAvatar
);

// Get user by ID
router.get("/:id", getUserById);

// Follow / Unfollow
router.put("/:id/follow", authMiddleware, followUser);
router.put("/:id/unfollow", authMiddleware, unfollowUser);

export default router;