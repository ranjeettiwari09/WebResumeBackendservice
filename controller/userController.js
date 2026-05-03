const User = require("../models/User");

// 🔹 CREATE USER
const createUser = async (req, res) => {
  try {
    const { name, email, title, bio, location } = req.body;

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Get files from Cloudinary (via multer)
    const profilePicture = req.files?.profilePicture
      ? req.files.profilePicture[0].path
      : "";

    const resume = req.files?.resume
      ? req.files.resume[0].path
      : "";

    const newUser = new User({
      name,
      email,
      title:    title    || undefined,
      bio:      bio      || undefined,
      location: location || undefined,
      profilePicture,
      resume,
    });

    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


// 🔹 GET PROFILE (no ID needed — single owner profile)
const getUser = async (req, res) => {
  try {
    const user = await User.findOne();

    if (!user) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json({ user });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


// 🔹 UPDATE PROFILE (single owner — find by first doc)
const updateUser = async (req, res) => {
  try {
    const { name, email, title, bio, location } = req.body;

    // Find the owner profile (there is only one)
    const existing = await User.findOne();
    if (!existing) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const updateData = {};
    if (name     !== undefined) updateData.name     = name;
    if (email    !== undefined) updateData.email    = email;
    if (title    !== undefined) updateData.title    = title;
    if (bio      !== undefined) updateData.bio      = bio;
    if (location !== undefined) updateData.location = location;

    // Update only if new files uploaded
    if (req.files?.profilePicture) {
      updateData.profilePicture = req.files.profilePicture[0].path;
    }

    if (req.files?.resume) {
      updateData.resume = req.files.resume[0].path;
    }

    const updatedUser = await User.findByIdAndUpdate(
      existing._id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  createUser,
  getUser,
  updateUser,
};