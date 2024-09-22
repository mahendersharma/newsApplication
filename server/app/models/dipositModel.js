const mongoose = require('mongoose');

const depositSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: [0, 'Deposit amount must be positive']
  },
  currency: {
    type: String,
    required: true,
    default: 'INR' // Default currency for UPI transactions
  },
  upiTransactionId: {
    type: String,
    required: true,
    unique: true // Ensures each UPI transaction ID is unique
  },
  screenshotUrl: {
    type: String,
    required: true, // Screenshot of the UPI payment is mandatory
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'completed', 'failed'], // Deposit status
    default: 'pending'
  },
  failureReason: {
    type: String,
    required: function() { return this.status === 'failed'; } // Required only if status is 'failed'
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  processedAt: {
    type: Date
  }
});

module.exports = mongoose.model('Deposit', depositSchema);
