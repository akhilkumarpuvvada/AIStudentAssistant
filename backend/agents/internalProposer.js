
import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const internalProposer = async ({ query, internalRetriever }) => {
  const chunks = internalRetriever || [];

  if (!chunks.length) {
    console.warn("[InternalProposer] No internal docs found.");
    return { role: "internal", candidate: null, used: [] };
  }

  const sources = chunks
    .map(
      (c, i) =>
        `SOURCE ${i + 1} (doc: ${c.docId}): ${String(c.text).slice(0, 400)}`
    )
    .join("\n\n");

  const prompt = `Answer using only the sources below.
Question: ${query}

${sources}

Answer:`;

  const res = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
    max_tokens: 400,
  });

  const candidate = res.choices[0].message.content.trim();
  const used = chunks.slice(0, 4).map((c) => ({ docId: c.docId, chunkId: c._id }));

  return { role: "internal", candidate, used };
};

export default internalProposer;
