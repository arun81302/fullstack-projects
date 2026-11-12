import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import Nav from "../components/Nav";
import PostCard from "../components/PostCard";
import ConnectionButton from "../components/ConnectionButton";
import EditProfile from "../components/EditProfile";

import { authDataContext } from "../context/AuthContext";
import { UserDataContext } from "../context/UserContext";

import dp from "../assets/profile.png";

import { FiEdit } from "react-icons/fi";
import { FaUserFriends, FaMapMarkerAlt } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";
import { BsFilePost } from "react-icons/bs";

const Profile = () => {
  const { userId } = useParams();
  const { serverUrl } = useContext(authDataContext);

  const { userData, edit, setEdit } = useContext(UserDataContext);

  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Check karo ki apni profile hai ya kisi aur ki
  const isOwner = userData?._id === userId;

  // Profile aur posts fetch karo
  const getProfile = async () => {
    try {
      setLoading(true);

      const [profileResult, postResult] = await Promise.all([
        axios.get(
          `${serverUrl}/api/user/profile/${userId}`,
          { withCredentials: true }
        ),

        axios.get(
          `${serverUrl}/api/post/user/${userId}`,
          { withCredentials: true }
        ),
      ]);

      setProfile(profileResult.data.user);
      setPosts(postResult.data.posts || []);
    } catch (error) {
      console.log(error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  // User ID change hone par profile reload karo
  useEffect(() => {
    getProfile();
  }, [userId]);

  // Apni post delete karo
  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(
        `${serverUrl}/api/post/delete/${postId}`,
        { withCredentials: true }
      );

      setPosts((prev) =>
        prev.filter((post) => post._id !== postId)
      );
    } catch (error) {
      console.log(error);
    }
  };

  // Loading UI
  if (loading) {
    return (
      <>
        <Nav />

        <div className="flex justify-center pt-28 text-gray-500">
          Loading profile...
        </div>
      </>
    );
  }

  // Profile nahi mili
  if (!profile) {
    return (
      <>
        <Nav />

        <div className="flex flex-col items-center justify-center gap-3 pt-28">
          <h2 className="text-xl font-semibold text-gray-700">
            User not found.
          </h2>

          <button
            onClick={() => navigate("/")}
            className="cursor-pointer rounded-full bg-[#0A66C2] px-5 py-2 text-white hover:bg-blue-700"
          >
            Go Home
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f2ef]">
      <Nav />

      <div className="mx-auto max-w-5xl px-3 pb-10 pt-24">

        {/* Profile Details */}
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">

          {/* Cover Image */}
          <div className="h-48 bg-gray-200">
            <img
              src={profile.coverImage || ""}
              alt="cover"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="px-6 pb-6">

            {/* Profile Image */}
            <img
              src={profile.profileImage || dp}
              alt="profile"
              className="-mt-16 h-32 w-32 rounded-full border-4 border-white object-cover"
            />

            <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row">

              {/* Basic Information */}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {profile.firstName} {profile.lastName}
                </h1>

                <p className="mt-1 text-gray-600">
                  {profile.headline || "No headline added"}
                </p>

                <p className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                  <IoLocationOutline className="text-lg" />
                  {profile.location || "Location not added"}
                </p>

                <p className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                  <FaUserFriends />
                  {profile.connections?.length || 0} connections
                </p>
              </div>

              {/* Profile Action */}
              <div className="flex items-start gap-2">
                {isOwner ? (
                  <button
                    type="button"
                    onClick={() => setEdit(true)}
                    className="flex cursor-pointer items-center gap-2 rounded-full border border-[#0A66C2] px-5 py-2 font-semibold text-[#0A66C2] transition hover:bg-blue-50"
                  >
                    <FiEdit />
                    Edit Profile
                  </button>
                ) : (
                  <ConnectionButton userId={profile._id} />
                )}
              </div>
            </div>

            {/* About Section */}
            {profile.about && (
              <div className="mt-6 border-t pt-5">
                <h2 className="text-lg font-bold">
                  About
                </h2>

                <p className="mt-2 whitespace-pre-wrap text-sm text-gray-600">
                  {profile.about}
                </p>
              </div>
            )}

            {/* Skills Section */}
            {profile.skills?.length > 0 && (
              <div className="mt-6 border-t pt-5">
                <h2 className="text-lg font-bold">
                  Skills
                </h2>

                <div className="mt-3 flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-gray-100 px-4 py-2 text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* User Posts */}
        <div className="mt-5 rounded-xl bg-white p-5 shadow-sm">

          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
            <BsFilePost className="text-[#0A66C2]" />
            Posts
          </h2>

          {posts.length === 0 ? (
            <p className="text-sm text-gray-500">
              No posts available.
            </p>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  onDelete={handleDeletePost}
                />
              ))}
            </div>
          )}

        </div>
      </div>

      {/* Edit Profile Modal */}
      {edit && isOwner && <EditProfile />}
    </div>
  );
};

export default Profile;