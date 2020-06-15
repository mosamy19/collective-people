const express = require("express");
const { Company } = require("../models/company");
const { Profile } = require("../models/profile");
const router = express.Router();

router.get("/search/:query", async (req, res) => {
  const { query } = req.params;
  const company = await Company.find({
    name: new RegExp(query, "i")
  }).limit(5);
  res.send(company);
});

router.post("/:userId", async (req, res) => {
  const { userId } = req.params;
  const profile = await Profile.findById(userId);
  const { name, location, website, description, logoImg } = req.body;
  const company = new Company({
    name,
    location,
    website,
    description,
    logoImg
  });

  profile.companies.push(company);
  try {
    await company.save();
    await profile.save();
    res.send(company);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    res.send(err);
  }
});

module.exports = router;
