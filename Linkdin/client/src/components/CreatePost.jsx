import { useRef, useState, useEffect, useContext } from "react";
import axios from "axios";

import { IoClose, IoImageOutline } from "react-icons/io5";
import { FaRegImage } from "react-icons/fa6";

import dp from "../assets/profile.png";
import { authDataContext } from "../context/AuthContext";

const CreatePost = ({ userData, onClose, onPostCreated }) => {
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const imageInputRef = useRef(null);

  const { serverUrl } = useContext(authDataContext);

  // stop background scrolling when model is open.
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // cancel useeffect 
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  
  const handleImageClick = () => {
    imageInputRef.current?.click();
  };

  
  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];

    if (selectedImage) {
      if (!selectedImage.type.startsWith("image/")) {
        alert("Please select a valid image.");
        e.target.value = "";
        return;
      }

      setImage(selectedImage);
      setPreview(URL.createObjectURL(selectedImage));
    }
  };

 
  const handleRemoveImage = () => {
    setImage(null);
    setPreview("");

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };


  const handlePost = async () => {
    if (!description.trim() && !image) return;

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("description", description);

      if (image) {
        formData.append("image", image);
      }

      const result = await axios.post(
        `${serverUrl}/api/post/create`,
        formData,
        {
          withCredentials: true,
        }
      );

      
      onPostCreated(result.data.post);

      setDescription("");
      setImage(null);
      setPreview("");

      onClose();
    } catch (err) {
      console.log("Create Post Error:", err);

      alert(
        err.response?.data?.message ||
          "Something went wrong while creating post."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-2 sm:p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90dvh] w-full max-w-[550px] flex-col overflow-hidden rounded-xl bg-white shadow-2xl sm:max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-4 py-3 sm:p-4">
          <h2 className="text-lg font-semibold text-gray-800 sm:text-xl">
            Create a post
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="flex size-9 cursor-pointer items-center justify-center rounded-full transition hover:bg-gray-100"
          >
            <IoClose className="text-2xl text-gray-600" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {/* User Details */}
          <div className="flex items-center gap-3 p-4">
            <div className="size-11 shrink-0 overflow-hidden rounded-full sm:size-12">
              <img
                src={userData?.profileImage || dp}
                alt="User profile"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-gray-800 sm:text-base">
                {userData
                  ? `${userData.firstName} ${userData.lastName}`
                  : "Loading..."}
              </h3>

              <p className="text-xs text-gray-500">Post to anyone</p>
            </div>
          </div>

        
          <div className="px-4">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What do you want to talk about?"
              className="min-h-[150px] w-full resize-none text-base text-gray-700 outline-none placeholder:text-gray-400 sm:min-h-[180px] sm:text-lg"
            />
          </div>

         
          {preview && (
            <div className="relative mx-4 mb-4">
              <img
                src={preview}
                alt="Post preview"
                className="max-h-[40vh] w-full rounded-lg bg-gray-100 object-contain"
              />

              <button
                type="button"
                onClick={handleRemoveImage}
                aria-label="Remove image"
                className="absolute right-2 top-2 flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black"
              >
                <IoClose className="text-xl" />
              </button>
            </div>
          )}
        </div>

       
        <input
          type="file"
          accept="image/*"
          ref={imageInputRef}
          onChange={handleImageChange}
          className="hidden"
        />

       
        <div className="flex shrink-0 items-center justify-between border-t border-gray-200 px-4 py-3 sm:p-4">
          <button
            type="button"
            onClick={handleImageClick}
            aria-label="Add image"
            className="flex size-10 cursor-pointer items-center justify-center rounded-full transition hover:bg-gray-100"
          >
            <IoImageOutline className="text-2xl text-green-600" />
          </button>

          <button
            type="button"
            onClick={handlePost}
            disabled={loading || (!description.trim() && !image)}
            className="cursor-pointer rounded-full bg-[#0A66C2] px-6 py-2 text-sm font-semibold text-white transition hover:bg-[#004182] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 sm:text-base"
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;