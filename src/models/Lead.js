// models/Lead.js
const mongoose = require("mongoose");

const LeadSchema = new mongoose.Schema({
  userId: { type: String, default: null }, // null for anonymous, userId after login
  service: { type: String },
  message: { type: String },
  name: { type: String },
  email: { type: String },
  phone: { type: String },
  bestTime: { type: String },
  firstMessage: { type: String }, // Store first message as project name
  messages: [
    {
      from: { type: String, enum: ['bot', 'user'] },
      text: { type: String },
      timestamp: { type: Date, default: Date.now }
    }
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Lead", LeadSchema);