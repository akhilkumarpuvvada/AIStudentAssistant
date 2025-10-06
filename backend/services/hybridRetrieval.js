import { OpenAIEmbeddings } from "@langchain/openai";
import userModel from "../models/User.js";
import documentModel from "../models/Documents.js";
import chunkModel from "../models/Chunk.js";

const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-small",
  apiKey: process.env.OPENAI_API_KEY,
});

const hybridRetrieval = async (userQuery, userId, k = 5) => {
  const user = await userModel.findById(userId).select("classIds");
  const accessibleDocs = await documentModel
    .find({
      $or: 
        [
          { ownerType: "student", ownerId: user.id },
          { ownerType: "class", ownerId: { $in: user.classIds } },
        ],
    })
    .select("classIds");

  const allowedDocs = accessibleDocs.map((d) => d._id);

  const queryEmbedding = await embeddings.embedQuery(userQuery);

  const keywordResults = await chunkModel.aggregate([
    {
      $search: {
        index: "hybrid_index",
        text: { query: userQuery, path: "text" },
        filter: {
          $in: {
            path: "docId",
            value: allowedDocs,
          },
        },
      },
    },
    { $limit: k },
  ]);

  const vectorResults =await chunkModel.aggregate([
    {
      $search:{
        index: "hybrid_index",
        knnBeta: {vector: queryEmbedding, path: "embedding", k},
        filter: {
          $in: {
            path: "docId",
            value: allowedDocs,
          }
        }
      }
    }
  ])

  const set = new Set();
  const mergedResults = [...keywordResults, vectorResults].filter((r) =>{
    const id = r._id.toString();
    if(set.has(id)) return false;
    set.add(id);
    return true;
  })
  return mergedResults.slice(0,k);
};
