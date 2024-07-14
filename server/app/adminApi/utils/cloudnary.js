import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudnary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      return null;
    }
    // upload file on cloudnary
    const res = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    //file has been upload successfully
    fs.unlinkSync(localFilePath)
    return res
  } catch (error) {
    fs.unlinkSync(localFilePath)// remove the loccaly saved temporary file as the upload
    return null
  }
};



export {uploadOnCloudnary}