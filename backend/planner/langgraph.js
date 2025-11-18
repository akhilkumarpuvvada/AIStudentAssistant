import * as langgraphPkg from "@langchain/langgraph";
import { z } from "zod";

import classifierAgent from "../agents/classifierAgent.js";
import accessFilterAgent from "../agents/accessFilterAgent.js";
import retrieverAgent from "../agents/retrieverAgent.js";
import externalAgent from "../agents/externalAgent.js";
import internalProposer from "../agents/internalProposer.js";
import externalProposer from "../agents/externalProposer.js";
import debateAgent from "../agents/debateAgent.js";
import guardrailAgent from "../agents/guardrailAgent.js";
import traceAgent from "../agents/traceAgent.js";

const { StateGraph } = langgraphPkg;

const GraphState = z
  .object({
    query: z.string(),
    userId: z.string(),
    decision: z.string().optional(),
    reason: z.string().optional(),
    accessFilter: z.record(z.any()).optional(),
    internalRetriever: z.array(z.any()).optional(),
    externalRetriever: z.array(z.any()).optional(),
    internalProposer: z.record(z.any()).optional(),
    externalProposer: z.record(z.any()).optional(),
    debate: z.record(z.any()).optional(),
    guardrail: z.record(z.any()).optional(),
    trace: z.record(z.any()).optional(),
    startTime: z.number().optional(),
    next: z.string().optional(),
  })
  .passthrough();

async function classifierNode(state) {
  console.log("🔥 [ClassifierNode] Started:", state.query);
  const result = await classifierAgent({ query: state.query });
  const decision = (result?.decision || "DEBATE").toUpperCase();
  console.log("✅ [ClassifierNode] Decision:", decision);
  return { ...state, decision, reason: result?.reason, next: decision };
}

async function accessFilterNode(state) {
  console.log("🔒 [AccessFilterNode] Checking access for:", state.userId);
  const result = await accessFilterAgent({ userId: state.userId });
  return { ...state, accessFilter: result };
}

async function internalRetrieverNode(state) {
  console.log("📚 [InternalRetrieverNode] Query:", state.query);
  const result = await retrieverAgent({ query: state.query, userId: state.userId });
  const docs = result?.results || [];
  console.log(`✅ [InternalRetrieverNode] Retrieved ${docs.length} docs`);
  return { ...state, internalRetriever: docs };
}

async function externalRetrieverNode(state) {
  console.log("🌍 [ExternalRetrieverNode] Query:", state.query);
  const result = await externalAgent({ query: state.query });
  const docs = result?.results || [];
  console.log(`✅ [ExternalRetrieverNode] Retrieved ${docs.length} docs`);
  return { ...state, externalRetriever: docs };
}

async function internalProposerNode(state) {
  console.log("💡 [InternalProposerNode]");
  const result = await internalProposer({
    query: state.query,
    internalRetriever: state.internalRetriever || [],
  });
  return { ...state, internalProposer: result };
}

async function externalProposerNode(state) {
  console.log("💬 [ExternalProposerNode]");
  const result = await externalProposer({
    query: state.query,
    externalRetriever: state.externalRetriever || [],
  });
  return { ...state, externalProposer: result };
}

async function debateNode(state) {
  console.log("⚖️ [DebateNode] Running debate...");
  const result = await debateAgent({
    query: state.query,
    internalProposer: state.internalProposer,
    externalProposer: state.externalProposer,
  });

  if (!result?.final) {
    console.warn("⚠️ [DebateNode] No final result returned!");
  }

  console.log("✅ [DebateNode] Debate complete.");
  return { ...state, debate: result };
}

async function guardrailNode(state) {
  console.log("🛡️ [GuardrailNode] Checking for safety...");
  const result = await guardrailAgent({ debate: state.debate });

  if (result.blocked) {
    console.warn("⚠️ [GuardrailNode] Filtered:", result.reasons);
  } else {
    console.log("✅ [GuardrailNode] Safe output.");
  }

  return { ...state, guardrail: result };
}

async function traceNode(state) {
  const latency = Date.now() - (state.startTime || Date.now());
  const result = await traceAgent({
    userId: state.userId,
    query: state.query,
    classifier: { decision: state.decision, reason: state.reason },
    internalRetriever: { results: state.internalRetriever || [] },
    externalRetriever: { results: state.externalRetriever || [] },
    latencyMs: latency,
  });
  console.log("📊 [TraceNode] Trace recorded successfully.");
  return { ...state, trace: result };
}


export function buildGraph() {
  console.log("🧠 Building graph (camelCase API)...");

  const graph = new StateGraph(GraphState)
    .addNode("classifierNode", classifierNode)
    .addNode("accessFilterNode", accessFilterNode)
    .addNode("internalRetrieverNode", internalRetrieverNode)
    .addNode("externalRetrieverNode", externalRetrieverNode)
    .addNode("internalProposerNode", internalProposerNode)
    .addNode("externalProposerNode", externalProposerNode)
    .addNode("debateNode", debateNode)
    .addNode("guardrailNode", guardrailNode)
    .addNode("traceNode", traceNode)


    .addEdge("__start__", "classifierNode")

   
    .addConditionalEdges("classifierNode", (s) => s.next, {
      INTERNAL: "accessFilterNode",
      EXTERNAL: "externalRetrieverNode",
      DEBATE: "debateNode",
    })


    .addEdge("accessFilterNode", "internalRetrieverNode")
    .addEdge("internalRetrieverNode", "internalProposerNode")
    .addEdge("internalProposerNode", "debateNode")

    .addEdge("externalRetrieverNode", "externalProposerNode")
    .addEdge("externalProposerNode", "debateNode")


    .addEdge("debateNode", "guardrailNode")
    .addEdge("guardrailNode", "traceNode")
    .addEdge("traceNode", "__end__");

  graph.validate();
  console.log("✅ Graph built and validated successfully!");
  return graph.compile();
}

export async function runGraph(query, userId) {
  console.log("🚀 Starting graph with:", { query, userId });
  const start = Date.now();

  const app = buildGraph();
  const result = await app.invoke({ query, userId, startTime: start });
  const latency = Date.now() - start;

  const answer =
    result?.guardrail?.safeText ||
    result?.debate?.final ||
    "⚠️ No answer generated.";

  console.log("✅ [Final Answer]", {
    answer,
    latencyMs: latency,
    decision: result.decision,
  });

  return { ...result, answer, latencyMs: latency };
}
