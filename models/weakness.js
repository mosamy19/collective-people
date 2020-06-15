const mongoose = require("mongoose");
const { Schema } = mongoose;

const weaknessSchema = new Schema({
  name: {
    type: String
  }
});

const Weakness = mongoose.model("Weakness", weaknessSchema);

exports.Weakness = Weakness;
exports.weaknessSchema = weaknessSchema;
