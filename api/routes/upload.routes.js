import express from "express";
import cloudinary from "cloudinary";
import User from "../models/user.model.js";
const router = express.Router();

router.put("/", async (req, res, next) => {
  console.log(req.body)
  try {
    if (!req.files || !req.files.avatar) {
      return res.status(400).json({ message: "Please upload an avatar" });
    }

    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const avatarFile = req.files.avatar;
    const myCloud = await cloudinary.uploader.upload(
      avatarFile.tempFilePath,
      {
        folder: "Avatars",
        width: 150,
        crop: "scale",
      }
    );

    user.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
    await user.save();

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Server error during upload" });
  }
});


export default router;
