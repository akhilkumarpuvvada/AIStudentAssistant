import messageModel from "../models/Messages.js";

const addMessage = async (req, res) => {
  try {
    const { conversationId, role, text, sources, confidence, trace } = req.body;

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

    const reply = new messageModel({
      conversationId,
      role: "assistant",
      text: "Currently, i am not working will update soon!",
      sources: sources || [],
      confidence: confidence || null,
      trace: trace || null,
    })
    await reply.save();

    res.json({ success: true, message: "Message added", reply });
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
