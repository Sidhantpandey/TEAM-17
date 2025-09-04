import express from "express"
import 'dotenv/config'
const app=express()
const port=process.env.PORT || 4000;

app.get("/",()=>{
    res.send("Hello from the backend API")
})
app.listen(port,()=>{
    console.log(`Server listening at port ${port}`);
})