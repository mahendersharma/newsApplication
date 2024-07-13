import express from "express";
import connectDB from "./app/database.js";
import dotenv from "dotenv";
import app from "./app.js";
dotenv.config({
  path: "env",
});
connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("Error", error)
      throw error
    })
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server Is runing localhost:${process.env.PORT}`);
    });
    app.on("error", (error) => {
      console.log("Error", error);
      throw error;
    });
  })
  .catch((error) => {
    console.log("mongoDb concection feiled", error);
  });
