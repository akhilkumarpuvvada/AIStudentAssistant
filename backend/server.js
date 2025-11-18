import express from "express";
import cors from "cors";
import session from "express-session";
import { RedisStore } from "connect-redis";
import { createClient } from "redis";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRouter.js";
import classRouter from "./routes/classRouter.js";
import chunkRouter from "./routes/chunkRoutes.js";
import conversationRouter from "./routes/conversationRoutes.js";
import documentRouter from "./routes/documentRouter.js";
import messageRouter from "./routes/messageRouter.js";
import dotenv from "dotenv";
import authRoute from "./routes/authRoutes.js";
dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});
redisClient.on("error", (err) => console.log("Redis error", err));
redisClient.connect();
const store = new RedisStore({
  client: redisClient,
  prefix: "session",
});

app.use(
  session({
    store,
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.get("/", (req, res) => res.send("Api is working "));

app.use("/api/user", userRouter);
app.use("/api/class", classRouter);
app.use("/api/chunk", chunkRouter);
app.use("/api/conversation", conversationRouter);
app.use("/api/document", documentRouter);
app.use("/api/message", messageRouter);
app.use("/api/auth", authRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
