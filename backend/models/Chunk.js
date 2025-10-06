import mongoose from "mongoose";

const chunkSchema = new mongoose.Schema(
  {
    docId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Document" },
    text: { type: String, required: true },
    embedding: { type: [Number] },
    position: { type: Number, required: true },
  },
  { timestamps: true }
);

const chunkModel = mongoose.model("Chunk", chunkSchema);

export default chunkModel;