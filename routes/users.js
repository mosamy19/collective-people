const bcrypt = require("bcryptjs");
const _ = require("lodash");
const { User } = require("../models/user");
const { Profile } = require("../models/profile");

const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User Already registered");

  user = new User(
    _.pick(req.body, ["firstName", "lastName", "email", "password"])
  );
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  res.send(_.pick(user, ["_id", "email"]));
});

router.put("/change-passowrd", async (req, res) => {
  const { email, password, newPasword } = req.body;

  let user = await User.findOne({ email });
  if (!user) return res.status(400).send("Invalid email or password.");

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password.");

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPasword, salt);
  await user.save();
  const token = user.generateAuthToken();
  res.status(201);
  res.send(token);
});

router.put("/add-profile/:userId", async (req, res) => {
  const { userId } = req.params;
  let user = await User.findOne({ _id: userId });
  if (!user) return res.status(400).send("User Doesn't Exist");
  if (user.profile) return res.status(400).send("User already has profile");
  const profile = new Profile({
    isAdmin: true,
    name: "Admin"
  });
  await profile.save();
  user.profile = profile;
  try {
    await user.save();
    res.send(profile._id);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
