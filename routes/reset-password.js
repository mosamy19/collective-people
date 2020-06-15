const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
var jwtDecode = require("jwt-decode");
const bcrypt = require("bcryptjs");
const _ = require("lodash");

router.post("/", async (req, res) => {
  const { token, password } = req.body;
  const decodedObj = await jwtDecode(token);
  if (decodedObj._id) {
    let user = await User.findById(decodedObj._id);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await user.update({
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null
    });
    await user.save();
    const token = user.generateAuthToken();
    res.status(201);
    res.send(token);
  }
});

module.exports = router;
