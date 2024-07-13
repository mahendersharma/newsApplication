import express from "express";
import cors from 'cors'
import cookieParser from "cookie-parser";
import adminApiRoutes from './app/adminApi/routes/index.js'
 const app = express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:"16kb"})) // json accept  
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static('public'))
app.use(cookieParser())// server se user ke browser ke ander ki cocokis access and set krna

app.use("/api/admin/v1", adminApiRoutes);


export default app