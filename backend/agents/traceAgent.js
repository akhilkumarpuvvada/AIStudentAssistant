import Trace from "../models/Trace.js";

const traceAgent = async ({
  userId,
  query,
  classifier,
  internalRetriever,
  externalRetriever,
  latencyMs,
}) => {
  const trace = new Trace({
    userId,
    query,
    decision: classifier?.decision,
    reason: classifier?.reason,
    internalCount: internalRetriever?.results?.length || 0,
    externalCount: externalRetriever?.results?.length || 0,
    latencyMs: latencyMs || 0,
  });

  await trace.save();
  console.log(`[TraceAgent] Trace saved: ${trace._id}`);
  return { traceId: trace._id.toString() };
};

export default traceAgent;
