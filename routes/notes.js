const { Note } = require("../models/note");
const express = require("express");
const router = express.Router();

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  const notes = await Note.find({ profile: userId });
  res.send(notes);
});

router.post("/:userId", async (req, res) => {
  const { date, title, body } = req.body;
  const { userId } = req.params;
  let note = new Note({ profile: userId, date, title, body });
  await note.save();
  res.send(note);
});

router.delete("/:noteId", async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findByIdAndRemove(noteId);
  if (!note)
    return res.status(404).send("The note with the given ID was not found.");
  res.send(true);
});

module.exports = router;
