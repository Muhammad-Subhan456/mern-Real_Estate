import express from 'express';
import cloudinary from '../utils/cloudinary.js';
import Listing from '../models/listing.models.js';

const router = express.Router();

// POST /api/upload
router.post('/', async (req, res) => {
  try {
     if (!req.files || !req.files.images || req.files.images.length === 0) {
        return next(new ErrorHandler('Please upload at least one image', 400));
    }
    
    let images = [];

    if (Array.isArray(req.files.images)) {
        images = req.files.images;
    } else {
        images.push(req.files.images);
    }
    
    console.log(images)
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

    // const house = await Listing.findbyId(...);
    // house.set({imageUrls: imagesLink});
    // await house.save();
    res.status(200).send({
        success: true
    })
  } catch (err) {
    console.error('Upload failed:', err);
    res.status(500).json({ success: false, message: 'Image upload failed' });
  }
});

export default router;
