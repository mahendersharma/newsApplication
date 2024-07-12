'use strict';
import { boolean } from "joi";
import mongoose from "mongoose";
const authorSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        bio: {
            type: String,
            required: true
        },
        avatarUrl: {
            type: String,
            required: true
        },
        status:{
            type:boolean,
            required: true
        },
        created_at: { type: Date, default: Date.now },
        created_by: String,
        updated_at: Date,
        updated_by: String
    }
)
export default mongoose.model("Author", authorSchema, "Authors");