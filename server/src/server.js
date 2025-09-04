import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
dotenv.config();
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL);

redis.on("connect", () => {
  console.log("Redis is connected");
});

redis.on("ready", () => {
  console.log("Redis is ready to accept commands");
});

redis.on("error", (err) => {
  console.error("Redis connection error:", err);
});

const app=express()
const port=process.env.PORT || 4000;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));


import bookings from "./routes/bookings.routes.js"
import loginapis from "./routes/auth.routes.js";
import dashboard from "./routes/dashboard.routes.js";
app.use("/api/book",bookings);
app.use("/api/auth",loginapis);
app.use("/api/dash",dashboard);



app.get("/",(req,res)=>{
    res.send("Hello from the backend API")
})
app.listen(port,()=>{
    console.log(`Server listening at port ${port}`);
})