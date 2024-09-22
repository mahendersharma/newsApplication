import express from "express";
const adminApiRoutes = express.Router();

//Import all router
import userRouter from './users.js'
import roomRouter from './room.js'

adminApiRoutes.use("/user-router", userRouter);
adminApiRoutes.use("/room", roomRouter);


export default adminApiRoutes;