import express from "express"
import mongoose from "mongoose";
import dotenv from "dotenv"
import userRouter from "./routes/user.routes.js"
import authRouter from "./routes/auth.routes.js"
dotenv.config();
mongoose.connect(process.env.MONGO).then(()=>{
    console.log("Connected to Mongodb!");
} ).catch((err)=>{
    console.log(err);
})

const app = express();

app.use(express.json());

app.listen(3000,()=>{
    console.log(`Server is Running on Port 3000!!!!`)
})

// flow = index -> routes (endpoints) -> controller(api)
app.use("/api/user",userRouter)

app.use("/api/auth",authRouter)