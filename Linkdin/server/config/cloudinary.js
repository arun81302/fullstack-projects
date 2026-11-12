import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const uploadOnCloudinary = async (filePath) => {
  if (!filePath) {
    return null;
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUDNAME,
    api_key: process.env.CLOUDINARY_APIKEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  try {
    if (!fs.existsSync(filePath)) {
      throw new Error("Image file does not exist: " + filePath);
    }

    const uploadResult = await cloudinary.uploader.upload(filePath, {
      resource_type: "image",
    });

    return uploadResult.secure_url;

  } catch (err) {
    console.log("Cloudinary Error:", err);
    throw err;

  } finally {
    // Delete temporary image after upload
    try {
      await fs.promises.unlink(filePath);
    } catch (err) {
      if (err.code !== "ENOENT") {
        console.log("File deletion error:", err);
      }
    }
  }
};

export default uploadOnCloudinary;