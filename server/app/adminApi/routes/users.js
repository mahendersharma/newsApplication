import {Router} from 'express'
import { registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar} from '../controllers/userController.js'
import { upload } from "../middleware/multer.middleware.js";
import { jwtVerify } from '../middleware/auth.middleware.js';
const router = Router()

router.post("/register",upload.fields([{name:'avatar',maxCount:1}]), registerUser);
router.post("/login-user", loginUser);

// Secured Router
router.post('/logout',jwtVerify, logoutUser)
router.post('/refresh-token',refreshAccessToken)
router.post('/change-current-password',jwtVerify,changeCurrentPassword)
router.get('/get-current-user',jwtVerify,getCurrentUser)
router.post('/update-account-details',jwtVerify,updateAccountDetails)
router.post('/update-user-avatar',jwtVerify,upload.fields([{name:'avatar',maxCount:1}]),updateUserAvatar)


export default router