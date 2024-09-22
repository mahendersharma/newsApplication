import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    unique: true
  },
  lotteryNumber: {
    type: Number,
    min: 1,
    max: 36
  },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId, // Reference to users' participation
      ref: 'Participation'
    }
  ],
  createdAt: {
    type: Date, 
    default: Date.now,
    required: true
  },
  closedAt: {
    type: Date, 
  },
  status: {
    type: String, // 'open', 'closed', 'active' to represent room's state
    enum: ['open', 'closed', 'active'], // Add 'active' as a valid enum value
    default: 'open'
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt timestamps
});

roomSchema.index({ roomId: 1 });

roomSchema.methods.closeRoom = async function() {
  this.status = 'closed';
  this.closedAt = new Date(); // Set the closing time
  return await this.save(); // Save the updated room
};

roomSchema.methods.generateLotteryNumber = async function() {
  this.lotteryNumber = Math.floor(Math.random() * 36) + 1; // Random number between 1 and 36
  return await this.save();
};

roomSchema.methods.getRemainingTime = function() {
  const now = Date.now();
  const endTime = this.createdAt.getTime() + (3 * 60 * 60 * 1000); // 3 hours in milliseconds
  const remainingTime = Math.max(0, endTime - now);
  return remainingTime;
};


export default mongoose.model("Room", roomSchema, "Rooms");
