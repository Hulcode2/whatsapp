const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: "Users" }, // not required for channel messages
  messageType: { type: String, enum: ["text", "file"] },
  content: {
    type: String,
    required: function () {
      return this.messageType === "text";
    },
  },
  fileUrl: {
    type: String,
    required: function () {
      return this.messageType === "file";
    },
  },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Messages", messageSchema);
