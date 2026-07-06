const express = require("express");

const {
  getMessages,
  uploadFile,
} = require("../controllers/messageController.js");
const jwtCheck = require("../middleware/jwtProtection.js");
const upload = require("../middleware/multer.js");
const router = express.Router();
router.post("/messages", jwtCheck, getMessages);
router.post("/upload-file", jwtCheck, upload.single("file"), uploadFile);

module.exports = router;
