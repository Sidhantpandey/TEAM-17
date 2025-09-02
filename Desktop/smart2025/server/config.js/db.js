import mongoose from "mongoose";

export const connectDB=async()=>{
    try {
        await mongoose.connect("connection key")
        .then(()=>console.log("DB Connected"))
        .catch((e)=>console.log(e.message))
    } catch (error) {
        console.log("connection error");
    }
        
    }
connectDB();  