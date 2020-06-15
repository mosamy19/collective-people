const mongoose = require("mongoose");
const { superpowerSchema } = require("./superpower");
const { weaknessSchema } = require("./weakness");
const { Schema } = mongoose;

const emailSchema = new Schema({
  value: String,
  isPrimary: {
    type: Boolean,
    default: false
  }
});

const phoneSchema = new Schema({
  prefix: String,
  value: String,
  isPrimary: {
    type: Boolean,
    default: false
  }
});

const profileSchema = new Schema({
  isAdmin: {
    type: Boolean,
    default: false
  },
  name: {
    type: String,
    maxlength: 50
  },
  location: {
    type: String
  },
  profileImg: {
    type: String
  },
  notes: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  },
  star: {
    type: Boolean,
    default: false
  },
  emails: [emailSchema],
  phones: [phoneSchema],
  bio: {
    type: String
  },
  superpowers: [superpowerSchema],
  weaknesses: [weaknessSchema],
  companies: [
    {
      type: Schema.Types.ObjectId,
      ref: "Company"
    }
  ],
  facebook: {
    type: String,
    maxlength: 255
  },
  instagram: {
    type: String,
    maxlength: 255
  },
  twitter: {
    type: String,
    maxlength: 255
  },
  linkedIn: {
    type: String,
    maxlength: 255
  },
  karma: {
    type: Number,
    default: 100
  }
});

const Profile = mongoose.model("Profile", profileSchema);

exports.Profile = Profile;
exports.profileSchema = profileSchema;
