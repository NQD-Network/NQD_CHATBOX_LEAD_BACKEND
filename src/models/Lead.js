const mongoose = require("mongoose");

const LeadSchema = new mongoose.Schema({
  service: { type: String },
  message: { type: String },
  name: { type: String },
  email: { type: String },
  phone: { type: String },
  bestTime: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Lead", LeadSchema);
