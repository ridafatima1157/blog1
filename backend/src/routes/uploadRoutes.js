import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js"; // make sure this exports configured cloudinary

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "blog_posts",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const parser = multer({ storage });

router.post("/upload", parser.single("image"), async (req, res) => {
  try {
    console.log("📥 File received:", req.file);

    if (!req.file || !req.file.path) {
      throw new Error("File upload failed at multer step");
    }

    // multer-storage-cloudinary usually returns `req.file.path` as the uploaded URL
    // Some versions use `req.file.filename` or `req.file.originalname`—adjust if needed
    res.json({ imageUrl: req.file.path }); // ✅ return `imageUrl` to match frontend
  } catch (err) {
    console.error("🔥 Upload error:", err);
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
});

export default router;
