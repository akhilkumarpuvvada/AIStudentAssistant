import express from "express";
import {
  addUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
  getUsersByRole,
} from "../controllers/UserController.js";
import {isAuthenticated, requireRole} from "../middlewares/auth.js";

const userRouter = express.Router();

userRouter.post("/add", isAuthenticated, requireRole("admin"), addUser);

userRouter.get("/", isAuthenticated, requireRole("admin"), getAllUsers);
userRouter.get("/:id", getUserById);

userRouter.put("/update/:id", isAuthenticated,  requireRole("admin", "student"), updateUser);

userRouter.delete("/delete/:id", isAuthenticated, requireRole("admin"), deleteUser);

userRouter.get("/role/:role", isAuthenticated, requireRole("admin"), getUsersByRole);

export default userRouter;
