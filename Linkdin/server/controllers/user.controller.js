import User from "../models/user.model.js";
import uploadOnCloudinary from "../config/cloudinary.js";

// Logged-in user ki details fetch karne ke liye
export const getCurrentUser = async (req, res) => {
  try {
    // JWT middleware se mili user ID ke basis par user find karo
    // Password ko response mein bhejne se exclude karo
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Current user ki details frontend ko bhejo
    return res.status(200).json(user);

  } catch (err) {
    console.log("Get Current User Error:", err);

    return res.status(500).json({
      message: "Get current user error",
    });
  }
};


// Logged-in user ka profile update karne ke liye
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

    // FormData se arrays string format mein aate hain
    // JSON.parse unhe dobara JavaScript arrays mein convert karta hai
    const skills = JSON.parse(req.body.skills || "[]");
    const education = JSON.parse(req.body.education || "[]");
    const experience = JSON.parse(req.body.experience || "[]");

    // User ki updated details ka object prepare karo
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

    // Agar nayi profile image upload hui hai toh Cloudinary par bhejo
    if (req.files?.profileImage?.[0]) {
      const profileImagePath = req.files.profileImage[0].path;

      const profileImageUrl =
        await uploadOnCloudinary(profileImagePath);

      if (!profileImageUrl) {
        throw new Error("Profile image upload failed");
      }

      // Upload hone ke baad image ka URL database mein save hoga
      updateData.profileImage = profileImageUrl;
    }

    // Agar nayi cover image upload hui hai toh Cloudinary par bhejo
    if (req.files?.coverImage?.[0]) {
      const coverImagePath = req.files.coverImage[0].path;

      const coverImageUrl =
        await uploadOnCloudinary(coverImagePath);

      if (!coverImageUrl) {
        throw new Error("Cover image upload failed");
      }

      // Cover image ka Cloudinary URL update object mein add karo
      updateData.coverImage = coverImageUrl;
    }

    // Current logged-in user ka profile update karo
    const user = await User.findByIdAndUpdate(
      req.userId,
      updateData,
      {
        // Update ke baad updated user document return hoga
        returnDocument: "after",

        // Schema ke validators ko update ke time bhi run karo
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


// Kisi specific user ka public profile fetch karne ke liye
export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    // URL mein mili user ID se profile find karo
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};


// Users ko name, username ya headline se search karne ke liye
export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;

    // Empty search query hone par empty array return karo
    if (!query || !query.trim()) {
      return res.status(200).json({
        success: true,
        users: [],
      });
    }

    // Case-insensitive search ke liye regular expression banao
    const searchRegex = new RegExp(query.trim(), "i");

    const users = await User.find({
      // Search results mein logged-in user ko exclude karo
      _id: { $ne: req.userId },

      // In fields mein search query match karo
      $or: [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { userName: searchRegex },
        { headline: searchRegex },
      ],
    })
      // Password response mein include mat karo
      .select("-password")

      // Maximum 10 matching users return karo
      .limit(10);

    return res.status(200).json({
      success: true,
      users,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};


// Logged-in user ko connection suggestions dene ke liye
export const getSuggestedUsers = async (req, res) => {
  try {
    // Current user ki details database se fetch karo
    const currentUser = await User.findById(req.userId);

    if (!currentUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Suggestions mein current user aur existing connections ko exclude karo
    const excludedUsers = [
      req.userId,
      ...(currentUser.connections || []),
    ];

    const users = await User.find({
      // Excluded users ke alawa baaki users find karo
      _id: { $nin: excludedUsers },
    })
      // Password ko response se remove karo
      .select("-password")

      // Latest registered users ko pehle show karo
      .sort({ createdAt: -1 })

      // Maximum 10 suggestions return karo
      .limit(10);

    return res.status(200).json({
      success: true,
      users,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};