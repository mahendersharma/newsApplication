import express from "express";
const adminApiRoutes = express.Router();

//Import all router
import userRouter from './users.js'

console.log("hello Bye")
adminApiRoutes.use("/user-router", userRouter);


export default adminApiRoutes;