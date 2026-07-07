const mongoose = require("mongoose");

/**
 * Validate if a string is a valid MongoDB ObjectId
 */
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

/**
 * Sanitize string input to prevent XSS
 */
const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return str
    .replace(/[<>]/g, '') // Remove < and > to prevent HTML injection
    .trim();
};

/**
 * Validate email format
 */
const isValidEmail = (email) => {
  const emailRegex = /^\S+@\S+\.\S+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone format
 */
const isValidPhone = (phone) => {
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
  return phoneRegex.test(phone);
};

/**
 * Validate lead submission data
 */
const validateLeadData = (data) => {
  const errors = [];

  // Email validation (if provided)
  if (data.email && !isValidEmail(data.email)) {
    errors.push('Invalid email format');
  }

  // Phone validation (if provided)
  if (data.phone && !isValidPhone(data.phone)) {
    errors.push('Invalid phone format');
  }

  // Check max lengths
  if (data.name && data.name.length > 100) {
    errors.push('Name must be less than 100 characters');
  }

  if (data.message && data.message.length > 2000) {
    errors.push('Message must be less than 2000 characters');
  }

  if (data.service && data.service.length > 200) {
    errors.push('Service must be less than 200 characters');
  }

  if (data.bestTime && data.bestTime.length > 100) {
    errors.push('Best time must be less than 100 characters');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Sanitize lead data object
 */
const sanitizeLeadData = (data) => {
  return {
    service: data.service ? sanitizeString(data.service) : undefined,
    message: data.message ? sanitizeString(data.message) : undefined,
    name: data.name ? sanitizeString(data.name) : undefined,
    email: data.email ? sanitizeString(data.email) : undefined,
    phone: data.phone ? sanitizeString(data.phone) : undefined,
    bestTime: data.bestTime ? sanitizeString(data.bestTime) : undefined
  };
};

module.exports = {
  isValidObjectId,
  sanitizeString,
  isValidEmail,
  isValidPhone,
  validateLeadData,
  sanitizeLeadData
};
