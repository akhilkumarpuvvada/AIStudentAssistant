import express from "express";
import { createConversation, getConversationsByUser, getConversationById, deleteConversation } from "../controllers/ConversationController.js";

const conversationRouter = express.Router();

conversationRouter.post("/add", createConversation);             
conversationRouter.get("/user/:userId", getConversationsByUser); 
conversationRouter.get("/:id", getConversationById);           
conversationRouter.delete("/:id", deleteConversation);

export default conversationRouter;
