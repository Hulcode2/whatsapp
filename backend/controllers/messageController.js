const mongoose = require("mongoose");
const Message = require("../model/Message");
const cloudinary = require("cloudinary").v2;
const fs = require("fs/promises");
async function getMessages(req, res) {
  const userId = req.user.id;
  const { recipientId } = req.body;
  if (!userId) {
    return res
      .status(203)
      .json({ success: false, message: "no user is found" });
  }
  if (!recipientId) {
    return res
      .status(203)
      .json({ success: false, message: "no user is found" });
  }
  try {
    const messages = await Message.find({
      $or: [
        {
          sender: userId,
          recipient: recipientId,
        },
        {
          sender: recipientId,
          recipient: userId,
        },
      ],
    })
      .sort({ timestamp: 1 })
      .populate("sender", "email firstName lastName image color")
      .populate("recipient", "email firstName lastName image color");

    return res.status(201).json({
      success: true,

      data: messages,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

async function uploadFile(req, res) {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Please upload a file",
    });
  }

  try {
    const fileUpload = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "auto",
    });

    await fs.unlink(req.file.path);

    return res.status(201).json({
      success: true,
      message: "File uploaded successfully",
      data: fileUpload.secure_url,
    });
  } catch (err) {
    if (req.file) {
      await fs.unlink(req.file.path).catch(() => {});
    }

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

module.exports = { getMessages, uploadFile };
