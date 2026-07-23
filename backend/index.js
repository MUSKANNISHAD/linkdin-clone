import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";

dotenv.config();
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(userRoutes);
app.use(postRoutes);
app.use(express.static("uploads"));

app.get("/home", (req, res) => {
    res.send("this is home");
})

const start = async () => {
    try {
        const mongo = await mongoose.connect(process.env.MONGOURL);
        console.log("MongoDB Connected");
        app.listen(3000, () => {
            console.log("server is listening on port 3000");
        })
    } catch (err) {
        console.error("Database connection failed:", err);

    }
}

start()