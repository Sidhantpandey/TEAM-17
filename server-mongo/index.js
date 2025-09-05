import express from "express"
import dotenv from "dotenv"
import cors from "cors";
import { connectDB } from "./utils/db.js";
import authRoutes from "./routes/auth.routes.js"
import bodyParser from 'body-parser';
import cookieParser from "cookie-parser";
import appointementRoutes from "./routes/appointment.routes.js"
import journalroutes from "./routes/journal.route.js"

dotenv.config()
// Initialize the Express app
const app = express();
const PORT = process.env.PORT || 5002;
 // Provide a default port in case the environment variable is missing

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin:"http://localhost:5173",
    credentials: true,
  })
);
app.use((req,res,next)=>{
  res.setHeader('Access-Control-Allow-Credentials','true');
  next();
})
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/appointment", appointementRoutes);
app.use("/api/journal", journalroutes);


// Start the server
app.listen(PORT, () => {
  console.log("Server is running on PORT:" + PORT);
  connectDB();
});
