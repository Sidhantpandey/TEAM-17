import express from 'express'
import cors from "cors"
import { connectDB } from './config.js/db.js'

const app=express()
const port= 5000

app.use(express.json())//req from front end will be parsed for backend
app.use(cors())//access external APIs and resources from other domains
connectDB();

app.get("/",(req,res)=>{
    res.send("API Working")
})

app.listen(port,()=>{
    console.log(`Server started on http://localhost:${port}`)
})
