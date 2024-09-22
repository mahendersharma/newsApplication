import mongoose from "mongoose";
const participationSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the user who participated
      required: true
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room', 
      required: true
    },
    selectedNumber: {
      type: Number, // Number selected by the user (1-36)
      required: true,
      min: 1,
      max: 36
    },
    betPrice: {
      type: Number, 
      required: true,
      min: 10,
    },
    isWinner: {
      type: Boolean, // True if the user's selected number matches the lottery number
      default: false
    },
    participatedAt: {
      type: Date, // Timestamp for when the user participated in the room
      default: Date.now
    }
  }, {
    timestamps: true // Automatically adds createdAt and updatedAt timestamps
  });
  
  export default mongoose.model("Participation", participationSchema, "Participations");
  