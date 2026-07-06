const express = require("express");

const {
  create,
  userChannels,
  messages,
} = require("../controllers/channelController.js");
const jwtCheck = require("../middleware/jwtProtection.js");
const router = express.Router();

router.post("/create", jwtCheck, create);
router.get("/user-channels", jwtCheck, userChannels);
router.get("/messages/:channelId", jwtCheck, messages);

module.exports = router;
