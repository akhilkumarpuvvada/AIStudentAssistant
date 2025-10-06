import express from "express";
import { addClass, addStudentToClass, addTeacherToClass, deleteClass, getAllClasses, getClassById, updateClassById } from "../controllers/ClassController.js";

const classRouter = express.Router();

classRouter.post("/add", addClass);
classRouter.get("/", getAllClasses);
classRouter.get("/:id", getClassById);
classRouter.put("/update/:id", updateClassById);
classRouter.delete("/delete/:id", deleteClass);
classRouter.post("/add-student/:id", addStudentToClass);
classRouter.post("/add-teacher/:id", addTeacherToClass);



export default classRouter;