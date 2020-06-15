const mongoose = require("mongoose");

const { Schema } = mongoose;

const companySchema = new Schema({
  name: {
    type: String
  },
  location: {
    type: String
  },
  website: {
    type: String
  },
  description: {
    type: String
  },
  logoImg: {
    type: String
  }
});

const Company = mongoose.model("Company", companySchema);

exports.Company = Company;
exports.companySchema = companySchema;
