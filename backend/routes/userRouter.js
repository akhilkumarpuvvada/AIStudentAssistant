import express from "express";
import { addUser, deleteUser, getAllUsers, getUserById, updateUser } from "../controllers/UserController.js";

const userRouter = express.Router();


userRouter.post("/add", addUser);
userRouter.get("/", getAllUsers);
userRouter.get("/user/:id", getUserById);
userRouter.post("/update/:id", updateUser);
userRouter.post("/delete/:id", deleteUser);


export default userRouter;