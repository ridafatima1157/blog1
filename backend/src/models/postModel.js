import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    tags: [String], // optional array of tags
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // 🔑 links post to User collection
      required: true,
    }, image: { type: String },

    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  },
  { timestamps: true } // auto adds createdAt & updatedAt
);

const Post = mongoose.model("Post", postSchema);

export default Post;
