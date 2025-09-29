import mongoose from "mongoose";

const classSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    studentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    teacherIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    documentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Document" }],
  },
  { timestamps: true }
);
const classModel = mongoose.model("Class", classSchema);
export default classModel;
