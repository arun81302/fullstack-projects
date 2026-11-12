import { useContext, useEffect, useState } from "react";
import axios from "axios";

import dp from "../assets/profile.png";

import { authDataContext } from "../context/AuthContext";
import { UserDataContext } from "../context/UserContext";

import timeAgo from "../utils/timeAgo";
import ConnectionButton from "./ConnectionButton";

import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { FaRegCommentDots } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { IoSend, IoClose } from "react-icons/io5";
import { MdDelete } from "react-icons/md";

const PostCard = ({ post, onDelete }) => {
  const { serverUrl } = useContext(authDataContext);
  const { userData } = useContext(UserDataContext);

  const [likes, setLikes] = useState(post.like || []);
  const [comments, setComments] = useState(post.comment || []);

  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  // Check karo post current user ki hai ya nahi
  const isOwner =
    userData?._id &&
    post.author?._id &&
    userData._id.toString() === post.author._id.toString();

  // Check karo user ne like kiya hai ya nahi
  const isLiked = likes.some((user) => {
    const id = typeof user === "object" ? user._id : user;

    return id?.toString() === userData?._id?.toString();
  });

  // Post update hone par data refresh
  useEffect(() => {
    setLikes(post.like || []);
    setComments(post.comment || []);
  }, [post]);

  // Like ya unlike post
  const handleLike = async () => {
    if (likeLoading) return;

    try {
      setLikeLoading(true);

      const result = await axios.put(
        `${serverUrl}/api/post/like/${post._id}`,
        {},
        { withCredentials: true }
      );

      if (result.data.liked) {
        setLikes((prev) => [...prev, userData._id]);
      } else {
        setLikes((prev) =>
          prev.filter((user) => {
            const id = typeof user === "object" ? user._id : user;

            return id?.toString() !== userData._id.toString();
          })
        );
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLikeLoading(false);
    }
  };

  // Naya comment add karo
  const handleComment = async (e) => {
    e.preventDefault();

    if (!commentText.trim()) return;

    try {
      setLoading(true);

      const result = await axios.post(
        `${serverUrl}/api/post/comment/${post._id}`,
        { content: commentText },
        { withCredentials: true }
      );

      setComments(result.data.comments);
      setCommentText("");
      setShowComments(true);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // Apna comment delete karo
  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(
        `${serverUrl}/api/post/comment/${post._id}/${commentId}`,
        { withCredentials: true }
      );

      setComments((prev) =>
        prev.filter((comment) => comment._id !== commentId)
      );
    } catch (err) {
      console.log(err);
    }
  };

  // Post delete karo
  const handleDeletePost = async () => {
    try {
      await onDelete(post._id);
      setShowMenu(false);
    } catch (err) {
      console.log(err);
    }
  };

  const latestComment = comments[comments.length - 1];

  return (
    <div className="mb-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">

      {/* Post Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <img
            src={post.author?.profileImage || dp}
            alt="profile"
            className="h-12 w-12 rounded-full border object-cover"
          />

          <div>
            <h3 className="font-semibold text-gray-800">
              {post.author?.firstName} {post.author?.lastName}
            </h3>

            <p className="text-xs text-gray-500">
              {post.author?.headline || "LinkedIn Member"}
            </p>

            <p className="text-xs text-gray-400">
              {timeAgo(post.createdAt)}
            </p>
          </div>
        </div>

        {/* Post Menu */}
        <div className="relative">
          {isOwner && (
            <button
              onClick={() => setShowMenu(!showMenu)}
              aria-label="Post options"
              className="cursor-pointer rounded-full p-2 hover:bg-gray-100"
            >
              <BsThreeDots size={20} />
            </button>
          )}

          {showMenu && (
            <div className="absolute right-0 z-10 w-36 rounded-lg border bg-white py-2 shadow-lg">
              <button
                onClick={handleDeletePost}
                className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                <MdDelete size={18} />
                Delete post
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Connection Button */}
      {!isOwner && (
        <div className="mt-3">
          <ConnectionButton userId={post.author?._id} />
        </div>
      )}

      {/* Post Description */}
      {post.description && (
        <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-6 text-gray-800">
          {post.description}
        </p>
      )}

      {/* Post Image */}
      {post.image && (
        <img
          src={post.image}
          alt="post"
          className="mt-3 max-h-[500px] w-full rounded-lg object-contain"
        />
      )}

      {/* Likes and Comments Count */}
      <div className="mt-3 flex items-center justify-between border-b pb-3 text-sm text-gray-500">
        <span>{likes.length} likes</span>

        <button
          onClick={() => setShowComments(!showComments)}
          className="cursor-pointer hover:underline"
        >
          {comments.length} comments
        </button>
      </div>

      {/* Like and Comment Buttons */}
      <div className="flex items-center justify-around border-b py-2">
        <button
          onClick={handleLike}
          disabled={likeLoading}
          className={`flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 ${
            isLiked ? "text-blue-600" : "text-gray-600"
          }`}
        >
          {isLiked ? <AiFillLike size={21} /> : <AiOutlineLike size={21} />}
          Like
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100"
        >
          <FaRegCommentDots size={19} />
          Comment
        </button>
      </div>

      {/* Latest Comment */}
      {latestComment && !showComments && (
        <div className="mt-3 flex gap-2">
          <img
            src={latestComment.user?.profileImage || dp}
            alt="profile"
            className="h-8 w-8 rounded-full object-cover"
          />

          <div className="flex-1 rounded-xl bg-gray-100 px-3 py-2">
            <p className="text-xs font-semibold text-gray-800">
              {latestComment.user?.firstName}{" "}
              {latestComment.user?.lastName}
            </p>

            <p className="mt-1 break-words text-sm text-gray-700">
              {latestComment.content}
            </p>
          </div>
        </div>
      )}

      {/* All Comments */}
      {showComments && (
        <div className="mt-4">
          <div className="space-y-3">
            {comments.map((comment) => {
              const isCommentOwner =
                comment.user?._id?.toString() === userData?._id?.toString();

              return (
                <div key={comment._id} className="flex items-start gap-2">
                  <img
                    src={comment.user?.profileImage || dp}
                    alt="profile"
                    className="h-8 w-8 rounded-full object-cover"
                  />

                  <div className="flex flex-1 items-start justify-between rounded-xl bg-gray-100 px-3 py-2">
                    <div>
                      <p className="text-xs font-semibold text-gray-800">
                        {comment.user?.firstName}{" "}
                        {comment.user?.lastName}
                      </p>

                      <p className="mt-1 break-words text-sm text-gray-700">
                        {comment.content}
                      </p>

                      {comment.createdAt && (
                        <p className="mt-1 text-xs text-gray-400">
                          {timeAgo(comment.createdAt)}
                        </p>
                      )}
                    </div>

                    {/* Delete Comment */}
                    {isCommentOwner && (
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="ml-2 cursor-pointer text-gray-500 hover:text-red-600"
                        title="Delete comment"
                        aria-label="Delete comment"
                      >
                        <MdDelete size={18} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {comments.length === 0 && (
              <p className="py-3 text-center text-sm text-gray-400">
                No comments yet.
              </p>
            )}
          </div>

          {/* Add Comment */}
          <form
            onSubmit={handleComment}
            className="mt-4 flex items-center gap-2"
          >
            <img
              src={userData?.profileImage || dp}
              alt="profile"
              className="h-9 w-9 rounded-full object-cover"
            />

            <input
              type="text"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="min-w-0 flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500"
            />

            <button
              type="submit"
              disabled={loading || !commentText.trim()}
              className="cursor-pointer rounded-full p-2 text-blue-600 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? (
                <IoClose size={20} />
              ) : (
                <IoSend size={20} />
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PostCard;