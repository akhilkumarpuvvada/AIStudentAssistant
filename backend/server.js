import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDB } from "./config/db.js";

const app = express();

app.use(cors());
app.use(express.json());

connectDB()

app.get("/", (req, res) => res.send("Api is working ") )


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
})