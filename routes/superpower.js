const express = require("express");
const { Superpower } = require("../models/superpower");
const router = express.Router();

router.get("/search/:query", async (req, res) => {
  const { query } = req.params;
  const superpowers = await Superpower.find({
    name: new RegExp(query, "i")
  }).limit(5);
  res.send(superpowers);
});

router.post("/", async (req, res) => {
  const { name } = req.body;
  const superpower = new Superpower({
    name
  });
  try {
    superpower.save();
    res.send(superpower);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
