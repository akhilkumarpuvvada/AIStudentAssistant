import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


const externalProposer = async ({ query, externalRetriever }) => {
  const externals = externalRetriever?.results || [];

  if (!externals.length) {
    console.warn("[ExternalProposer] No external results found.");
    return { role: "external", candidate: null, used: [] };
  }

  const sources = externals
    .map((e, i) => `SOURCE ${i + 1} (${e.source}): ${String(e.snippet).slice(0, 400)}`)
    .join("\n\n");

  const prompt = `Answer using only the external sources below.

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
  const used = externals.slice(0, 4).map((e) => ({ source: e.source }));

  return { role: "external", candidate, used };
};

export default externalProposer;
