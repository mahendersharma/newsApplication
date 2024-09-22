import Room from '../../models/roomModel.js'
import Participation from '../../models/participationModel.js'
import User from '../../models/userModel.js'

import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponce.js";

// Create a new room
const createRoom = asyncHandler(async (req, res) => {
    const { name } = req.body;
  
    const room = await Room.create({ name });
    return res.status(201).json(new ApiResponse(201, room, "Room created successfully"));
  });
  
  // Join a room
  const joinRoom = asyncHandler(async (req, res) => {
    const { roomId } = req.params;
    const { betPrice, selectedDigit } = req.body;

    const userId = req.user._id; 
    const room = await Room.findOne({ roomId });

    if (!room) throw new ApiError(404, "Room not found");

    // Ensure the room is open for participation
    if (room.status !== 'open') {
      throw new ApiError(400, "Room is not open for joining");
    }

    // Check if the user has enough balance
    if (req.user.balance < betPrice) {
      throw new ApiError(400, "Insufficient balance");
    }

    // Deduct the bet price from user's balance
    await User.findByIdAndUpdate(userId, { $inc: { balance: -betPrice } });

    // Create a participation entry, including the lottery number
    const participation = new Participation({
        userId,
        roomId: room._id, // Using ObjectId for room reference
        selectedNumber: selectedDigit,
        betPrice,
        lotteryNumber: room.lotteryNumber // Store the current lottery number
    });

    await participation.save();

    // Add the participation ID to the room's participants
    room.participants.push(participation._id);
    await room.save();

    return res.status(200).json(new ApiResponse(200, participation, "Joined room successfully"));
});
  
  
  // Activate a room
  const activateRoom = async (req, res) => {
    res.setHeader('Cache-Control', 'no-store'); // Prevents caching at all levels
    res.setHeader('Pragma', 'no-cache'); // HTTP/1.0 backward compatibility
    res.setHeader('Expires', '0'); // Ensures immediate expiration
    try {
        const rooms = await Room.find({ status: 'open' });
        const roomDetails = rooms.map(room => ({
            roomId: room.roomId,
            status: room.status,
            remainingTime: room.getRemainingTime() // Add remaining time for each room
        }));
        res.json({ rooms: roomDetails });
    } catch (error) {
        res.status(500).json({ error: "Error fetching rooms" });
    }
};
  
  // Close a room and calculate result
  const closeRoom = asyncHandler(async (roomId) => {
    const room = await Room.findById(roomId);
    if (!room) throw new ApiError(404, "Room not found");
  
    room.status = 'closed';
    room.closedAt = new Date();
    room.result = Math.floor(Math.random() * 10).toString(); // Example result logic
    await room.save();
  
    console.log(`Room ${room.name} is now closed with result ${room.result}.`);
  });
  
  // Export the controller functions
  export {
    createRoom,
    joinRoom,
    activateRoom,
    closeRoom,
};
