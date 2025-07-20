import express from "express"
import mongoose from "mongoose";
import dotenv from "dotenv"
import userRouter from "./routes/user.routes.js"
import authRouter from "./routes/auth.routes.js"
import uploadRoute from './routes/upload.routes.js';
import cloudinary from "./utils/cloudinary.js";
import fileUpload from "express-fileupload";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import listingRouter from "./routes/listing.routes.js"
dotenv.config();
mongoose.connect(process.env.MONGO).then(()=>{
    console.log("Connected to Mongodb!");
} ).catch((err)=>{
    console.log(err);
})

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser())

app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "/tmp/",  
  parseNested: true            
}));

cloudinary.config({
    cloud_name: "djlsmgzgp",
    api_key: "755551889835639",
    api_secret: "-L6mEDeHTaGeBpl07KBOxMI_Oks"
})

app.listen(3000,()=>{
    console.log(`Server is Running on Port 3000!!!!`)
})

// flow = index -> routes (endpoints) -> controller(api)
app.use("/api/user",userRouter)

app.use("/api/auth",authRouter)

app.use("/api/listing",listingRouter)

app.use('/api/upload', uploadRoute);

// middleware for error handling
app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    })
})