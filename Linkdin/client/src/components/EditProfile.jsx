import { useContext, useRef, useState } from "react";
import { UserDataContext } from "../context/userContext";
import { IoClose } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import dp from "../assets/profile.png";
import axios from "axios";
import { authDataContext } from "../context/AuthContext";

const EditProfile = () => {
  const { setEdit, userData, setUserData } =
    useContext(UserDataContext);

  const { serverUrl } = useContext(authDataContext);

  
  const [firstName, setFirstName] = useState(userData?.firstName || "");
  const [lastName, setLastName] = useState(userData?.lastName || "");
  const [userName, setUserName] = useState(userData?.userName || "");
  const [headline, setHeadline] = useState(userData?.headline || "");
  const [location, setLocation] = useState(userData?.location || "India");
  const [gender, setGender] = useState(userData?.gender || "");

  
  const [skills, setSkills] = useState(userData?.skills || []);
  const [skillInput, setSkillInput] = useState("");

  
  const [education, setEducation] = useState(userData?.education || []);

  
  const [experience, setExperience] = useState(userData?.experience || []);

  
  const [frontendProfileImage, setFrontendProfileImage] = useState(
    userData?.profileImage || dp
  );

  const [backendProfileImage, setBackendProfileImage] = useState(null);

  const [frontendCoverImage, setFrontendCoverImage] = useState(
    userData?.coverImage || null
  );

  const [backendCoverImage, setBackendCoverImage] = useState(null);

  
  const [loading, setLoading] = useState(false);


  const profileImage = useRef(null);
  const coverImage = useRef(null);

  const handleAddSkill = (e) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();

      if (!skills.includes(skillInput.trim())) {
        setSkills([...skills, skillInput.trim()]);
      }

      setSkillInput("");
    }
  };

  
  const handleRemoveSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  
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

  
  const handleEducationChange = (index, field, value) => {
    const updatedEducation = [...education];

    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value,
    };

    setEducation(updatedEducation);
  };

  
  const handleRemoveEducation = (index) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  
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

  
  const handleExperienceChange = (index, field, value) => {
    const updatedExperience = [...experience];

    updatedExperience[index] = {
      ...updatedExperience[index],
      [field]: value,
    };

    setExperience(updatedExperience);
  };

  
  const handleRemoveExperience = (index) => {
    setExperience(experience.filter((_, i) => i !== index));
  };

  
  const handleProfileImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setBackendProfileImage(file);
    setFrontendProfileImage(URL.createObjectURL(file));
  };

  
  const handleCoverImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setBackendCoverImage(file);
    setFrontendCoverImage(URL.createObjectURL(file));
  };

  
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

      
      setUserData(result.data.user);

      console.log("Profile Updated:", result.data);

      
      setEdit(false);

    } catch (err) {
      console.log(
        "Update Profile Error:",
        err.response?.data || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen fixed inset-0 z-[100] flex items-center justify-center px-3">

    
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

      
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => !loading && setEdit(false)}
      ></div>

      
      <div className="relative w-full max-w-[450px] h-[600px] max-h-[90vh] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden">

    
        <div className="flex items-center justify-between border-b p-5 shrink-0">

          <h2 className="text-xl font-semibold text-gray-800">
            Edit Profile
          </h2>

          <button
            type="button"
            onClick={() => setEdit(false)}
            disabled={loading}
            className="size-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition cursor-pointer disabled:opacity-50"
          >
            <IoClose className="text-2xl text-gray-700" />
          </button>

        </div>

        
        <div className="p-5 overflow-y-auto flex-1">

        
          <div className="relative w-full h-[150px] bg-gray-200 rounded-lg overflow-hidden">

            {frontendCoverImage && (
              <img
                src={frontendCoverImage}
                alt="Cover"
                className="w-full h-full object-cover rounded-lg"
              />
            )}

            
            <button
              type="button"
              onClick={() => coverImage.current.click()}
              className="absolute top-2 right-2 size-9 bg-white rounded-full flex items-center justify-center shadow-md cursor-pointer hover:bg-gray-100"
            >
              <FiEdit2 className="text-[#0A66C2] text-lg" />
            </button>

          </div>

        
          <div
            className="relative size-20 mt-[-40px] ml-5 rounded-full border-4 border-white cursor-pointer"
            onClick={() => profileImage.current.click()}
          >

            <img
              src={frontendProfileImage}
              alt="Profile"
              className="w-full h-full object-cover rounded-full"
            />

            <button
              type="button"
              className="absolute bottom-0 right-0 size-7 bg-[#0A66C2] text-white rounded-full flex items-center justify-center shadow-md border-2 border-white cursor-pointer"
            >
              <FaPlus className="text-xs" />
            </button>

          </div>

        
          <div className="w-full flex flex-col gap-4 mt-5">

            
            <div>
              <label className="text-sm font-medium text-gray-700">
                First Name
              </label>

              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter first name"
                className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 outline-none focus:border-[#0A66C2]"
              />
            </div>

            
            <div>
              <label className="text-sm font-medium text-gray-700">
                Last Name
              </label>

              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter last name"
                className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 outline-none focus:border-[#0A66C2]"
              />
            </div>

    
            <div>
              <label className="text-sm font-medium text-gray-700">
                Username
              </label>

              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter username"
                className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 outline-none focus:border-[#0A66C2]"
              />
            </div>

            
            <div>
              <label className="text-sm font-medium text-gray-700">
                Headline
              </label>

              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Enter headline"
                className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 outline-none focus:border-[#0A66C2]"
              />
            </div>

            
            <div>
              <label className="text-sm font-medium text-gray-700">
                Location
              </label>

              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter location"
                className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 outline-none focus:border-[#0A66C2]"
              />
            </div>

            
            <div>
              <label className="text-sm font-medium text-gray-700">
                Gender
              </label>

              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 outline-none focus:border-[#0A66C2]"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            
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
                className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 outline-none focus:border-[#0A66C2]"
              />

              
              <div className="w-full max-h-[120px] overflow-y-auto flex flex-wrap gap-2 mt-3 p-1">

                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-blue-50 text-[#0A66C2] px-3 py-1 rounded-full text-sm"
                  >

                    <span>{skill}</span>

                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(index)}
                      className="text-gray-500 hover:text-red-500 font-bold"
                    >
                      ×
                    </button>

                  </div>
                ))}

              </div>

            </div>

            
            <div className="border-t pt-4">

              <div className="flex items-center justify-between mb-3">

                <h3 className="text-lg font-semibold text-gray-800">
                  Education
                </h3>

                <button
                  type="button"
                  onClick={handleAddEducation}
                  className="flex items-center gap-2 text-sm font-medium text-[#0A66C2] cursor-pointer"
                >
                  <FaPlus /> Add Education
                </button>

              </div>

              {education.map((edu, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-3 mb-3"
                >

                  <div className="flex items-center justify-between mb-3">

                    <h4 className="font-medium text-gray-700">
                      Education {index + 1}
                    </h4>

                    <button
                      type="button"
                      onClick={() => handleRemoveEducation(index)}
                      className="text-sm text-red-500 cursor-pointer"
                    >
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
                    className="w-full border border-gray-300 rounded-md px-3 py-2 mb-2 outline-none focus:border-[#0A66C2]"
                  />

                  <input
                    type="text"
                    value={edu.degree || ""}
                    onChange={(e) =>
                      handleEducationChange(index, "degree", e.target.value)
                    }
                    placeholder="Degree (e.g. MCA, BCA)"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 mb-2 outline-none focus:border-[#0A66C2]"
                  />

                  <input
                    type="text"
                    value={edu.fieldofstudy || ""}
                    onChange={(e) =>
                      handleEducationChange(index, "fieldofstudy", e.target.value)
                    }
                    placeholder="Field of Study"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-[#0A66C2]"
                  />

                </div>
              ))}

            </div>

            
            <div className="border-t pt-4">

              <div className="flex items-center justify-between mb-3">

                <h3 className="text-lg font-semibold text-gray-800">
                  Experience
                </h3>

                <button
                  type="button"
                  onClick={handleAddExperience}
                  className="flex items-center gap-2 text-sm font-medium text-[#0A66C2] cursor-pointer"
                >
                  <FaPlus /> Add Experience
                </button>

              </div>

              {experience.map((exp, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-3 mb-3"
                >

                  <div className="flex items-center justify-between mb-3">

                    <h4 className="font-medium text-gray-700">
                      Experience {index + 1}
                    </h4>

                    <button
                      type="button"
                      onClick={() => handleRemoveExperience(index)}
                      className="text-sm text-red-500 cursor-pointer"
                    >
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
                    className="w-full border border-gray-300 rounded-md px-3 py-2 mb-2 outline-none focus:border-[#0A66C2]"
                  />

                  <input
                    type="text"
                    value={exp.company || ""}
                    onChange={(e) =>
                      handleExperienceChange(index, "company", e.target.value)
                    }
                    placeholder="Company Name"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 mb-2 outline-none focus:border-[#0A66C2]"
                  />

                  <textarea
                    value={exp.description || ""}
                    onChange={(e) =>
                      handleExperienceChange(index, "description", e.target.value)
                    }
                    placeholder="Describe your responsibilities..."
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-[#0A66C2] resize-none"
                  />

                </div>
              ))}

            </div>

            
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-[#0A66C2] text-white font-semibold py-3 rounded-full hover:bg-blue-700 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
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