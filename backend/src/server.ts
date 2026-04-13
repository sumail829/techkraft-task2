import cors from "cors";
import express, { Application } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes"
import favouriteRoutes from "./routes/favouriteRoutes";

dotenv.config();

const app: Application = express();


app.use(cors());
app.use(express.json());


app.use("/api", userRoutes);
app.use("/api/favourite", favouriteRoutes);
app.get("/", (req, res) => {
  res.send("Backend is running");
});

const PORT: number = Number(process.env.PORT) || 5000;


const startServer = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGODB_URL as string);
    console.log(" MongoDB connected successfully");

    app.listen(PORT,"0.0.0.0", () => {
      console.log(` Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("MongoDB connection failed", error);
    process.exit(1); 
  }
};

startServer();