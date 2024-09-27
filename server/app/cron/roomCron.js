
import cron from 'node-cron';
import Room from '../models/roomModel.js';

// Function to create a new room
const createRoom = async () => {
    const roomId = `Room-${Date.now()}`; // Unique room ID based on current timestamp
    const newRoom = await Room.create({
        roomId,
        status: 'open'
    });
    console.log("roomId", roomId);
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

// Function to handle the room lifecycle
const handleRoomLifecycle = async () => {
    console.log('Handling room lifecycle...');

    // Close the current room if it exists
    if (currentRoom) {
        console.log(`Closing the current room: ${currentRoom.roomId}`);
        await closeRoom(currentRoom);
        
        // Wait for 10 seconds after closing before creating a new room
        await new Promise(resolve => setTimeout(resolve, 10000));
    }

    // Create a new room
    currentRoom = await createRoom();
};

// Start the process
cron.schedule('*/2 * * * *', async () => { // Every 2 minutes
    console.log('Cron job triggered...');
    
    try {
        await handleRoomLifecycle();
    } catch (error) {
        console.error('Error in cron job:', error);
    }
});

// Close room after 1 minute and 50 seconds
setInterval(async () => {
    if (currentRoom) {
        console.log(`Closing the room: ${currentRoom.roomId} in 1 minute and 50 seconds...`);
        await new Promise(resolve => setTimeout(resolve, 110000)); // Wait for 1 minute and 50 seconds
        await closeRoom(currentRoom);
    }
}, 120000); // This will run every 2 minutes, but only one will execute at a time
