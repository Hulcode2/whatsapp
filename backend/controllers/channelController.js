const Channel = require("../model/Channal");
const User = require("../model/User");
const Message = require("../model/Message");

async function create(req, res) {
  try {
    const admin = req.user.id;
    const { name, members } = req.body;

    if (!name || !members || members.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Channel name and members are required",
      });
    }

    const channel = await Channel.create({
      name,
      admin,
      members: [...new Set([...members, admin])],
    });

    return res.status(201).json({
      success: true,
      message: "Channel created successfully",
      channel,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

async function userChannels(req, res) {
  try {
    const userId = req.user.id;

    const channels = await Channel.find({
      members: userId,
    })
      .populate("admin", "userName image")
      .populate("members", "userName image");

    return res.status(200).json({
      success: true,
      channels,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

async function messages(req, res) {
  try {
    const { channelId } = req.params;

    const channel = await Channel.findById(channelId).populate({
      path: "messages",
      populate: {
        path: "sender",
        select: "userName image",
      },
    });

    if (!channel) {
      return res.status(404).json({
        success: false,
        message: "Channel not found",
      });
    }

    return res.status(200).json({
      success: true,
      channel,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

module.exports = {
  create,
  userChannels,
  messages,
};
