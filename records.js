const mongoose = require("mongoose");

const schema = mongoose.Schema;

const recordSchema = new schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  role: {
    type: String,
    required: true,
    trim: true,
  },
  roleTypeId: {
    type: Number,
  },
  pass: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
  },
});

module.exports = mongoose.model("records", recordSchema);
