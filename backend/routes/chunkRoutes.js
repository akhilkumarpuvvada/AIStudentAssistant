import express from "express";
import { getChunksByDocument, getChunkById, updateChunk, deleteChunk } from "../controllers/ChunkController.js";

const chunkRouter = express.Router();

chunkRouter.get("/document/:docId", getChunksByDocument); 
chunkRouter.get("/:id", getChunkById); 
chunkRouter.put("/:id", updateChunk); 
chunkRouter.delete("/:id", deleteChunk);

export default chunkRouter;
