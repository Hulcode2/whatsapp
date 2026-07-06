const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    lowercase: true,
    required: [true, "Please enter an email"],
    unique: true,
    validate: [
      (val) => {
        return validator.isEmail(val);
      },
      "Please enter a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [6, "Minimum password length is 6 characters"],
  },

  firstName: { type: String },
  lastName: { type: String },
  image: { type: String },
  color: { type: Number },
  profileSetup: { type: Boolean, default: false },
});

// Runs automatically before every .save() call
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (params) {
  return await bcrypt.compare(params, this.password);
};
module.exports = mongoose.model("Users", userSchema);
