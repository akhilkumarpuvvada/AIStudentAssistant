// models/Trace.js
import mongoose from "mongoose";
const traceSchema = new mongoose.Schema({
  userId: String,
  query: String,
  decision: String,
  reason: String,
  internalCount: Number,
  externalCount: Number,
  latencyMs: Number,
  nodes: Object,
}, { timestamps: true });
export default mongoose.model("Trace", traceSchema);
