"use strict";

import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: DB_NAME,
    });
    console.log(`\n MongoDb Connected !! DB Host :${connectionInstance.connection.host}`);
  } catch (error) {
    console.log("MongoDB Connection Error", error);
    process.exit(1);
  }
};

export default connectDB;
