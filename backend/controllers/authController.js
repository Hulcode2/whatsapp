const User = require("../model/User");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const fs = require("fs/promises");
const maxAge = 24 * 60 * 60 * 3;
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_AUTH, { expiresIn: maxAge });
};

async function signup(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "email and password are required" });
  }
  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "Email is already used",
      });
    }

    const newUser = await User.create({
      email,
      password,
    });
    const { password: _, ...userData } = newUser.toObject();
    const accessToken = generateToken(newUser._id);

    res.status(200).json({
      ...userData,
      success: true,
      accessToken: accessToken,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "all fields are required", success: false });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Not found",
      });
    }

    if (!(await user.comparePassword(password))) {
      return res
        .status(400)
        .json({ message: "Invalid password", success: false });
    }

    const { password: _, ...userData } = user.toObject();
    const accessToken = generateToken(user._id);

    res.status(200).json({
      ...userData,
      accessToken: accessToken,
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

async function getUserInfo(req, res) {
  try {
    const user = await User.findById(req.user.id);
    return res.status(200).json({
      success: true,
      message: "successfully",
      user: user,
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
}
async function updateProfile(req, res) {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (req.body.firstName) user.firstName = req.body.firstName;

    if (req.body.lastName) user.lastName = req.body.lastName;

    if (req.body.color) user.color = req.body.color;
    if (req.body.profileSetup) user.profileSetup = req.body.profileSetup;
    if (req.file) {
      const imageFile = req.file;
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      user.image = imageUpload.secure_url;
    }

    await user.save();

    const { password: _, ...userData } = user.toObject();

    res.json({
      success: true,
      user: userData,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

module.exports = { signup, login, getUserInfo, updateProfile };
