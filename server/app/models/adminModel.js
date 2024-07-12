'use strict';
import { boolean } from "joi";
import mongoose from "mongoose";
const adminSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
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
        role_id: { type: String, enum:["Admin","Editor"], required: [true, 'Role is required'] },
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
export default mongoose.model("Admin", adminSchema, "Admins");