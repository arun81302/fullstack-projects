import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Image ko Cloudinary par upload karne ke liye
const uploadOnCloudinary = async (filePath) => {

    // File path nahi mila toh null return karo
    if (!filePath) {
        return null;
    }

    // Environment variables se Cloudinary configure karo
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUDNAME,
        api_key: process.env.CLOUDINARY_APIKEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    try {
        // Check karo ki temporary image file exist karti hai ya nahi
        if (!fs.existsSync(filePath)) {
            throw new Error("Image file does not exist: " + filePath);
        }

        // Image ko Cloudinary server par upload karo
        const uploadResult = await cloudinary.uploader.upload(filePath, {
            resource_type: "image",
        });

        // Upload hone ke baad secure image URL return karo
        return uploadResult.secure_url;

    } catch (err) {
        // Upload ke time koi error aaye toh console mein dikhao
        console.log("Cloudinary Error:", err);
        throw err;

    } finally {
        // Upload complete hone ke baad local temporary file delete karo
        try {
            await fs.promises.unlink(filePath);
        } catch (err) {

            // File pehle se delete hai toh ignore karo
            if (err.code !== "ENOENT") {
                console.log("File deletion error:", err);
            }
        }
    }
};

export default uploadOnCloudinary;