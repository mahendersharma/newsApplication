import {Router} from 'express'
import { registerUser } from '../controllers/userController.js'
import { upload } from "../middleware/multer.middleware.js";
const router = Router()

router.post("/register",upload.fields([{name:'avatar',maxCount:1}]), registerUser);

export default router