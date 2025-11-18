import mongoose from "mongoose";
import { OpenAIEmbeddings } from "@langchain/openai";
import userModel from "../models/User.js";
import documentModel from "../models/Documents.js";
import chunkModel from "../models/Chunk.js";

// 🧠 Initialize OpenAI embeddings
const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-small",
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function internalRetrieverAgent(query, userId) {
  const start = Date.now();
  try {
    // 1️⃣ Fetch user and allowed documents
    const user = await userModel.findById(userId).select("classIds");
    if (!user) {
      return { results: [] };
    }

    const accessibleDocs = await documentModel
      .find({
        $or: [
          { ownerType: "student", ownerId: user._id },
          { ownerType: "class", ownerId: { $in: user.classIds } },
        ],
      })
      .select("_id");

    if (!accessibleDocs.length) {
      return { results: [] };
    }

    const allowedDocIds = accessibleDocs.map((d) => new mongoose.Types.ObjectId(d._id));

    const firstDoc = allowedDocIds[0];
    const chunkCount = await chunkModel.countDocuments({ docId: firstDoc });

    if (chunkCount === 0) {
      console.warn("⚠️ No chunks exist for this document. Check chunking pipeline.");
    }

    const queryEmbedding = await embeddings.embedQuery(query);

    const keywordResults = await chunkModel.aggregate([
      {
        $search: {
          index: "default",
          compound: {
            must: [
              {
                text: {
                  query,
                  path: "text",
                  fuzzy: { maxEdits: 2 },
                },
              },
            ],
            filter: [
              {
                in: {
                  path: "docId",
                  value: allowedDocIds,
                },
              },
            ],
          },
        },
      },
      { $limit: 5 },
      { $project: { text: 1, docId: 1, score: { $meta: "searchScore" } } },
    ]);


    if (keywordResults.length === 0) {
      console.warn("⚠️ Keyword search returned 0 results. Possible reasons:");
    }

    const vectorResults = await chunkModel.aggregate([
      {
        $search: {
          index: "default",
          knnBeta: {
            vector: queryEmbedding,
            path: "embedding",
            k: 5,
            filter: {
              in: {
                path: "docId",
                value: allowedDocIds,
              },
            },
          },
        },
      },
      { $limit: 5 },
      { $project: { text: 1, docId: 1, score: { $meta: "vectorSearchScore" } } },
    ]);

    console.log(`   ✅ Vector results: ${vectorResults.length}`);

    const seen = new Set();
    const merged = [...keywordResults, ...vectorResults].filter((r) => {
      const id = r._id?.toString();
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });

    const ranked = merged
      .map((r) => ({ ...r, combinedScore: r.score || 0 }))
      .sort((a, b) => b.combinedScore - a.combinedScore)
      .slice(0, 5);


    if (ranked.length > 0) {
      console.log("   🪶 Sample snippet:", ranked[0].text?.slice(0, 120), "...");
    }

    return { results: ranked };
  } catch (err) {
    console.error(err);
    return { results: [] };
  }
}
