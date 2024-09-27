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

// Function to handle the lifecycle of the room
const handleRoomLifecycle = async () => {
    console.log('Handling room lifecycle...');
    // Create a new room
    const newRoom = await createRoom();

    // Wait for 1 minute and 50 seconds
    await new Promise(resolve => setTimeout(resolve, 110000)); // 1 minute and 50 seconds

    // Close the room and provide results
    await closeRoom(newRoom);

    // Here you can add logic to provide results to the participants, if needed
    console.log(`Results for room ${newRoom.roomId}: Lottery Number was ${newRoom.lotteryNumber}`);

    // Wait for 10 seconds before creating the next room
    await new Promise(resolve => setTimeout(resolve, 10000)); // 10 seconds
};

// Schedule the room lifecycle every 2 minutes
cron.schedule('*/2 * * * *', async () => {
    console.log('Cron job triggered...');

    try {
        await handleRoomLifecycle();
    } catch (error) {
        console.error('Error in cron job:', error);
    }
});

// Initial room creation to kickstart the process
(async () => {
    await handleRoomLifecycle(); // Start the first room immediately
})();
