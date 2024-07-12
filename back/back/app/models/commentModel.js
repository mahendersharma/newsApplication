'use strict';
import mongoose from "mongoose";
const commentSchema = new mongoose.Schema(
    {
        articleId: {
            type: String,
            required: true
        },
        userId:{
            type: String,
            required: true
        },
        content:{
            type: String,
            required: true
        },
        created_at: { type: Date, default: Date.now }
    }
)
export default mongoose.model("Comment", commentSchema, "Comments");