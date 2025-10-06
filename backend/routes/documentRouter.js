import express from "express";
import upload from "../utils/fileUpload.js";
import { deleteDocument, getAllDocuments, getAllDocumentsByUser, getDocumentById, uploadDocument } from "../controllers/DocumentController.js";

const documentRouter = express.Router();

documentRouter.post("/upload", upload.single("file"), uploadDocument);
documentRouter.get("/", getAllDocuments);
documentRouter.get("/user/:id", getAllDocumentsByUser);
documentRouter.get("/:id", getDocumentById);
documentRouter.put("/update/:id", uploadDocument);
documentRouter.delete("/delete/:id", deleteDocument);

export default documentRouter;