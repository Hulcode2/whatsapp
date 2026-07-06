const mongoose = require("mongoose");

const channelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  members: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
  ],
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Messages" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Fires before findOneAndUpdate — used when adding a message to the channel
channelSchema.pre("findOneAndUpdate", function () {
  this.set({ updatedAt: Date.now() });
});

module.exports = mongoose.model("Channel", channelSchema);
