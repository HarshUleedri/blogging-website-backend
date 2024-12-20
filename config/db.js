const mongoose = require("mongoose");

const url = process.env.MONGO_URL;

console.log(url);
const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URL);
};

module.exports = connectDB;
