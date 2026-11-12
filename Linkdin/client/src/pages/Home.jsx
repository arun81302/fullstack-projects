import {
    useContext,
    useEffect,
    useState,
    useCallback,
} from "react";

import axios from "axios";
import { useLocation } from "react-router-dom";

import Nav from "../components/Nav";
import EditProfile from "../components/EditProfile";
import CreatePost from "../components/CreatePost";
import PostCard from "../components/PostCard";

import dp from "../assets/profile.png";

import { FaPlus, FaUserFriends } from "react-icons/fa";
import { IoCameraOutline } from "react-icons/io5";
import { FiEdit } from "react-icons/fi";
import { BsFilePost } from "react-icons/bs";

import { UserDataContext } from "../context/userContext";
import { authDataContext } from "../context/AuthContext";

const Home = () => {
    const { userData, edit, setEdit } = useContext(UserDataContext);
    const { serverUrl } = useContext(authDataContext);

    const location = useLocation();

    const [showCreatePost, setShowCreatePost] = useState(false);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Posts fetch karo
    const fetchPosts = useCallback(async () => {
        try {
            setLoading(true);

            const result = await axios.get(
                `${serverUrl}/api/post/all`,
                {
                    withCredentials: true,
                }
            );

            setPosts(result.data.posts || []);
        } catch (err) {
            console.log("Error fetching posts:", err);
        } finally {
            setLoading(false);
        }
    }, [serverUrl]);

    // Home open hone par posts refresh
    useEffect(() => {
        fetchPosts();

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }, [fetchPosts, location.key]);

    // Navbar se Home refresh
    useEffect(() => {
        const handleHomeRefresh = () => {
            fetchPosts();

            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        };

        window.addEventListener("home:refresh", handleHomeRefresh);

        return () => {
            window.removeEventListener("home:refresh", handleHomeRefresh);
        };
    }, [fetchPosts]);

    // Nayi post feed mein add karo
    const handlePostCreated = (newPost) => {
        setPosts((prev) => [
            newPost,
            ...prev.filter((post) => post._id !== newPost._id),
        ]);

        setShowCreatePost(false);
    };

    // Post delete karo
    const handleDeletePost = async (postId) => {
        try {
            await axios.delete(
                `${serverUrl}/api/post/delete/${postId}`,
                {
                    withCredentials: true,
                }
            );

            setPosts((prev) =>
                prev.filter((post) => post._id !== postId)
            );
        } catch (err) {
            alert(
                err.response?.data?.message ||
                "Unable to delete post"
            );
        }
    };

    return (
        <div className="min-h-screen bg-[#f3f2ef]">
            <Nav />

            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 px-3 pt-20 pb-10 sm:px-5 lg:grid-cols-[260px_minmax(0,1fr)_280px]">

                {/* Left Profile Section */}
                <aside className="h-fit overflow-hidden rounded-xl border border-gray-200 bg-white">
                    <div className="relative">
                        <div className="h-20 bg-gradient-to-r from-blue-400 to-blue-700">
                            <button
                                onClick={() => setEdit(true)}
                                aria-label="Edit cover image"
                                className="absolute top-3 right-3 cursor-pointer rounded-full bg-white p-2 text-gray-600 shadow hover:bg-gray-100"
                            >
                                <IoCameraOutline size={18} />
                            </button>
                        </div>

                        <img
                            src={userData?.profileImage || dp}
                            alt="profile"
                            className="absolute top-10 left-1/2 h-20 w-20 -translate-x-1/2 rounded-full border-4 border-white bg-white object-cover"
                        />
                    </div>

                    <div className="mt-12 px-4 pb-4 text-center">
                        <h2 className="font-semibold text-gray-800">
                            {userData?.firstName} {userData?.lastName}
                        </h2>

                        <p className="mt-1 text-xs text-gray-500">
                            {userData?.headline || "Add your professional headline"}
                        </p>

                        <p className="mt-2 text-xs text-gray-500">
                            {userData?.location || "India"}
                        </p>

                        <div className="my-4 border-t" />

                        {/* Connections Count */}
                        <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-2 text-gray-500">
                                <FaUserFriends size={16} />
                                Connections
                            </span>

                            <span className="font-semibold text-blue-600">
                                {userData?.connections?.length || 0}
                            </span>
                        </div>

                        {/* Edit Profile */}
                        <button
                            onClick={() => setEdit(true)}
                            className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-blue-600 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50"
                        >
                            <FiEdit />
                            Edit Profile
                        </button>
                    </div>
                </aside>

                {/* Center Feed Section */}
                <main className="min-w-0">

                    {/* Create Post Box */}
                    <div className="mb-4 rounded-xl border border-gray-200 bg-white p-4">
                        <div className="flex items-center gap-3">
                            <img
                                src={userData?.profileImage || dp}
                                alt="profile"
                                className="h-12 w-12 rounded-full object-cover"
                            />

                            <button
                                onClick={() => setShowCreatePost(true)}
                                className="flex-1 cursor-pointer rounded-full border border-gray-300 px-5 py-3 text-left text-sm font-medium text-gray-500 hover:bg-gray-100"
                            >
                                Start a post
                            </button>
                        </div>

                        <div className="mt-4 flex justify-around">
                            <button
                                onClick={() => setShowCreatePost(true)}
                                className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100"
                            >
                                <IoCameraOutline
                                    className="text-green-600"
                                    size={21}
                                />
                                Photo
                            </button>

                            <button
                                onClick={() => setShowCreatePost(true)}
                                className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100"
                            >
                                <FaPlus
                                    className="text-blue-600"
                                    size={17}
                                />
                                Create post
                            </button>
                        </div>
                    </div>

                    {/* Posts Feed */}
                    {loading ? (
                        <div className="rounded-xl bg-white p-8 text-center text-gray-500">
                            Loading posts...
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="rounded-xl bg-white p-8 text-center text-gray-500">
                            <BsFilePost className="mx-auto mb-3 text-3xl text-gray-400" />
                            <p>No posts available.</p>
                            <p className="mt-1 text-sm">
                                Be the first to create a post!
                            </p>
                        </div>
                    ) : (
                        posts.map((post) => (
                            <PostCard
                                key={post._id}
                                post={post}
                                onDelete={handleDeletePost}
                            />
                        ))
                    )}
                </main>

                {/* Right Section */}
                <aside className="hidden h-fit rounded-xl border border-gray-200 bg-white p-4 lg:block">
                    <h3 className="font-semibold text-gray-800">
                        LinkedIn Clone
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                        Connect with people, share your ideas, and grow your professional
                        network.
                    </p>

                    <div className="mt-4 border-t pt-3 text-xs text-gray-400">
                        Social networking application
                    </div>
                </aside>
            </div>

            {/* Create Post Modal */}
            {showCreatePost && (
                <CreatePost
                    userData={userData}
                    onClose={() => setShowCreatePost(false)}
                    onPostCreated={handlePostCreated}
                />
            )}

            {/* Edit Profile Modal */}
            {edit && <EditProfile />}
        </div>
    );
};

export default Home;