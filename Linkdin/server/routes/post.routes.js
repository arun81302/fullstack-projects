import express from "express";

import isAuth from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js";


import {
  createPost,
  getAllPosts,
  deletePost,
  toggleLike,
  addComment,
  deleteComment,
  getUserPosts,
} from "../controllers/post.controllers.js";

const postRouter = express.Router();

// All users can view posts
postRouter.get("/all", getAllPosts);

// Only authenticated users can create posts
postRouter.post("/create", isAuth, upload.single("image"), createPost);

// Only the post owner can delete
postRouter.delete("/delete/:id", isAuth, deletePost);

// Like and unlike
postRouter.put("/like/:id", isAuth, toggleLike);

// Add comment
postRouter.post("/comment/:id", isAuth, addComment);

// Delete own comment
postRouter.delete(
  "/comment/:id/:commentId",
  isAuth,
  deleteComment
);
postRouter.get("/user/:userId", isAuth, getUserPosts);
export default postRouter;