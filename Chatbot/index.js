import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import cors from "cors"; // <-- Import CORS
import { GoogleGenerativeAI } from "@google/generative-ai";
const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());

// Enable CORS for all origins (or restrict to your frontend)
app.use(cors({
  origin: "http://localhost:5173" // <-- your frontend origin
}));

// Hardcoded Gemini API Key (keep secret in production!)
const GEMINI_API_KEY = "AIzaSyDUgt7xJl2NmEtS32P1ZPQe4h6vQyWmJLg";

// Controller + Route combined
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const generate = async (prompt)=>{
  try{
      const updatedprompt = prompt + `Give answer as you are You are Mind Space AI, a compassionate and supportive virtual assistant designed specifically to help students with mental health and wellbeing. 
Your role is to:

1. Offer evidence-based coping strategies for issues like stress, anxiety, depression, sleep problems, academic pressure, and feeling overwhelmed.
2. Provide practical and actionable advice tailored to the student's situation.
3. Suggest relaxation techniques, breathing exercises, mindfulness exercises, and time-management tips when appropriate.
4. Encourage students to seek professional help when needed and provide guidance on how to reach qualified counselors or mental health professionals.
5. Be empathetic, understanding, patient, and supportive in your responses.
6. Only respond with content related to mental health support, coping strategies, or professional guidance. Do NOT provide unrelated information.

Whenever a student shares their concern, respond thoughtfully, provide relevant coping strategies, and include a recommendation to reach a professional if necessary. Keep responses clear, empathetic, and concise. 

give short and concise answers dont inlude points just use paragraphs.`
      const result = await model.generateContent(updatedprompt);
      console.log(result.response.text());
      return result.response.text()
  }
  catch(err){
      console.log(err);
  }
}
app.post('/api/gemini/generate',async (req,res)=>{
  try{
    const data  = req.body.message;
    console.log(data);
    const result = await generate(data);
    res.send({
      "result":result
    })
  }
  catch(err){
      console.log(err);
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
