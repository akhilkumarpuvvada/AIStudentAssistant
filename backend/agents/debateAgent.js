// agents/debateAgent.js
import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Synthesizes a natural, human-like final answer using both internal and external knowledge.
 */
const debateAgent = async ({ query, internalProposer, externalProposer }) => {
  const internal = internalProposer || {};
  const external = externalProposer || {};

  const internalText = internal.candidate
    ? `INTERNAL KNOWLEDGE: ${internal.candidate}`
    : "";
  const externalText = external.candidate
    ? `EXTERNAL KNOWLEDGE: ${external.candidate}`
    : "";

  // 🧠 New natural prompt
  const prompt = `
You are an expert AI assistant. You have access to internal and external knowledge about the user's question.
Your goal is to produce a **clear, natural explanation** as if chatting with the user — not a report.

Blend the insights smoothly. If only internal knowledge is available, rely on it fully. 
If both are available, merge them naturally and avoid mentioning "internal" or "external" at all.

Return your answer strictly in this JSON format:
{
  "finalAnswer": "A concise, conversational explanation (≤200 words)",
  "sources": [{"docId": "..."}]
}

USER QUESTION: ${query}

${internalText}
${externalText}
`;

  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
    max_tokens: 600,
  });

  const raw = response.choices[0].message.content.trim();

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    console.warn("[DebateAgent] JSON parse failed — fallback to plain text.");
    parsed = {
      finalAnswer: raw,
      sources: [...(internal.used || []), ...(external.used || [])],
    };
  }

  return {
    final: parsed.finalAnswer,
    provenance: parsed.sources || [],
    meta: {
      internalUsed: internal.used || [],
      externalUsed: external.used || [],
    },
  };
};

export default debateAgent;
