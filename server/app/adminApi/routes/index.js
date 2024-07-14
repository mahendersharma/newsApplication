import express from "express";
const adminApiRoutes = express.Router();

//Import all router
import userRouter from './users.js'

adminApiRoutes.use("/user-router", userRouter);


export default adminApiRoutes;