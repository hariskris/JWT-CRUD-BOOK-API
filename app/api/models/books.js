const mongoose = require("mongoose");

//Define a schema
const Schema = mongoose.Schema;
const bookSchema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  summary: { type: String },
  bookId: { type: String },
  clientId: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("book", bookSchema);
