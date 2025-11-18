import messageModel from "../models/Messages.js";
import { runGraph } from "../planner/langgraph.js";

const addMessage = async (req, res) => {
  try {
    const { conversationId, role, text, sources, confidence, trace } = req.body;
    const userId = req.session.user.id;

    if (!conversationId || !role || !text) {
      return res.json({
        success: false,
        message: "conversationId, role, and text are required",
      });
    }

    const newMessage = new messageModel({
      conversationId,
      role,
      text,
      sources: sources || [],
      confidence: confidence || null,
      trace: trace || null,
    });

    await newMessage.save();

   const result = await runGraph(text, userId);
  
    const assistantMsg = new messageModel({
      conversationId,
      role: "assistant",
      text: result.answer,
      sources: [
           ...(result.internalSources || []).slice(0,5).map(c => ({ docId: c.docId, chunkId: c._id })),
        ...(result.externalSources || []).slice(0,5).map(e => ({ source: e.source }))
      ],
      confidence: confidence || null,
      trace: trace || null,
    })
    await assistantMsg.save();

    res.json({ success: true, message: "Message added", reply: assistantMsg });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const getMessagesByConversation = async (req, res) => {
  try {    
    const { conversationId } = req.params;

    const messages = await messageModel
      .find({ conversationId })
      .sort({ createdAt: 1 });

    res.json({ success: true, data: messages });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    await messageModel.findByIdAndDelete(id);

    res.json({ success: true, message: "Message deleted" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export { addMessage, getMessagesByConversation, deleteMessage };
