import express from "express";
import { createConversation, getConversationsByUser, getConversationById, deleteConversation } from "../controllers/ConversationController.js";
import {isAuthenticated, requireRole} from "../middlewares/auth.js";

const conversationRouter = express.Router();

conversationRouter.post("/add", isAuthenticated, createConversation);             
conversationRouter.get("/", isAuthenticated, getConversationsByUser); 
conversationRouter.get("/:id", isAuthenticated, getConversationById);           
conversationRouter.delete("/:id",isAuthenticated, deleteConversation);

export default conversationRouter;
