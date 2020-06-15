const express = require("express");

const users = require("../routes/users");
const profile = require("../routes/profile");
const notes = require("../routes/notes");
const upload = require("../routes/upload");
const auth = require("../routes/auth");
const forgetPassword = require("../routes/forget-password");
const resetPassword = require("../routes/reset-password");
const company = require("../routes/company");
const superpower = require("../routes/superpower");
const weakness = require("../routes/weakness");
const twoFA = require("../routes/2-factor-auth");

module.exports = function(app) {
  app.use(express.json());
  app.use("/api/users", users);
  app.use("/api/profile", profile);
  app.use("/api/notes", notes);
  app.use("/api/auth", auth);
  app.use("/api/forget-password", forgetPassword);
  app.use("/api/reset-password", resetPassword);
  app.use("/api/company", company);
  app.use("/api/superpower", superpower);
  app.use("/api/weakness", weakness);
  app.use("/api/upload", upload);
  app.use("/api/2-factor-auth", twoFA);
  app.use("/api/uploads", express.static("uploads"));
  app.use("/", express.static("public"));
};
