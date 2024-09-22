const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  accountNumber: {
    type: String,
    required: true,
    unique: true, // Ensures each account number is unique
  },
  ifscCode: {
    type: String,
    required: true,
  },
  bankName: {
    type: String,
    required: true,
  },
  accountType: {
    type: String,
    enum: ['savings', 'current', 'fixed'], // Account types
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
    required: true,
  },
  updated_at: {
    type: Date,
  },
});

module.exports = mongoose.model('Account', accountSchema);
