const User = require("../model/User");
const Message = require("../model/Message");
const mongoose = require("mongoose");
async function search(req, res) {
  const searchTerm = req.body.searchTerm;

  try {
    const contacts = await User.find({
      $or: [
        { firstName: { $regex: searchTerm, $options: "i" } },
        { lastName: { $regex: searchTerm, $options: "i" } },
      ],
    }).select("-password");

    res.status(200).json({
      contacts,
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

async function allContacts(req, res) {
  try {
    const contacts = await User.find().select("-password");

    res.status(200).json({
      contacts,
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

async function dmContacts(req, res) {
  const id = new mongoose.Types.ObjectId(req.user.id);
  try {
    const contacts = await Message.aggregate([
      // 1. Get messages involving the current user
      {
        $match: {
          $or: [{ sender: id }, { recipient: id }],
        },
      },

      // 2. Determine who the other person is
      {
        $project: {
          contact: {
            $cond: [{ $eq: ["$sender", id] }, "$recipient", "$sender"],
          },
        },
      },

      // 3. Remove duplicates
      {
        $group: {
          _id: "$contact",
        },
      },

      // 4. Join with Users collection
      {
        $lookup: {
          from: "users", // MongoDB collection name
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },

      // 5. Convert array -> object
      {
        $unwind: "$user",
      },

      // 6. Select only needed fields
      {
        $project: {
          _id: "$user._id",
          firstName: "$user.firstName",
          lastName: "$user.lastName",
          image: "$user.image",
          color: "$user.color",
          email: "$user.email",
        },
      },
    ]);

    res.status(200).json({
      success: true,
      contacts,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

module.exports = {
  search,
  allContacts,
  dmContacts,
};
