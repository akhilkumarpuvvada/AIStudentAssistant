import express from "express";
import { getMe, login, logout, signUp } from "../controllers/AuthController.js";

const authRoute = express.Router();
authRoute.post("/login", login);
authRoute.post("/logout", logout);
authRoute.post("/signup", signUp);
authRoute.get("/me", getMe)

export default authRoute;


