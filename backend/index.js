const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const contactRoutes = require("./routes/contactRoutes");
const messageRoutes = require("./routes/messageRoutes");
const channelRoutes = require("./routes/channelRoutes");
const mongoose = require("mongoose");
const connect = require("./config/DB");
const connectCloudinary = require("./config/cloudinary");
const setupSocket = require("./socket");
const http = require("http");
dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;
setupSocket(server);
app.use(
  cors({
    origin: process.env.ORIGIN, // e.g. "http://localhost:5173"

    credentials: true,
  }),
);
connect();
connectCloudinary();
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/channel", channelRoutes);

server.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`),
);
