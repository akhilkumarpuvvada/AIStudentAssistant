import express from "express";
import { addMessage, getMessagesByConversation, deleteMessage } from "../controllers/MessageController.js";

const messageRouter = express.Router();

messageRouter.post("/add", addMessage); 
messageRouter.get("/:conversationId", getMessagesByConversation); 
messageRouter.delete("/:id", deleteMessage);

export default messageRouter;
