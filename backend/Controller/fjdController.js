import User from "../Schema/user.js";
import Country from "../Schema/country.js";
import cloudinary from "../lib/cloudinary.js";
import mongoose from "mongoose";

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    let {
      profilePhoto,
      username,
      currentPassword,
      newPassword,
      profession,
      companyName,
      addressLine1,
      country,
      state,
      city,
    } = req.body;
    if(profilePhoto) {
      const uploadResult = await cloudinary.uploader.upload(profilePhoto, {
        folder: "user_profiles",
      });
      profilePhoto = uploadResult.secure_url; 
    }
    if(currentPassword && newPassword) {
        const user = await User.findById(userId);
        if (!user || user.password !== currentPassword) {
            return res.status(401).json({ error: "Invalid current password" });
        }
        user.password = newPassword;
        await user.save();
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePhoto,
        username,
        profession,
        companyName,
        addressLine1,
        country,
        state,
        city,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const fetchSampleCountry = async (req, res) => {
  try {
    const countries = await Country.find({});
    res.status(200).json(countries);
  } catch (error) {
    console.error("Error fetching sample country:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

