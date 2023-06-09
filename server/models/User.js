const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  googleId: {
    type: String,
  },
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "City",
    required: true,
  },
  password: {
    type: String,
  },
});
module.exports = mongoose.model("User", UserSchema);
