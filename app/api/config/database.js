//Set up mongoose connection
const mongoose = require("mongoose");
const mongoDB =
  "mongodb+srv://hariskris2506:Haris123@cluster0.wf81zgp.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
module.exports = mongoose;
