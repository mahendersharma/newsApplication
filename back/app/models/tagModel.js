'use strict';
import { boolean } from "joi";
import mongoose from "mongoose";
const tagSchema = new mongoose.Schema(
    {
        name: {
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
export default mongoose.model("Tag", tagSchema, "Tags");