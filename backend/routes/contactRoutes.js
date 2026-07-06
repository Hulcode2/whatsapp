const express = require("express");

const {
  search,
  allContacts,
  dmContacts,
} = require("../controllers/contactController.js");
const jwtCheck = require("../middleware/jwtProtection.js");
const router = express.Router();
router.post("/search", jwtCheck, search);
router.get("/all", jwtCheck, allContacts);
router.get("/dm-contacts", jwtCheck, dmContacts);

module.exports = router;
