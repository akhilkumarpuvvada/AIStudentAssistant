import axios from "axios";

const externalAgent = (input) => {
const { query } = input;
  // Mocked response for now — replace with SerpAPI/Bing/other
  const results = [
    { source: "Wikipedia", snippet: `Mock external snippet about "${query}"` }
  ];
  return { results };
}

export default externalAgent;