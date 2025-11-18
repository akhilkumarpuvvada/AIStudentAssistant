
import hybridRetrieval from "../services/hybridRetrieval.js";

const retrieverAgent = async ({ query, userId }) => {
  const result = await hybridRetrieval(query, userId);
  const normalized = result?.results?.results || result?.results || [];
  console.log(`[RetrieverAgent] Retrieved ${normalized.length} docs`);
  return { results: normalized };
};

export default retrieverAgent;
