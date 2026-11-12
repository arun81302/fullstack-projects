import User from "../models/user.model.js";
import uploadOnCloudinary from "../config/cloudinary.js";

// Get current user
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json(user);

  } catch (err) {
    console.log("Get Current User Error:", err);

    return res.status(500).json({
      message: "Get current user error",
    });
  }
};


// Update profile
export const updateprofile = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      userName,
      headline,
      location,
      gender,
    } = req.body;

    // Convert JSON strings into arrays
    const skills = JSON.parse(req.body.skills || "[]");
    const education = JSON.parse(req.body.education || "[]");
    const experience = JSON.parse(req.body.experience || "[]");

    // Prepare update data
    const updateData = {
      firstName,
      lastName,
      userName,
      headline,
      location,
      gender,
      skills,
      education,
      experience,
    };

    // Upload profile image
    if (req.files?.profileImage?.[0]) {
      const profileImagePath = req.files.profileImage[0].path;

      const profileImageUrl =
        await uploadOnCloudinary(profileImagePath);

      if (!profileImageUrl) {
        throw new Error("Profile image upload failed");
      }

      updateData.profileImage = profileImageUrl;
    }

    // Upload cover image
    if (req.files?.coverImage?.[0]) {
      const coverImagePath = req.files.coverImage[0].path;

      const coverImageUrl =
        await uploadOnCloudinary(coverImagePath);

      if (!coverImageUrl) {
        throw new Error("Cover image upload failed");
      }

      updateData.coverImage = coverImageUrl;
    }

    // Update MongoDB
    const user = await User.findByIdAndUpdate(
      req.userId,
      updateData,
      {
        returnDocument: "after",
        runValidators: true,
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      user,
    });

  } catch (err) {
    console.log("Update Profile Error:", err);

    return res.status(500).json({
      message: "Update profile error",
      error: err.message,
    });
  }
};