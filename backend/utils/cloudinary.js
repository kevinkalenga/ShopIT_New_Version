


import cloudinary from "cloudinary";
import dotenv from "dotenv";
import streamifier from "streamifier"; // ⚡ important

dotenv.config({ path: "backend/config/config.env" });

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const upload_file = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream(
      { resource_type: "auto", folder },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
    );

    // ⚡ transforme le buffer en ReadableStream
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

export const delete_file = async (file) => {
  const res = await cloudinary.v2.uploader.destroy(file);
  if (res?.result === "ok") return true;
};
