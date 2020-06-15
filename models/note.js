const mongoose = require("mongoose");

const { Schema } = mongoose;

const noteSchema = new Schema({
  profile: {
    type: Schema.Types.ObjectId,
    ref: "Profile"
  },
  date: {
    type: Date
  },
  title: {
    type: String,
    maxlength: 255
  },
  body: {
    type: String,
    maxlength: 255
  }
});

const Note = mongoose.model("Note", noteSchema);

exports.Note = Note;
exports.noteSchema = noteSchema;
