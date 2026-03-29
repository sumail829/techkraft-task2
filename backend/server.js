import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes"
import favouriteRoutes from "./routes/favouriteRoutes"
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


try {
  mongoose.connect(process.env.MONGODB_URL)
  console.log("MongoDb connected succesfully");
} catch (error) {
  console.log("mongoDb connection failed", error);

}

app.use("/api", userRoutes);
app.use("/api", favouriteRoutes);
const PORT=process.env.PORT
app.listen(PORT,()=>{
    console.log(`server running on port ${process.env.PORT}`)
} )
