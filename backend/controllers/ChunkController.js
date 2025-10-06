import chunkModel from "../models/Chunk.js";

// 1. Get all chunks for a document
const getChunksByDocument = async (req, res) => {
  try {
    const { docId } = req.params;
    const chunks = await chunkModel.find({ docId }).sort({ position: 1 });

    res.json({ success: true, data: chunks });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// 2. Get single chunk by ID
const getChunkById = async (req, res) => {
  try {
    const { id } = req.params;
    const chunk = await chunkModel.findById(id);

    if (!chunk) {
      return res.json({ success: false, message: "Chunk not found" });
    }

    res.json({ success: true, data: chunk });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// 3. Update a chunk (e.g., embedding vector)
const updateChunk = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedChunk = await chunkModel.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedChunk) {
      return res.json({ success: false, message: "Chunk not found" });
    }

    res.json({ success: true, data: updatedChunk });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// 4. Delete a chunk
const deleteChunk = async (req, res) => {
  try {
    const { id } = req.params;
    await chunkModel.findByIdAndDelete(id);

    res.json({ success: true, message: "Chunk deleted" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export { getChunksByDocument, getChunkById, updateChunk, deleteChunk };
