const express = require("express");
const router = express.Router();
const _ = require("lodash");
const nodemailer = require("nodemailer");
const nodemailerSendgrid = require("nodemailer-sendgrid");
const { User } = require("../models/user");

router.post("/", async (req, res) => {
  const { email } = req.body;

  if (email === "") {
    res.status(400).send("email required");
  }

  let user = await User.findOne({ email });

  if (_.isEmpty(user)) {
    res.status(403).send("email not in db");
  } else {
    const token = user.generateAuthToken();
    // res.send(token);
    await user.update({
      resetPasswordToken: token,
      resetPasswordExpires: Date.now() + 360000
    });

    user.save();

    const transport = nodemailer.createTransport(
      nodemailerSendgrid({
        apiKey:
          "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"
      })
    );

    let mailOptions = {
      from: "admin@collective-people.com",
      to: `${user.email}`,
      subject: "Collective People Password Reset",
      html: `<h1>Reset your password</h1>
              <p>Please use the following link to reset your password.</p>
              <p>
                <a href="http://collective-people.com/reset-password/${token}">http://collective-people.com/reset-password/${token}</a>
              </p>
              <p>If you did not request your password to be reset, you can ignore this email.</p>
              `
    };
    transport.sendMail(mailOptions, (err, response) => {
      if (err) {
        console.error("there was an error: ", err);
      } else {
        res.status(200).send(true);
      }
    });
  }
});

module.exports = router;
