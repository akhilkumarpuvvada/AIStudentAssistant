import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRouter.js";
import classRouter from "./routes/classRouter.js";
import chunkRouter from "./routes/chunkRoutes.js";
import conversationRouter from "./routes/conversationRoutes.js";
import documentRouter from "./routes/documentRouter.js";
import messageRouter from "./routes/messageRouter.js";


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

connectDB()

app.get("/", (req, res) => res.send("Api is working "));

app.use("/api/user", userRouter);
app.use("/api/class", classRouter)
app.use("/api/chunk", chunkRouter);
app.use("/api/conversation", conversationRouter);
app.use("/api/document", documentRouter);
app.use("/api/message", messageRouter);



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
})