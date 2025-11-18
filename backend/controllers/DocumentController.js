import documentModel from "../models/Documents.js";
import cloudinary from "../config/cloudinary.js";
import { loadAndSplitPDF } from "../utils/pdfLoader.js";
import chunkModel from "../models/Chunk.js";
import axios from "axios";
import fs from "fs";
import { OpenAIEmbeddings } from "@langchain/openai";
import userModel from "../models/User.js";

const uploadDocument = async (req, res) => {
  try {
    const { name, ownerType, ownerId } = req.body;
    const uploaderId = req.session.user._id;

    if (!req.file || !req.file.path) {
      return res.json({ success: false, message: "No file uploaded" });
    }

    const newDoc = new documentModel({
      name,
      ownerType,
      ownerId,
      uploaderId,
      filePath: req.file.path,
      status: "processing",
    });
    await newDoc.save();
    console.log("hi");

    let response;
    try {
      response = await axios.get(newDoc.filePath, {
        responseType: "arraybuffer",
      });
      console.log("PDF download success, size:", response.data.length);
    } catch (err) {
      console.error(
        "PDF download failed:",
        err.response?.status,
        err.response?.statusText
      );
      throw new Error("Could not download PDF from Cloudinary");
    }
    console.log(response, "res");

    const tempPath = `./temp_${newDoc._id}.pdf`;
    fs.writeFileSync(tempPath, response.data);

    const docs = await loadAndSplitPDF(tempPath);

    const savedChunks = await chunkModel.insertMany(
      docs.map((d, idx) => ({
        docId: newDoc._id,
        text: d.pageContent,
        position: idx,
        embedding: null,
      }))
    );

    const embeddings = new OpenAIEmbeddings({
      model: "text-embedding-3-small",
      apiKey: process.env.OPENAI_API_KEY,
    });

    for (const chunk of savedChunks) {
      const vector = await embeddings.embedQuery(chunk.text);
      await chunkModel.findByIdAndUpdate(chunk._id, { embedding: vector });
    }
    newDoc.chunkIds = savedChunks.map((c) => c._id);
    newDoc.status = "ready";
    await newDoc.save();

    res.json({
      success: true,
      message: "Document uploaded & chunked",
      chunks: savedChunks.length,
      data: newDoc,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const getAllDocuments = (req, res) => {
  try {
    const documents = documentModel.find({});
    res.json({ success: true, data: documents });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const getAllDocumentsByUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.session.user.id).select("classIds");
    const documents = await documentModel.find({
      $or: [
        { ownerType: "student", ownerId: user._id },
        { ownerType: "class", ownerId: { $in: user.classIds } },
      ],
    });

    if (documents) {
      res.json({ success: true, data: documents });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const getDocumentById = async (req, res) => {
  try {
    const doc = await documentModel
      .findById(req.params.id)
      .populate("uploaderId", "name email");
    res.json({ success: true, data: doc });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const updateDocument = async (req, res) => {
  try {
    const updatedDoc = await documentModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ success: true, data: updatedDoc });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const deleteDocument = async (req, res) => {
  try {
    const doc = await documentModel.findById(req.params.id);
    if (!doc)
      return res.json({ success: false, message: "Document not found" });

    const publicId = doc.filePath.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy("docs/" + publicId, {
      resource_type: "raw",
    });
    await chunkModel.deleteMany({ docId: req.params.id });
    await documentModel.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Document deleted" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export {
  updateDocument,
  getAllDocuments,
  getDocumentById,
  uploadDocument,
  deleteDocument,
  getAllDocumentsByUser,
};
