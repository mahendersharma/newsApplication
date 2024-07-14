import {Router} from 'express'
import { registerUser,loginUser,logoutUser,refreshAccessToken } from '../controllers/userController.js'
import { upload } from "../middleware/multer.middleware.js";
import { jwtVerify } from '../middleware/auth.middleware.js';
const router = Router()

router.post("/register",upload.fields([{name:'avatar',maxCount:1}]), registerUser);
router.post("/login-user", loginUser);

// Secured Router
router.post('/logout',jwtVerify, logoutUser)
router.post('/refresh-token',refreshAccessToken)

export default router