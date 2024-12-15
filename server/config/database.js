const mongoose = require("mongoose");
const { MONGO_CONNECTION_STRING } = require("./dotenv");

mongoose.connect(MONGO_CONNECTION_STRING).then(() => {
  console.log("Connected to mongodb");
});

module.export = mongoose;
