'use strict';
import { boolean } from "joi";
import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        userName: {
            type: String,
            required: true,
            unique: true 
        },
        email:{
            type: String,
            required: true
        },
        phone:{
            type: Number,
        },
        password: {
            type: String,
            trim: true,
            default: ""
        },
        status:{
            type:boolean,
            required: true
        },
        avatar:{type: String},
        created_at: { type: Date, default: Date.now },
        created_by: String,
        updated_at: Date,
        updated_by: String
    }
)
export default mongoose.model("User", userSchema, "Users");