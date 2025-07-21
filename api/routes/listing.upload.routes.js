import express from 'express';
import cloudinary from '../utils/cloudinary.js';

const router = express.Router();

// POST /api/upload-listing
router.post('/', async (req, res) => {
  try {
    if (!req.files || !req.files.images || req.files.images.length === 0) {
      return res.status(400).json({ success: false, message: 'Please upload at least one image' });
    }

    let images = [];

    if (Array.isArray(req.files.images)) {
      images = req.files.images;
    } else {
      images.push(req.files.images);
    }

    const imagesLink = [];

    // Upload images to Cloudinary
    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.uploader.upload(images[i].tempFilePath, {
        folder: "listing",
      });
      imagesLink.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    res.status(200).json({
      success: true,
      imagesLink: imagesLink
    });
  } catch (err) {
    console.error('Upload failed:', err);
    res.status(500).json({ success: false, message: 'Image upload failed' });
  }
});

export default router;
