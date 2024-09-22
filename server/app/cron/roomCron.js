import cron from 'node-cron';
import Room from '../models/roomModel.js';

// Function to create a new room
const createRoom = async () => {
    const roomId = `Room-${Date.now()}`; // Unique room ID based on current timestamp
    const newRoom = await Room.create({
        roomId,
        status: 'open'
    });
    console.log("roomId",roomId)
    await newRoom.generateLotteryNumber(); // Generate a random lottery number
    console.log(`New room created: ${newRoom.roomId} with lottery number: ${newRoom.lotteryNumber}`);
    
    return newRoom;
};

// Function to close a room
const closeRoom = async (room) => {
    await room.closeRoom(); // Use the method defined in the room model
    console.log(`Room closed: ${room.roomId}`);
};

// Schedule the room creation and closure
let currentRoom;

cron.schedule('0 */3 * * *', async () => {
    console.log('Cron job triggered...');

    try {
        // Close the current room if it exists
        if (currentRoom) {
            console.log(`Closing the current room: ${currentRoom.roomId}`);
            await closeRoom(currentRoom);
            // Wait for 10 seconds before creating a new room
            await new Promise(resolve => setTimeout(resolve, 10000));
        }

        // Create a new room
        currentRoom = await createRoom();
    } catch (error) {
        console.error('Error in cron job:', error);
    }
});

// Optionally: You can set a listener to handle when a room is closed
// You can also implement additional logic to handle user participation in rooms
