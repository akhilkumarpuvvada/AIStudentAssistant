import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    ownerType: { type: String, enum: ["student", "class"] },
    uploaderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    ownerId: { type: mongoose.Schema.Types.ObjectId, required: true }, 
    filePath: { type: String, required: true },
    status: { type: String, enum: ["uploaded", "processing", "ready"] },
    chunkIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chunk" }],
  },
  { timestamps: true }
);

const documentModel = mongoose.model("Document", documentSchema)
export default documentModel;