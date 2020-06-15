const express = require("express");
const { Weakness } = require("../models/weakness");
const router = express.Router();

router.get("/search/:query", async (req, res) => {
  const { query } = req.params;
  const weaknesses = await Weakness.find({
    name: new RegExp(query, "i")
  }).limit(5);
  res.send(weaknesses);
});

router.post("/", async (req, res) => {
  const { name } = req.body;
  const weakness = new Weakness({
    name
  });
  try {
    weakness.save();
    res.send(weakness);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
