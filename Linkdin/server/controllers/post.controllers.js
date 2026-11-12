import uploadOnCloudinary from "../config/cloudinary.js";
import Post from "../models/post.model.js";

// Nayi post create karne ke liye
export const createPost = async (req, res) => {
  try {
    const { description } = req.body;

    // Check karo ki description ya image mein se kuch diya hai ya nahi
    if (!description?.trim() && !req.file) {
      return res.status(400).json({
        message: "Please write something or upload an image.",
      });
    }

    let image = "";

    // Agar image upload hui hai toh Cloudinary par save karo
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    // Database mein nayi post create karo
    const newPost = await Post.create({
      author: req.userId,
      description: description || "",
      image,
    });

    // Author, likes aur comments ki user details fetch karo
    const populatedPost = await Post.findById(newPost._id)
      .populate("author", "-password")
      .populate("like", "firstName lastName profileImage")
      .populate("comment.user", "firstName lastName profileImage");

    return res.status(201).json({
      message: "Post created successfully",
      post: populatedPost,
    });

  } catch (err) {
    console.log("Create Post Error:", err);

    // Error aane par temporary uploaded image delete karo
    if (req.file?.path) {
      const fs = await import("fs/promises");

      try {
        await fs.unlink(req.file.path);
      } catch (deleteError) {
        if (deleteError.code !== "ENOENT") {
          console.log(deleteError.message);
        }
      }
    }

    return res.status(500).json({
      message: "Error creating post",
      error: err.message,
    });
  }
};


// Saari posts fetch karne ke liye
export const getAllPosts = async (req, res) => {
  try {

    // Posts ke saath author, likes aur comments ki details bhi lao
    const posts = await Post.find()
      .populate("author", "-password")
      .populate("like", "firstName lastName profileImage")
      .populate("comment.user", "firstName lastName profileImage")

      // Latest post sabse pehle show karo
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Posts fetched successfully",
      posts,
    });

  } catch (err) {
    console.log("Get Posts Error:", err.message);

    return res.status(500).json({
      message: "Error fetching posts",
      error: err.message,
    });
  }
};


// Post ko delete karne ke liye
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    // Post ID se database mein post find karo
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    // Check karo ki post current logged-in user ki hi hai
    if (post.author.toString() !== req.userId.toString()) {
      return res.status(403).json({
        message: "You cannot delete another user's post.",
      });
    }

    // Database se post delete karo
    await Post.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Post deleted successfully",
    });

  } catch (err) {
    console.log("Delete Post Error:", err);

    return res.status(500).json({
      message: "Error deleting post",
    });
  }
};


// Post ko like aur unlike karne ke liye
export const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    // Post ID se post find karo
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    // Check karo ki current user ne pehle se like kiya hai ya nahi
    const alreadyLiked = post.like.some(
      (user) => user.toString() === userId.toString()
    );

    if (alreadyLiked) {
      // Pehle se like hai toh user ki ID remove karo
      post.like.pull(userId);
    } else {
      // Like nahi hai toh user ki ID add karo
      post.like.addToSet(userId);
    }

    // Updated likes database mein save karo
    await post.save();

    return res.status(200).json({
      message: alreadyLiked ? "Post unliked" : "Post liked",
      liked: !alreadyLiked,
      likesCount: post.like.length,
    });

  } catch (err) {
    console.log("Toggle Like Error:", err);

    return res.status(500).json({
      message: "Error updating like",
    });
  }
};


// Post par naya comment add karne ke liye
export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    // Empty ya sirf spaces wala comment allow nahi karna
    if (!content?.trim()) {
      return res.status(400).json({
        message: "Comment cannot be empty.",
      });
    }

    // Post ID se post find karo
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    // Comment ke saath content aur logged-in user ki ID save karo
    post.comment.push({
      content: content.trim(),
      user: req.userId,
    });

    // Updated comment database mein save karo
    await post.save();

    // Comments ke saath user ki details populate karo
    const updatedPost = await Post.findById(id).populate(
      "comment.user",
      "firstName lastName profileImage"
    );

    return res.status(201).json({
      message: "Comment added successfully",
      comments: updatedPost.comment,
      commentsCount: updatedPost.comment.length,
    });

  } catch (err) {
    console.log("Add Comment Error:", err);

    return res.status(500).json({
      message: "Error adding comment",
    });
  }
};


// Logged-in user ka apna comment delete karne ke liye
export const deleteComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;

    // Post ID se post find karo
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    // Post ke andar comment ID se specific comment find karo
    const comment = post.comment.id(commentId);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    // Sirf comment likhne wala user hi use delete kar sakta hai
    if (comment.user.toString() !== req.userId.toString()) {
      return res.status(403).json({
        message: "You cannot delete another user's comment.",
      });
    }

    // Comment ko post ke comments array se remove karo
    comment.deleteOne();

    // Updated post database mein save karo
    await post.save();

    return res.status(200).json({
      message: "Comment deleted successfully",
      commentsCount: post.comment.length,
    });

  } catch (err) {
    console.log("Delete Comment Error:", err);

    return res.status(500).json({
      message: "Error deleting comment",
    });
  }
};


// Kisi specific user ki saari posts fetch karne ke liye
export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;

    // Author ID ke basis par user ki posts find karo
    const posts = await Post.find({
      author: userId,
    })
      // Post author ki details populate karo
      .populate("author", "-password")

      // Like karne wale users ki details lao
      .populate("like", "-password")

      // Comment karne wale users ki details lao
      .populate("comment.user", "-password")

      // Latest posts sabse pehle show karo
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      posts,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};