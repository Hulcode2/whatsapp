const express = require("express");
const upload = require("../middleware/multer.js");
const {
  signup,
  login,
  getUserInfo,
  updateProfile,
} = require("../controllers/authController.js");
const jwtCheck = require("../middleware/jwtProtection.js");

const router = express.Router();
router.post("/signup", signup);

router.post("/login", login);
router.get("/user-info", jwtCheck, getUserInfo); // protected
router.post("/update-profile", upload.single("image"), jwtCheck, updateProfile); // protected

module.exports = router;
