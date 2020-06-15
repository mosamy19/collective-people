const mongoose = require("mongoose");
const { Schema } = mongoose;

const superpowerSchema = new Schema({
  name: {
    type: String
  }
});

const Superpower = mongoose.model("Superpower", superpowerSchema);

exports.Superpower = Superpower;
exports.superpowerSchema = superpowerSchema;
