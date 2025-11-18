export async function detectPII(text) {
  if (!text) return false;
  const ssn = /\b\d{3}-\d{2}-\d{4}\b/; 
  return ssn.test(text);
}

export async function detectToxicity(text) {
    console.log(text, "text");
    
  if (!text) return false;

  const banned = ["kill", "bomb", "terror"];
  const lowerCaseText = text.toLowerCase();

  const triggered = banned.filter((w) =>
    new RegExp(`\\b${w}\\b`).test(lowerCaseText)
  );

  if (triggered.length > 0) {
    console.log("⚠️ Toxicity triggered:", triggered);
  }

  return triggered.length > 0;
}

