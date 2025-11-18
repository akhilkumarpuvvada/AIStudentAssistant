import express from "express";
import { addMessage, getMessagesByConversation, deleteMessage } from "../controllers/MessageController.js";
import {isAuthenticated, requireRole} from "../middlewares/auth.js";

const messageRouter = express.Router();

messageRouter.post("/add", isAuthenticated, addMessage); 
messageRouter.get("/:conversationId", isAuthenticated, getMessagesByConversation); 
messageRouter.delete("/:id", isAuthenticated, deleteMessage);

export default messageRouter;
