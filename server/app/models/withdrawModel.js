const mongoose = require('mongoose');

const withdrawalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // Reference to the User model
    required: true
  },
  amount: {
    type: Number, 
    required: true,
    min: [0, 'Withdrawal amount must be positive']
  },
  currency: {
    type: String,
    required: true,
    default: 'IND' // Default currency
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'completed', 'failed'], // Withdrawal status
    default: 'pending'
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

module.exports = mongoose.model('Withdrawal', withdrawalSchema);
