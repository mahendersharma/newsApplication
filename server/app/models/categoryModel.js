'use strict';
import mongoose from "mongoose";
const sub ={
    id:{
        type: Number,
    },
    name: {
        type: String,
    },
    description:{
        type: String,
    }, 
}
const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        description:{
            type: String,
            required: true
        },
        subcategory:[sub],
        created_at: { type: Date, default: Date.now }
    }
)
export default mongoose.model("Category", categorySchema, "Categorys");