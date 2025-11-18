
const classifierAgent = async ({ query }) => {
  const q = (query || "").toLowerCase();

  if (/\b(today|current|price|stock|weather)\b/.test(q))
    return { decision: "EXTERNAL", reason: "real-time information requested" };

  if (/\b(document|chapter|page|section|summary|summarize|explain)\b/.test(q))
    return { decision: "INTERNAL", reason: "document-related keywords" };

  return { decision: "DEBATE", reason: "fallback to mixed reasoning" };
};

export default classifierAgent;
