// models/Lead.js
const mongoose = require("mongoose");

const LeadSchema = new mongoose.Schema({
  userId: { type: String, default: null }, // null for anonymous, userId after login
  service: {
    type: String,
    trim: true,
    maxlength: 200
  },
  message: {
    type: String,
    trim: true,
    maxlength: 2000
  },
  name: {
    type: String,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    maxlength: 255,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  phone: {
    type: String,
    trim: true,
    maxlength: 20,
    match: [/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, 'Please enter a valid phone number']
  },
  bestTime: {
    type: String,
    trim: true,
    maxlength: 100
  },
  firstMessage: { type: String }, // Store first message as project name
  messages: [
    {
      from: { type: String, enum: ['bot', 'user'] },
      text: { type: String },
      timestamp: { type: Date, default: Date.now }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
LeadSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: Date.now() });
  next();
});

// Add indexes for better query performance
LeadSchema.index({ email: 1 });
LeadSchema.index({ createdAt: -1 });
LeadSchema.index({ userId: 1 });

module.exports = mongoose.model("Lead", LeadSchema);
