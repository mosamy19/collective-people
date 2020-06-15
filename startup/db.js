const mongoose = require("mongoose");
const db = "mongodb://localhost/theCollective";

module.exports = function() {
  mongoose.set("useCreateIndex", true);
  mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => console.log("MongoDB successfully connected"))
    .catch(err => console.log(err));
};
