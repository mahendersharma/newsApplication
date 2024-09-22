import { Router } from 'express';
import { jwtVerify } from '../middleware/auth.middleware.js';
import { activateRoom, joinRoom } from '../controllers/roomController.js';

const router = Router();

// Public or secured routes
router.get('/current-room', activateRoom);
router.post('/join-room/:roomId', jwtVerify, joinRoom);

export default router;
