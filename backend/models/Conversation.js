import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "User"},
    classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class"},
    title: {type: String, required: true}
}, {timestamps: true});

const conversationModel = mongoose.model("Conversation", conversationSchema);
 export default conversationModel;