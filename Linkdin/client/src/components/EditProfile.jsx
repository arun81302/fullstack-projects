import { useContext, useRef, useState } from "react";
import { UserDataContext } from "../context/UserContext";
import { authDataContext } from "../context/AuthContext";

import { IoClose } from "react-icons/io5";
import { FaPlus, FaTrash } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import { MdDeleteOutline, MdSchool, MdWork } from "react-icons/md";

import dp from "../assets/profile.png";
import axios from "axios";

const EditProfile = () => {
  const { setEdit, userData, setUserData } = useContext(UserDataContext);
  const { serverUrl } = useContext(authDataContext);

  // User ki basic details ke liye states.
  const [firstName, setFirstName] = useState(userData?.firstName || "");
  const [lastName, setLastName] = useState(userData?.lastName || "");
  const [userName, setUserName] = useState(userData?.userName || "");
  const [headline, setHeadline] = useState(userData?.headline || "");
  const [location, setLocation] = useState(userData?.location || "India");
  const [gender, setGender] = useState(userData?.gender || "");

  // Skills add aur remove karne ke liye states.
  const [skills, setSkills] = useState(userData?.skills || []);
  const [skillInput, setSkillInput] = useState("");

  // Education aur experience ki details.
  const [education, setEducation] = useState(userData?.education || []);
  const [experience, setExperience] = useState(userData?.experience || []);

  // Profile aur cover image ka preview aur actual file.
  const [frontendProfileImage, setFrontendProfileImage] = useState(
    userData?.profileImage || dp
  );

  const [backendProfileImage, setBackendProfileImage] = useState(null);

  const [frontendCoverImage, setFrontendCoverImage] = useState(
    userData?.coverImage || null
  );

  const [backendCoverImage, setBackendCoverImage] = useState(null);

  const [loading, setLoading] = useState(false);

  // File input ko button click se open karne ke liye refs.
  const profileImage = useRef(null);
  const coverImage = useRef(null);

  // Enter press karne par skill add ho jayegi.
  const handleAddSkill = (e) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();

      if (!skills.includes(skillInput.trim())) {
        setSkills([...skills, skillInput.trim()]);
      }

      setSkillInput("");
    }
  };

  // Selected skill ko list se hata do.
  const handleRemoveSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  // Education ka naya empty section add karo.
  const handleAddEducation = () => {
    setEducation([
      ...education,
      {
        college: "",
        degree: "",
        fieldofstudy: "",
      },
    ]);
  };

  // Education ke particular field ko update karo.
  const handleEducationChange = (index, field, value) => {
    const updatedEducation = [...education];

    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value,
    };

    setEducation(updatedEducation);
  };

  // Education section remove karo.
  const handleRemoveEducation = (index) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  // Experience ka naya empty section add karo.
  const handleAddExperience = () => {
    setExperience([
      ...experience,
      {
        title: "",
        company: "",
        description: "",
      },
    ]);
  };

  // Experience ke particular field ko update karo.
  const handleExperienceChange = (index, field, value) => {
    const updatedExperience = [...experience];

    updatedExperience[index] = {
      ...updatedExperience[index],
      [field]: value,
    };

    setExperience(updatedExperience);
  };

  // Experience section remove karo.
  const handleRemoveExperience = (index) => {
    setExperience(experience.filter((_, i) => i !== index));
  };

  // Nayi profile image select karke preview dikhao.
  const handleProfileImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid profile image.");
      e.target.value = "";
      return;
    }

    setBackendProfileImage(file);
    setFrontendProfileImage(URL.createObjectURL(file));
  };

  // Nayi cover image select karke preview dikhao.
  const handleCoverImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid cover image.");
      e.target.value = "";
      return;
    }

    setBackendCoverImage(file);
    setFrontendCoverImage(URL.createObjectURL(file));
  };

  // Saari profile details FormData ke through backend ko bhejo.
  const handleSubmit = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const formdata = new FormData();

      formdata.append("firstName", firstName);
      formdata.append("lastName", lastName);
      formdata.append("userName", userName);
      formdata.append("headline", headline);
      formdata.append("location", location);
      formdata.append("gender", gender);

      // Arrays ko JSON string mein convert karke bhej rahe hain.
      formdata.append("skills", JSON.stringify(skills));
      formdata.append("education", JSON.stringify(education));
      formdata.append("experience", JSON.stringify(experience));

      if (backendProfileImage) {
        formdata.append("profileImage", backendProfileImage);
      }

      if (backendCoverImage) {
        formdata.append("coverImage", backendCoverImage);
      }

      const result = await axios.put(
        `${serverUrl}/api/user/updateprofile`,
        formdata,
        {
          withCredentials: true,
        }
      );

      // Backend se updated user data lekar context update karo.
      setUserData(result.data.user);

      console.log("Profile Updated:", result.data);

      setEdit(false);
    } catch (err) {
      console.log(
        "Update Profile Error:",
        err.response?.data || err.message
      );

      alert(err.response?.data?.message || "Profile update nahi ho payi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex h-screen w-full items-center justify-center px-3">

      {/* Hidden file inputs, button click par open honge. */}
      <input
        type="file"
        accept="image/*"
        hidden
        ref={profileImage}
        onChange={handleProfileImage}
      />

      <input
        type="file"
        accept="image/*"
        hidden
        ref={coverImage}
        onChange={handleCoverImage}
      />

      {/* Background par click karne se modal close hoga. */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => !loading && setEdit(false)}
      ></div>

      <div className="relative flex h-[600px] max-h-[90vh] w-full max-w-[450px] flex-col overflow-hidden rounded-xl bg-white shadow-2xl">

        {/* Modal Header */}
        <div className="flex shrink-0 items-center justify-between border-b p-5">
          <h2 className="text-xl font-semibold text-gray-800">
            Edit Profile
          </h2>

          <button
            type="button"
            onClick={() => setEdit(false)}
            disabled={loading}
            aria-label="Close edit profile"
            className="flex size-9 cursor-pointer items-center justify-center rounded-full transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <IoClose className="text-2xl text-gray-700" />
          </button>
        </div>

        {/* Profile form ka main scrollable section. */}
        <div className="flex-1 overflow-y-auto p-5">

          {/* Cover Image */}
          <div className="relative h-[150px] w-full overflow-hidden rounded-lg bg-gray-200">
            {frontendCoverImage && (
              <img
                src={frontendCoverImage}
                alt="Cover"
                className="h-full w-full rounded-lg object-cover"
              />
            )}

            <button
              type="button"
              onClick={() => coverImage.current?.click()}
              aria-label="Change cover image"
              className="absolute right-2 top-2 flex size-9 cursor-pointer items-center justify-center rounded-full bg-white shadow-md transition hover:bg-gray-100"
            >
              <FiEdit2 className="text-lg text-[#0A66C2]" />
            </button>
          </div>

          {/* Profile Image */}
          <div
            className="relative ml-5 mt-[-40px] size-20 cursor-pointer rounded-full border-4 border-white"
            onClick={() => profileImage.current?.click()}
          >
            <img
              src={frontendProfileImage}
              alt="Profile"
              className="h-full w-full rounded-full object-cover"
            />

            <button
              type="button"
              aria-label="Change profile image"
              onClick={() => profileImage.current?.click()}
              className="absolute bottom-0 right-0 flex size-7 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-[#0A66C2] text-white shadow-md"
            >
              <FaPlus className="text-xs" />
            </button>
          </div>

          <div className="mt-5 flex w-full flex-col gap-4">

            {/* First Name */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                First Name
              </label>

              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter first name"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#0A66C2]"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Last Name
              </label>

              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter last name"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#0A66C2]"
              />
            </div>

            {/* Username */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Username
              </label>

              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter username"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#0A66C2]"
              />
            </div>

            {/* Headline */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Headline
              </label>

              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Enter headline"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#0A66C2]"
              />
            </div>

            {/* Location */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Location
              </label>

              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter location"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#0A66C2]"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Gender
              </label>

              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="mt-1 w-full cursor-pointer rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#0A66C2]"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Skills Section */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Skills
              </label>

              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleAddSkill}
                placeholder="Type a skill and press Enter"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#0A66C2]"
              />

              {/* Added skills yahan chips ke form mein dikhenge. */}
              <div className="mt-3 flex max-h-[120px] w-full flex-wrap gap-2 overflow-y-auto p-1">
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm text-[#0A66C2]"
                  >
                    <span>{skill}</span>

                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(index)}
                      aria-label={`Remove ${skill}`}
                      className="cursor-pointer text-gray-500 transition hover:text-red-500"
                    >
                      <IoClose size={17} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Education Section */}
            <div className="border-t pt-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                  <MdSchool className="text-xl text-[#0A66C2]" />
                  Education
                </h3>

                <button
                  type="button"
                  onClick={handleAddEducation}
                  className="flex cursor-pointer items-center gap-2 text-sm font-medium text-[#0A66C2] hover:text-blue-800"
                >
                  <FaPlus /> Add Education
                </button>
              </div>

              {education.map((edu, index) => (
                <div
                  key={index}
                  className="mb-3 rounded-lg border border-gray-200 p-3"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="font-medium text-gray-700">
                      Education {index + 1}
                    </h4>

                    <button
                      type="button"
                      onClick={() => handleRemoveEducation(index)}
                      className="flex cursor-pointer items-center gap-1 text-sm text-red-500 hover:text-red-700"
                    >
                      <MdDeleteOutline size={18} />
                      Remove
                    </button>
                  </div>

                  <input
                    type="text"
                    value={edu.college || ""}
                    onChange={(e) =>
                      handleEducationChange(index, "college", e.target.value)
                    }
                    placeholder="College / University"
                    className="mb-2 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#0A66C2]"
                  />

                  <input
                    type="text"
                    value={edu.degree || ""}
                    onChange={(e) =>
                      handleEducationChange(index, "degree", e.target.value)
                    }
                    placeholder="Degree (e.g. MCA, BCA)"
                    className="mb-2 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#0A66C2]"
                  />

                  <input
                    type="text"
                    value={edu.fieldofstudy || ""}
                    onChange={(e) =>
                      handleEducationChange(index, "fieldofstudy", e.target.value)
                    }
                    placeholder="Field of Study"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#0A66C2]"
                  />
                </div>
              ))}
            </div>

            {/* Experience Section */}
            <div className="border-t pt-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                  <MdWork className="text-xl text-[#0A66C2]" />
                  Experience
                </h3>

                <button
                  type="button"
                  onClick={handleAddExperience}
                  className="flex cursor-pointer items-center gap-2 text-sm font-medium text-[#0A66C2] hover:text-blue-800"
                >
                  <FaPlus /> Add Experience
                </button>
              </div>

              {experience.map((exp, index) => (
                <div
                  key={index}
                  className="mb-3 rounded-lg border border-gray-200 p-3"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="font-medium text-gray-700">
                      Experience {index + 1}
                    </h4>

                    <button
                      type="button"
                      onClick={() => handleRemoveExperience(index)}
                      className="flex cursor-pointer items-center gap-1 text-sm text-red-500 hover:text-red-700"
                    >
                      <FaTrash size={13} />
                      Remove
                    </button>
                  </div>

                  <input
                    type="text"
                    value={exp.title || ""}
                    onChange={(e) =>
                      handleExperienceChange(index, "title", e.target.value)
                    }
                    placeholder="Job Title"
                    className="mb-2 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#0A66C2]"
                  />

                  <input
                    type="text"
                    value={exp.company || ""}
                    onChange={(e) =>
                      handleExperienceChange(index, "company", e.target.value)
                    }
                    placeholder="Company Name"
                    className="mb-2 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#0A66C2]"
                  />

                  <textarea
                    value={exp.description || ""}
                    onChange={(e) =>
                      handleExperienceChange(index, "description", e.target.value)
                    }
                    placeholder="Describe your responsibilities..."
                    rows={3}
                    className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#0A66C2]"
                  />
                </div>
              ))}
            </div>

            {/* Save button dabane par profile update hogi. */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full cursor-pointer rounded-full bg-[#0A66C2] py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;