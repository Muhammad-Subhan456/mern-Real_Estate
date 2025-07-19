import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";   
import bcryptjs from "bcryptjs";
import cloudinary from "../utils/cloudinary.js";
import { trusted } from "mongoose";
export const test = (req, res) => {
    console.log("Hello World");
    res.send("Well DOne"); // ✅ important: send a response
}

export const updateUser = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id) return next(errorHandler(401, "Update your account only"));

    // For FormData, use req.files and req.body
    let updatedFields = {};

    if (req.body.username) updatedFields.username = req.body.username;
    if (req.body.email) updatedFields.email = req.body.email;
    if (req.body.password) {
      updatedFields.password = bcryptjs.hashSync(req.body.password, 10);
    }

    if (req.files && req.files.avatar) {
      const result = await cloudinary.uploader.upload(req.files.avatar.tempFilePath);
      updatedFields.avatar = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, {
      $set: updatedFields,
    }, { new: true });

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json({ updatedUser: rest });

  } catch (error) {
    next(error);
  }
};


export const deleteUser = async(req,res,next) => {
    if (req.user.id !== req.params.id) return next(errorHandler(401, "You can only delete your account"));
  try {
    await User.findByIdAndDelete(req.params.id)
    res.clearCookie('access_token')
    res.status(200).json('User has been deleted')

  } catch (error) {
     next(error)
  }
}