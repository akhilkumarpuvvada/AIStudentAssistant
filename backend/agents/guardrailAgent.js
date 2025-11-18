// agents/guardrailAgent.js
import { detectPII, detectToxicity } from "../services/safetyService.js";

/**
 * Applies safety filters (PII, toxicity) and cleans the final answer.
 */
const guardrailAgent = async ({ debate }) => {
  const rawText = debate?.final || "";
  const pii = await detectPII(rawText);
  const toxic = await detectToxicity(rawText);

  if (pii || toxic) {
    console.warn("[GuardrailAgent] Filter triggered:", { pii, toxic });
    return {
      safeText: "⚠️ Filtered for safety reasons.",
      blocked: true,
      reasons: { pii, toxic },
    };
  }

  // ✅ Clean and format the model output
  const clean = extractFinalAnswer(rawText, debate?.meta);

  return { safeText: clean.text, provenance: clean.provenance, blocked: false };
};

/**
 * Extracts and formats the FINAL ANSWER + PROVENANCE cleanly.
 */
function extractFinalAnswer(rawText, meta = {}) {
  let final = rawText;

  // Try to isolate between markers
  const finalMatch = rawText.match(/FINAL ANSWER:\**\s*([\s\S]*?)(?:- \*\*PROVENANCE|$)/i);
  const provenanceMatch = rawText.match(/PROVENANCE:\**\s*([\s\S]*)/i);

  const text = finalMatch
    ? finalMatch[1].trim().replace(/^[-*]\s*/gm, "")
    : rawText.trim();

  const provenance = provenanceMatch
    ? provenanceMatch[1].trim()
    : JSON.stringify(meta.internalUsed || meta.externalUsed || []);

  return { text, provenance };
}

export default guardrailAgent;
