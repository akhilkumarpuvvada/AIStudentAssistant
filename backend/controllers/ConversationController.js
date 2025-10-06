import conversationModel from "../models/Conversation.js";
import messageModel from "../models/Messages.js";

// 1. Create new conversation
const createConversation = async (req, res) => {
  try {
    const { userId, classId } = req.body;

    if (!userId) {
      return res.json({
        success: false,
        message: "userId and title are required",
      });
    }

    const newConversation = new conversationModel({
      userId,
      classId: classId || null,
      title : "New Chat",
    });

    await newConversation.save();
    res.json({
      success: true,
      message: "Conversation created",
      data: newConversation,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const getConversationsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const conversations = await conversationModel
      .find({ userId })
      .sort({ createdAt: -1 });

    res.json({ success: true, data: conversations });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const getConversationById = async (req, res) => {
  try {
    const { id } = req.params;
    const conversation = await conversationModel.findById(id);

    if (!conversation) {
      return res.json({ success: false, message: "Conversation not found" });
    }

    const messages = await messageModel
      .find({ conversationId: id })
      .sort({ createdAt: 1 });

    res.json({ success: true, data: { conversation, messages } });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const deleteConversation = async (req, res) => {
  try {
    const { id } = req.params;

    const conversation = await conversationModel.findById(id);
    
    if (!conversation) {
      return res.json({ success: false, message: "Conversation not found" });
    }

    await messageModel.deleteMany({ conversationId: id }); 
    await conversationModel.findByIdAndDelete(id);

    res.json({ success: true, message: "Conversation and messages deleted" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export {
  createConversation,
  getConversationsByUser,
  getConversationById,
  deleteConversation,
};
