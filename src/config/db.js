const mongoose = require("mongoose");

const dbConn = () => {
  mongoose.connect(process.env.MONGO_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  console.log("Mongo Connect");
};

module.exports = { dbConn };
