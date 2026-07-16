import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Configure Cloudinary if credentials exist
const useCloudinary = process.env.CLOUDINARY_CLOUD_NAME && 
                      process.env.CLOUDINARY_API_KEY && 
                      process.env.CLOUDINARY_API_SECRET;

if (useCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'No image file uploaded'
      });
    }

    if (useCloudinary) {
      const filePath = req.file.path;
      try {
        // Upload to Cloudinary under a specific folder
        const result = await cloudinary.uploader.upload(filePath, {
          folder: 'dusun_petung_website'
        });

        // Clean up temporary local file from local disk
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }

        return res.status(200).json({
          url: result.secure_url
        });
      } catch (uploadError) {
        // Clean up temporary local file in case of upload failure
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        return res.status(500).json({
          status: 'error',
          message: 'Failed to upload image to cloud storage: ' + uploadError.message
        });
      }
    } else {
      // Fallback: Build public static URL pointing to the file served locally
      const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      return res.status(200).json({
        url: fileUrl
      });
    }
  } catch (error) {
    next(error);
  }
};

