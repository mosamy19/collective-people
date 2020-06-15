const { Profile } = require("../models/profile");
const express = require("express");
const router = express.Router();

const authy = require("authy")("dM50DLN6CbWSkeDE1MapLG7stQb9zU3d");

router.post("/add-user/:profileId", async (req, res) => {
  const { profileId } = req.params;
  console.log("user: ", profileId);

  let profile = await Profile.findOne({ _id: profileId });
  console.log("user: ", profile);

  if (
    profile.emails &&
    profile.emails.length > 0 &&
    profile.phones &&
    profile.phones.length > 0
  ) {
    let email = profile.emails[0].value;
    let { value: phone, prefix } = profile.phones[0];

    authy.register_user(email, phone, prefix, (err, response) => {
      if (response.success) {
        res.status(200);
        res.send(`${response.user.id}`); //);
      }
    });
  } else {
    res.status(403);
    res.send("Please check that you added An email and phone number");
  }
});

module.exports = router;
