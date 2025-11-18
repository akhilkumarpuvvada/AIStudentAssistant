import express from "express";
import upload from "../utils/fileUpload.js";
import { deleteDocument, getAllDocuments, getAllDocumentsByUser, getDocumentById, uploadDocument, updateDocument } from "../controllers/DocumentController.js";
import {isAuthenticated, requireRole} from "../middlewares/auth.js";

const documentRouter = express.Router();

documentRouter.post("/upload", upload.single("file"), isAuthenticated, uploadDocument);
documentRouter.get("/", isAuthenticated, requireRole("admin"), getAllDocuments);
documentRouter.get("/user", isAuthenticated, getAllDocumentsByUser);
documentRouter.get("/:id", isAuthenticated, getDocumentById);
documentRouter.put("/update/:id", isAuthenticated, updateDocument);
documentRouter.delete("/delete/:id", isAuthenticated, deleteDocument);

export default documentRouter;