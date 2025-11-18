import express from "express";
import { addClass, addStudentToClass, addTeacherToClass, deleteClass, getAllClasses, getClassById, updateClassById } from "../controllers/ClassController.js";
import {isAuthenticated, requireRole} from "../middlewares/auth.js";

const classRouter = express.Router();

classRouter.post("/add", isAuthenticated, requireRole("admin"), addClass);
classRouter.get("/", isAuthenticated, getAllClasses);
classRouter.get("/:id", isAuthenticated,  getClassById);
classRouter.put("/update/:id", isAuthenticated, requireRole("admin", "teacher"), updateClassById);
classRouter.delete("/delete/:id", isAuthenticated, requireRole("admin"), deleteClass);
classRouter.post("/add-student/:id", isAuthenticated, requireRole("admin"), addStudentToClass);
classRouter.post("/add-teacher/:id", isAuthenticated, requireRole("admin"), addTeacherToClass);



export default classRouter;