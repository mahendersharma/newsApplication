'use strict';
import { boolean, string } from "joi";
import mongoose from "mongoose";
const articleSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        contant: {
            type: String,
            required: true
        },
        authorId: {  // refrence id by author id
            type: String,
            required: true
        },
        categoryId: { // refrence id by categoryId
            type: String,
            required: true
        },
         tags: { // refrence id by categoryId
            type: [],
            required: true
        },
        commentsCount:{
            type: Number,
        },
        viewCount:{
            type: Number,
        },
        like:{
            type: Number,
        },
        is_paid:{
            type:string,
            enum:['Paid','Free'],
            required: true},
        status:{
            type:string,
            enum:['Draft','Publiched'],
            required: true
        },
        created_at: { type: Date, default: Date.now },
        created_by: String,
        updated_at: Date,
        updated_by: String
    }
)
export default mongoose.model("Article", articleSchema, "Articles");