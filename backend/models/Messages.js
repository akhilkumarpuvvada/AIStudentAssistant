import mongoose from "mongoose";

const messagesSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
    },
    role: { type: String, enum: ["user", "assistant"] },
    text: { type: String, required: true },
    sources: [{ type: mongoose.Schema.Types.ObjectId }],
    confidence: { type: Number },
    trace: { type: JSON },
  },
  { timestamps: true }
);

const messageModel = mongoose.model("Messages", messagesSchema);

export default messageModel;
