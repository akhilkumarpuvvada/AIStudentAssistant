import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRouter.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

connectDB()

app.get("/", (req, res) => res.send("Api is working "));

app.use("/api/user", userRouter);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
})