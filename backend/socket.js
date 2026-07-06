const { Server } = require("socket.io");
const Message = require("./model/Message.js");
const Channel = require("./model/Channal.js");
const { raw } = require("express");

const userSocketMap = new Map(); // { "userId": "socketId" }

const setupSocket = (server) => {
  console.log(Server);
  const io = new Server(server, {
    cors: { origin: process.env.ORIGIN, credentials: true },
  });

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`User connected: ${userId} → ${socket.id}`);
    }

    // Direct message
    socket.on("send-message", async (message) => {
      const senderSocketId = userSocketMap.get(message.sender);
      const recipientSocketId = userSocketMap.get(message.recipient);
      const createdMessage = await Message.create({
        sender: message.sender,
        recipient: message.recipient,
        content: message.content,
        messageType: message.messageType,
        fileUrl: message.fileUrl || null,
        timestamp: message.timestamp,
      });

      const populated = await Message.findById(createdMessage._id)
        .populate("sender", "email firstName lastName image color")
        .populate("recipient", "email firstName lastName image color");
      if (senderSocketId === recipientSocketId) {
        io.to(senderSocketId).emit("receive-message", populated);
      } else {
        io.to(senderSocketId).emit("receive-message", populated);
        io.to(recipientSocketId).emit("receive-message", populated);
      }
    });

    // Channel message
    socket.on("send-channel-message", async (message) => {
      const { channelId, sender, content, messageType, fileUrl } = message;

      const createdMessage = await Message.create({
        sender,
        recipient: null,
        content,
        messageType,
        fileUrl: fileUrl || null,
        timestamp: new Date(),
      });

      // Add message reference to the channel document
      await Channel.findByIdAndUpdate(channelId, {
        $push: { messages: createdMessage._id },
      });

      const messageData = await Message.findById(createdMessage._id).populate(
        "sender",
        "id email firstName lastName image color",
      );

      const finalData = { ...messageData._doc, channelId };

      // Get channel with all its members
      const channel = await Channel.findById(channelId).populate("members");

      // Emit to every online member
      channel.members.forEach((member) => {
        const memberSocketId = userSocketMap.get(member._id.toString());
        if (memberSocketId) {
          io.to(memberSocketId).emit("receive-channel-message", finalData);
        }
      });
    });

    // Clean up on disconnect
    socket.on("disconnect", () => {
      for (const [userId, socketId] of userSocketMap.entries()) {
        if (socketId === socket.id) {
          userSocketMap.delete(userId);
          break;
        }
      }
    });
  });
};
module.exports = setupSocket;
