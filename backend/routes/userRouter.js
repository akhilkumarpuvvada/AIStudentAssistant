import express from "express";
import {
  addUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
  getUsersByRole,
} from "../controllers/UserController.js";

const userRouter = express.Router();

userRouter.post("/add", addUser);
userRouter.get("/", getAllUsers);


userRouter.get("/:id", getUserById);
userRouter.put("/update/:id", updateUser);
userRouter.delete("/delete/:id", deleteUser);
userRouter.get("/role/:role", getUsersByRole);

export default userRouter;
