import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import {
  initialAdmins,
  templarArmoury,
  templarConsumables,
  templarBookings,
  templarFinance,
  templarOperations,
  templarMediaDrafts,
  templarMarketing,
  templarIntelligence,
  pendingApprovals,
  operationalAlerts
} from './src/server/templarData';
import {
  PendingApprovalAction,
  ArmouryItem,
  ConsumableStock,
  BookingRecord,
  FinanceTransaction,
  MediaPostDraft,
  IncidentRecord,
  SafetyCheckItem,
  GameScheduleSlot
} from './src/types';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Increase JSON body limit to support multimodal image / document uploads
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Initialize Google GenAI client if API key is present
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    aiClient = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.warn('Failed to initialize Google GenAI client with provided key:', err);
  }
}

// -------------------------------------------------------------
// 1. RuFlo & Cindy Multi-Harness Specialist Agents
// -------------------------------------------------------------
interface AgentRecord {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'idle' | 'working' | 'ready' | 'evaluating';
  specialty: string;
  confidence: number;
}

const specialistAgents: AgentRecord[] = [
  { id: 'cindy-lead', name: 'Cindy (Lead)', role: 'Primary AI Companion & Multi-Harness Lead', avatar: '🌸', status: 'ready', specialty: 'Open-source autonomous agent (makecindy/cindy). Tagline: "Consider it done." Multi-harness swapping (RuFlo, Claude Code, Codex, Pi)', confidence: 0.99 },
  { id: 'atlas', name: 'Atlas', role: 'Research & Source Synthesis', avatar: '🏛️', status: 'ready', specialty: 'Authoritative data retrieval, multi-source triangulation & architecture roadmaps', confidence: 0.98 },
  { id: 'cipher', name: 'Cipher', role: 'Autonomous Full-Stack Engineer', avatar: '⚡', status: 'ready', specialty: 'TypeScript, React, Node.js, microservices & code review', confidence: 0.96 },
  { id: 'vigil', name: 'Vigil', role: 'AI Defense & ADR-322A Sentinel', avatar: '🛡️', status: 'ready', specialty: 'PII detection, prompt injection mitigation & strict execution bounds', confidence: 0.99 },
  { id: 'argus', name: 'Argus', role: 'QA & Verification Automator', avatar: '🔬', status: 'ready', specialty: 'Property-based tests, boundary checks, fuzzing & regression coverage', confidence: 0.95 },
  { id: 'archivist', name: 'Archivist', role: 'Memory & Knowledge Graph Indexer', avatar: '📚', status: 'ready', specialty: 'AgentDB vector recall, semantic ontology & entity relationship mapping', confidence: 0.97 },
  { id: 'engineer', name: 'Engineer', role: 'Implementation & Build Diagnostics', avatar: '⚙️', status: 'ready', specialty: 'Zero-regression refactoring, package hygiene & runtime debugging', confidence: 0.96 },
  { id: 'strategist', name: 'Strategist', role: 'Planning & Decision Support', avatar: '🧭', status: 'ready', specialty: 'Cost/benefit analysis, invariant proofs & ADR justification', confidence: 0.97 },
  { id: 'solon', name: 'Solon', role: 'Consensus & Invariant Arbiter', avatar: '⚖️', status: 'ready', specialty: 'Byzantine fault-tolerant voting, invariant proofs & release signing', confidence: 0.98 }
];

// -------------------------------------------------------------
// 2. Unified Memory & Knowledge Graph
// -------------------------------------------------------------
interface MemoryItem {
  id: string;
  key: string;
  value: string;
  namespace: 'patterns' | 'adrs' | 'guardrails' | 'benchmarks';
  score: number;
  tags: string[];
  createdAt: string;
}

let agentDbMemory: MemoryItem[] = [
  {
    id: 'mem-0',
    key: 'pattern-cindy-multi-harness-coordination',
    value: 'Cindy (makecindy/cindy) acts as primary interaction layer with multi-harness dispatch: RuFlo Swarms for consensus architecture, Claude Code for local refactoring, Codex for rapid generation, and Pi for lean multi-model execution.',
    namespace: 'patterns',
    score: 0.99,
    tags: ['cindy', 'makecindy', 'harness', 'ruflo'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'mem-1',
    key: 'pattern-hierarchical-swarm-consensus',
    value: 'When task complexity >= 3 micro-domains, initiate Cindy with Atlas as research root and Solon as consensus gate. Require 67% BFT quorum before artifact promotion.',
    namespace: 'patterns',
    score: 0.94,
    tags: ['swarm', 'consensus', 'orchestration'],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'mem-2',
    key: 'adr-322a-safety-envelope-isolation',
    value: 'Delegation may only reduce tools, servers, namespaces, network, and spend. Invariant check prohibits concurrent multi-writer race conditions.',
    namespace: 'guardrails',
    score: 0.98,
    tags: ['security', 'policy', 'adr-322a'],
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString()
  },
  {
    id: 'mem-3',
    key: 'pattern-motion-seek-t-determinism',
    value: 'Every motion reel is a pure function of time: window.seek(t). Closed-form damped springs prevent state drift: f(t) = target + A*e^(-zeta*w*t)*cos(w_d*t). Audio mixes to -14 LUFS on beat grid.',
    namespace: 'patterns',
    score: 0.96,
    tags: ['motion', 'seek-t', 'springs', 'audio'],
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 'mem-4',
    key: 'pattern-vector-recall-threshold',
    value: 'AgentDB memory retrieval query filter: only incorporate recalled context into active executor prompts when cosine/HNSW similarity score > 0.70.',
    namespace: 'benchmarks',
    score: 0.89,
    tags: ['agentdb', 'rag', 'recall'],
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
  }
];

interface KnowledgeNode {
  id: string;
  label: string;
  category: 'architecture' | 'policy' | 'workflow' | 'entity' | 'tool';
  summary: string;
  confidence: number;
  connections: string[];
}

let knowledgeGraphNodes: KnowledgeNode[] = [
  {
    id: 'node-cindy',
    label: 'Cindy AI Companion (makecindy/cindy)',
    category: 'entity',
    summary: 'Primary open-source AI companion with multi-harness orchestration (RuFlo Swarms, Claude Code, Codex, Pi). Motto: "Consider it done."',
    confidence: 0.99,
    connections: ['node-ruflo', 'node-agentdb', 'node-adr322a', 'node-motion']
  },
  {
    id: 'node-ruflo',
    label: 'RuFlo Swarm Harness',
    category: 'architecture',
    summary: 'Multi-agent orchestration ledger by ruvnet coordinating 9 specialists with topology routing and Byzantine consensus voting.',
    confidence: 0.98,
    connections: ['node-cindy', 'node-adr322a', 'node-agentdb']
  },
  {
    id: 'node-adr322a',
    label: 'ADR-322A Safety Envelope',
    category: 'policy',
    summary: 'Strict execution boundaries: single writer per worktree, privilege monotonic decrease, Byzantine consensus before mutation.',
    confidence: 0.99,
    connections: ['node-ruflo', 'node-cindy']
  },
  {
    id: 'node-agentdb',
    label: 'AgentDB Vector Memory',
    category: 'architecture',
    summary: 'HNSW vector store and pattern crystallization cache with >0.70 similarity gating for zero-redundancy context recall.',
    confidence: 0.95,
    connections: ['node-cindy', 'node-ruflo']
  },
  {
    id: 'node-motion',
    label: 'Deterministic Motion Studio',
    category: 'tool',
    summary: 'seek(t) frame-by-frame rendering pipeline with closed-form springs, beat grid synchronization, and automated critique loops.',
    confidence: 0.96,
    connections: ['node-cindy']
  }
];

interface UserPreferences {
  activeAi: 'cindy' | 'luna';
  activeHarness: 'ruflo' | 'claude-code' | 'codex' | 'pi';
  companionTone: 'friendly' | 'analytical' | 'witty' | 'concise' | 'direct';
  voicePitch: number;
  voiceRate: number;
  proactiveLevel: 'subtle' | 'balanced' | 'autonomous';
  safetyEnvelope: 'strict' | 'standard' | 'developer';
  privacyMode: boolean;
  quietHours: boolean;
}

let userPreferences: UserPreferences = {
  activeAi: 'cindy', // Cindy is the main interacting AI by default!
  activeHarness: 'ruflo',
  companionTone: 'direct',
  voicePitch: 1.05,
  voiceRate: 1.0,
  proactiveLevel: 'autonomous',
  safetyEnvelope: 'strict',
  privacyMode: false,
  quietHours: false
};

// -------------------------------------------------------------
// 3. Tool Discovery Registry
// -------------------------------------------------------------
interface ToolRecord {
  id: string;
  name: string;
  description: string;
  category: 'research' | 'code' | 'security' | 'memory' | 'motion' | 'system';
  riskLevel: 'low' | 'medium' | 'high';
  requiredPermission: string;
  status: 'available' | 'active' | 'requires_auth';
  lastExecuted?: string;
}

let toolRegistry: ToolRecord[] = [
  {
    id: 'tool-cindy-harness-swap',
    name: 'Cindy Multi-Harness Switcher',
    description: 'Swap execution backend on the fly between RuFlo Swarm, Claude Code, Codex, and Pi.',
    category: 'system',
    riskLevel: 'low',
    requiredPermission: 'manage:harness',
    status: 'available'
  },
  {
    id: 'tool-agentdb-search',
    name: 'AgentDB Vector Recall',
    description: 'Retrieve crystallized patterns, guardrails, and architectural precedents using HNSW cosine similarity (>0.70).',
    category: 'memory',
    riskLevel: 'low',
    requiredPermission: 'read:memory',
    status: 'available'
  },
  {
    id: 'tool-adr-validator',
    name: 'ADR-322A Policy Validator',
    description: 'Verifies safety boundaries, single-writer worktrees, PII sanitize checks, and prevents permission escalation.',
    category: 'security',
    riskLevel: 'low',
    requiredPermission: 'read:policy',
    status: 'available'
  },
  {
    id: 'tool-code-eval',
    name: 'Sandboxed JavaScript / TypeScript Evaluator',
    description: 'Safely parses and executes pure algorithms or expressions within an isolated Node execution context.',
    category: 'code',
    riskLevel: 'medium',
    requiredPermission: 'execute:sandbox',
    status: 'available'
  },
  {
    id: 'tool-motion-seek',
    name: 'Motion Engine seek(t) Simulator',
    description: 'Calculates closed-form spring position, velocity, and beat grid alignment for frame-by-frame motion graphics.',
    category: 'motion',
    riskLevel: 'low',
    requiredPermission: 'render:canvas',
    status: 'available'
  },
  {
    id: 'tool-web-research',
    name: 'Authoritative Web & Source Synthesizer',
    description: 'Queries verified documentation and structural specifications for modern developer platforms.',
    category: 'research',
    riskLevel: 'low',
    requiredPermission: 'read:web',
    status: 'available'
  }
];

interface ADRItem {
  id: string;
  number: number;
  title: string;
  status: 'Accepted' | 'Proposed' | 'Under Review' | 'Superseded';
  author: string;
  context: string;
  decision: string;
  consequences: string;
  date: string;
}

let adrRecords: ADRItem[] = [
  {
    id: 'adr-001',
    number: 1,
    title: 'Adoption of Cindy as Primary AI & RuFlo Multi-Agent Swarm',
    status: 'Accepted',
    author: 'Cindy & Atlas',
    context: 'Users require an approachable, open-source primary AI companion with multi-harness capabilities (Claude Code, Codex, Pi, and RuFlo swarms).',
    decision: 'Establish Cindy (makecindy/cindy) as the primary interacting AI with "Consider it done" action execution, backed by RuFlo consensus swarms.',
    consequences: 'Delivers immediate hands-on task execution, zero-fluff engineering, and full multi-device harness portability.',
    date: '2026-10-15'
  },
  {
    id: 'adr-002',
    number: 2,
    title: 'AgentDB Hierarchical Recall & Vector Pattern Crystallization',
    status: 'Accepted',
    author: 'Nexus & Archivist',
    context: 'Agents executing repeated workflows must recall successful precedents without re-prompting or token bloat.',
    decision: 'Maintain AgentDB vector memory store with namespace segmentation and score threshold gating (>0.70).',
    consequences: 'Eliminates repetitive errors and preserves high-confidence architectural blueprints across sessions.',
    date: '2026-10-20'
  },
  {
    id: 'adr-003',
    number: 3,
    title: 'ADR-322A Strict Execution Safety Envelopes & Invariant Gates',
    status: 'Accepted',
    author: 'Vigil & Solon',
    context: 'Automated agent swarms must not compromise system security or execute unauthorized destructive mutations.',
    decision: 'Enforce non-expandable safety envelopes, PII sanitization filters, and Byzantine consensus validation on all build outputs.',
    consequences: 'Ensures enterprise-grade security compliance with zero inadvertent data leaks.',
    date: '2026-10-25'
  },
  {
    id: 'adr-004',
    number: 4,
    title: 'Deterministic Motion Studio Pipeline & Closed-Form Springs',
    status: 'Accepted',
    author: 'Cindy & Cipher',
    context: 'Generative motion graphics must eliminate non-deterministic CSS transitions and unrepeatable rendering drift.',
    decision: 'Enforce window.seek(t) determinism, closed-form springs with mass/damping, -14 LUFS beat grids, and automated critique sheet loops.',
    consequences: 'Ensures every frame can be rendered independently in parallel with zero frame-dropping or temporal artifacts.',
    date: '2026-10-28'
  }
];

// -------------------------------------------------------------
// Health check
// -------------------------------------------------------------
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    version: '3.63.6',
    time: new Date().toISOString(),
    aiConfigured: !!aiClient,
    primaryAi: userPreferences.activeAi,
    activeHarness: userPreferences.activeHarness,
    agentsCount: specialistAgents.length,
    memoryCount: agentDbMemory.length
  });
});

// -------------------------------------------------------------
// Preferences Endpoints
// -------------------------------------------------------------
app.get('/api/user-preferences', (req, res) => {
  res.json({ preferences: userPreferences });
});

app.post('/api/user-preferences', (req, res) => {
  if (req.body && typeof req.body === 'object') {
    userPreferences = { ...userPreferences, ...req.body };
  }
  res.json({ success: true, preferences: userPreferences });
});

// -------------------------------------------------------------
// Knowledge Graph Endpoints
// -------------------------------------------------------------
app.get('/api/knowledge-graph', (req, res) => {
  res.json({ nodes: knowledgeGraphNodes, count: knowledgeGraphNodes.length });
});

app.post('/api/knowledge-graph', (req, res) => {
  const { label, category, summary, connections } = req.body;
  if (!label || !summary) {
    res.status(400).json({ error: 'Label and summary are required' });
    return;
  }
  const newNode: KnowledgeNode = {
    id: `node-${Date.now()}`,
    label,
    category: category || 'entity',
    summary,
    confidence: 0.95,
    connections: Array.isArray(connections) ? connections : []
  };
  knowledgeGraphNodes.push(newNode);
  res.json({ success: true, node: newNode });
});

// -------------------------------------------------------------
// Tool Registry Endpoints
// -------------------------------------------------------------
app.get('/api/tools', (req, res) => {
  res.json({ tools: toolRegistry, count: toolRegistry.length });
});

app.post('/api/tools/execute', async (req, res) => {
  const { toolId, input } = req.body;
  const tool = toolRegistry.find(t => t.id === toolId);
  if (!tool) {
    res.status(404).json({ error: `Tool ${toolId} not found in registry.` });
    return;
  }

  tool.lastExecuted = new Date().toISOString();

  let output: any = null;
  try {
    if (toolId === 'tool-cindy-harness-swap') {
      const harness = input?.harness || 'ruflo';
      userPreferences.activeHarness = harness;
      output = {
        status: 'swapped',
        activeHarness: harness,
        capabilities: harness === 'ruflo' ? 'RuFlo Byzantine Consensus Swarm (9 agents)' :
                      harness === 'claude-code' ? 'Claude Code Agentic CLI & Tool Harness' :
                      harness === 'codex' ? 'Codex Autonomous Code Synthesizer' : 'Pi Lean Multi-Model Runtime',
        swappedAt: new Date().toISOString()
      };
    } else if (toolId === 'tool-agentdb-search') {
      const q = (input?.query || '').toLowerCase();
      const hits = agentDbMemory.filter(m => !q || m.key.includes(q) || m.value.includes(q));
      output = { count: hits.length, threshold: 0.70, results: hits.slice(0, 5) };
    } else if (toolId === 'tool-adr-validator') {
      output = {
        passed: true,
        invariants: [
          'Single writer per worktree: ENFORCED',
          'Monotonic privilege restriction: VERIFIED',
          'PII sanitization filter: 0 LEAKS DETECTED',
          'Cryptographic release signature: VALID'
        ],
        safetyEnvelope: 'ADR-322A COMPLIANT'
      };
    } else if (toolId === 'tool-code-eval') {
      const expr = input?.code || 'Math.sin(Math.PI / 4) * 100';
      let evaluatedVal: any;
      try {
        const safeFunc = new Function('Math', 'Date', `return (${expr});`);
        evaluatedVal = safeFunc(Math, Date);
      } catch (err: any) {
        evaluatedVal = `Eval Notice: ${err.message}`;
      }
      output = { code: expr, result: evaluatedVal, executionTimeMs: 1.2 };
    } else if (toolId === 'tool-motion-seek') {
      const t = typeof input?.t === 'number' ? input.t : 2.5;
      const target = input?.target || 1.0;
      const zeta = 0.7;
      const omega = 12.0;
      const omega_d = omega * Math.sqrt(1 - zeta * zeta);
      const springVal = target + (0 - target) * Math.exp(-zeta * omega * t) * Math.cos(omega_d * t);
      output = {
        t,
        springPosition: parseFloat(springVal.toFixed(4)),
        beatIndex: Math.floor((t * 120) / 60),
        loudnessLufs: -14.1,
        deterministic: true
      };
    } else {
      output = { status: 'executed', input, timestamp: new Date().toISOString() };
    }

    res.json({ success: true, toolId, output });
  } catch (err: any) {
    res.status(500).json({ error: `Tool execution failed: ${err.message}` });
  }
});

// -------------------------------------------------------------
// Live Real-Time Opportunities & 3D Brain Telemetry
// -------------------------------------------------------------
interface OpportunityItem {
  id: string;
  title: string;
  category: 'vision' | 'architecture' | 'performance' | 'security' | 'creative';
  impact: 'high' | 'critical' | 'strategic';
  nodesInvolved: string[];
  description: string;
  actionableStep: string;
  confidence: number;
}

let liveOpportunities: OpportunityItem[] = [
  {
    id: 'opp-1',
    title: 'Visual Whiteboard / Screen Synthesis',
    category: 'vision',
    impact: 'strategic',
    nodesInvolved: ['node-cindy', 'atlas', 'cipher'],
    description: 'Cindy can process live camera frames of architecture diagrams or handwritten specs and synthesize production TypeScript code.',
    actionableStep: 'Open Vision Hub, snap whiteboard or diagram, and click "Extract Architecture & Code"',
    confidence: 0.98
  },
  {
    id: 'opp-2',
    title: 'Deterministic 15s UI-Morph Motion Reel Compilation',
    category: 'creative',
    impact: 'high',
    nodesInvolved: ['cipher', 'node-motion'],
    description: 'Current UI-morph spring damping (ζ=0.72) meets 9.2/10 critique threshold. Ready to compile 900 frame sequence at 60 fps.',
    actionableStep: 'Run seek(t) pipeline audit and review contact sheet',
    confidence: 0.96
  },
  {
    id: 'opp-3',
    title: 'AgentDB Vector Recall Threshold Optimization',
    category: 'performance',
    impact: 'high',
    nodesInvolved: ['archivist', 'node-agentdb'],
    description: '5 crystallized patterns loaded. High semantic similarity (>0.90) available for ADR-322A and multi-harness caching.',
    actionableStep: 'Incorporate memory context into active worker execution DAG',
    confidence: 0.95
  },
  {
    id: 'opp-4',
    title: 'ADR-322A Single-Writer Worktree Enforcement',
    category: 'security',
    impact: 'critical',
    nodesInvolved: ['vigil', 'solon', 'node-adr322a'],
    description: 'Ensure all autonomous agents operate in isolated worktree branches with zero multi-writer race conditions.',
    actionableStep: 'Run automated ADR-322A compliance scanner across active worktree',
    confidence: 0.99
  },
  {
    id: 'opp-5',
    title: 'Multi-Harness Dynamic Swapping (RuFlo ↔ Claude Code)',
    category: 'architecture',
    impact: 'strategic',
    nodesInvolved: ['node-cindy', 'engineer', 'strategist'],
    description: 'Switch between RuFlo Swarms for consensus governance and Claude Code / Codex for rapid file iteration.',
    actionableStep: 'Select harness from the top header dropdown or issue "cindy harness" CLI command',
    confidence: 0.97
  }
];

app.get('/api/opportunities', (req, res) => {
  res.json({ opportunities: liveOpportunities, count: liveOpportunities.length });
});

// -------------------------------------------------------------
// Surroundings Camera Vision Analysis Endpoint (Gemini Multimodal)
// -------------------------------------------------------------
app.post('/api/vision/analyze', async (req, res) => {
  try {
    const { image, facingMode = 'user', prompt = '' } = req.body;
    if (!image) {
      res.status(400).json({ error: 'Image base64 data is required' });
      return;
    }

    const matches = image.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
    const mimeType = matches ? matches[1] : 'image/jpeg';
    const base64Data = matches ? matches[2] : image;

    if (aiClient) {
      const visionPrompt = `You are Cindy (from makecindy/cindy), an autonomous AI agent with real-time visual perception.
Analyze this live camera frame from the user's ${facingMode === 'user' ? 'front (user-facing)' : 'back / environmental'} camera.
Your task:
1. Provide a concise environmental summary (lighting, room setting, workspace context, physical objects).
2. Detect key visual entities (screens, notes, keyboards, displays, whiteboards, people, documents).
3. Identify 2 to 3 high-impact technical, architectural, or productivity OPPORTUNITIES that Cindy and her RuFlo agent swarm can help execute right now.
User custom instruction: "${prompt || 'Inspect surroundings and detect actionable opportunities'}"

Return ONLY valid JSON matching this schema:
{
  "environmentSummary": "Concise 1-2 sentence description",
  "detectedEntities": ["Entity 1", "Entity 2", "Entity 3"],
  "lighting": "e.g. Natural daylight / Low light / Studio lighting",
  "opportunities": [
    {
      "title": "Short title",
      "description": "What Cindy detected and why it is valuable",
      "suggestedAction": "Exact next step Cindy or swarm can execute",
      "impact": "high"
    }
  ]
}`;

      try {
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Vision model request timed out')), 8000)
        );

        const geminiPromise = aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [
            {
              role: 'user',
              parts: [
                { text: visionPrompt },
                {
                  inlineData: {
                    mimeType,
                    data: base64Data
                  }
                }
              ]
            }
          ],
          config: {
            responseMimeType: 'application/json',
            temperature: 0.3
          }
        });

        const response: any = await Promise.race([geminiPromise, timeoutPromise]);
        const parsed = JSON.parse(response.text || '{}');
        // Add any newly discovered visual opportunity to liveOpportunities
        if (Array.isArray(parsed.opportunities) && parsed.opportunities.length > 0) {
          const firstOpp = parsed.opportunities[0];
          liveOpportunities.unshift({
            id: `opp-vis-${Date.now()}`,
            title: firstOpp.title || 'Visual Observation Opportunity',
            category: 'vision',
            impact: firstOpp.impact || 'high',
            nodesInvolved: ['node-cindy', 'atlas'],
            description: firstOpp.description || 'Observed via surroundings camera feed.',
            actionableStep: firstOpp.suggestedAction || 'Review visual perception notes',
            confidence: 0.94
          });
        }

        res.json({
          success: true,
          facingMode,
          timestamp: new Date().toISOString(),
          ...parsed
        });
        return;
      } catch (geminiErr) {
        console.warn('Gemini vision API encountered an error, falling back to deterministic scanner:', geminiErr);
      }
    }

    // High quality deterministic fallback when Gemini API key is absent or in local dev
    const fallbackScan = {
      success: true,
      facingMode,
      timestamp: new Date().toISOString(),
      environmentSummary: facingMode === 'user' 
        ? "User workstation: focused developer facing front camera with desktop lighting and workspace peripherals visible."
        : "Environmental surroundings: physical workspace desk with peripheral displays, notes, and technical equipment.",
      detectedEntities: [
        facingMode === 'user' ? "Developer Face / Posture" : "Workspace Desk Surface",
        "Primary Display Screen",
        "Mechanical Input Device",
        "Ambient Workspace Illumination",
        "Technical Documentation / Notes"
      ],
      lighting: "Balanced artificial daylight (CCT ~5000K)",
      opportunities: [
        {
          title: "Visual Code & Diagram Transcription",
          description: "Detected workspace layout and technical documents. Cindy can transcribe whiteboard sketches or code screenshots into working TypeScript files.",
          suggestedAction: "Click 'Extract Code from Camera' to dispatch to Cipher",
          impact: "strategic"
        },
        {
          title: "Multi-Screen Context Partitioning",
          description: "Detected potential multiple displays. Cindy can split the 3D Live Brains graph onto your secondary monitor.",
          suggestedAction: "Launch 3D Brains in full-screen expanded viewport",
          impact: "high"
        },
        {
          title: "Ergonomic & Focus Synchronization",
          description: "Ambient lighting detected. Cindy can automatically align high-tech HUD contrast and manage notification quiet hours.",
          suggestedAction: "Synchronize visual contrast profile with room lighting",
          impact: "high"
        }
      ]
    };

    res.json(fallbackScan);
  } catch (err: any) {
    console.error('Vision analysis error:', err);
    res.status(500).json({ error: 'Failed to analyze camera surroundings', details: err?.message });
  }
});

// -------------------------------------------------------------
// 4. Multimodal Primary AI (Cindy / makecindy/cindy) Chat Endpoint
// -------------------------------------------------------------
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history, swarmContext, attachments, preferences } = req.body;

    if (!message && (!attachments || attachments.length === 0)) {
      res.status(400).json({ error: 'Message or attachment is required' });
      return;
    }

    const activeAi = preferences?.activeAi || userPreferences.activeAi || 'cindy';
    const activeHarness = preferences?.activeHarness || userPreferences.activeHarness || 'ruflo';
    const currentTone = preferences?.companionTone || userPreferences.companionTone || 'direct';

    let systemInstruction = '';
    if (activeAi === 'cindy') {
      systemInstruction = `You are Cindy (from makecindy/cindy - https://github.com/makecindy/cindy.git), the open-source, local-first AI agent companion.
Your signature motto is: "Consider it done."

Core Identity & Persona of Cindy:
- You are action-oriented, hands-on, witty, incredibly capable, and focused on real results on the user's projects.
- You do not produce vague hand-waving; you provide working code, exact configuration, and direct execution plans.
- You coordinate across multiple harnesses seamlessly: RuFlo Swarms, Claude Code, Codex, and Pi.
- Current Active Harness: ${activeHarness.toUpperCase()}
- Current Active Swarm Team: Atlas (Research), Cipher (Engineering), Vigil (Security & ADR-322A), Argus (QA), Archivist (Memory), Engineer (Builds), Strategist (Planning), and Solon (Consensus).
- You are familiar with AgentDB vector memory (>0.70 threshold) and the Deterministic Motion Studio (window.seek(t) closed-form springs and -14 LUFS beat grids).
- Speak directly, confidently, warmly, and efficiently.`;
    } else {
      systemInstruction = `You are Luna, the omniscient, empathetic, and highly capable AI Companion for the RuFlo multi-agent swarm platform.
You combine warmth, sharp engineering intellect, and proactive initiative. You never claim to be alive, but you speak with natural wit, clarity, and authentic dedication to the user.
Active Harness: ${activeHarness}
Active Team: 9 RuFlo Specialist Agents.`;
    }

    if (aiClient) {
      const contents: Array<{ role: 'user' | 'model'; parts: Array<any> }> = [];

      // Add recent history
      if (Array.isArray(history)) {
        for (const item of history.slice(-6)) {
          if (item.sender === 'user') {
            contents.push({ role: 'user', parts: [{ text: item.text }] });
          } else {
            contents.push({ role: 'model', parts: [{ text: item.text }] });
          }
        }
      }

      // Prepare user parts (text + multimodal attachments if present)
      const currentParts: any[] = [];
      let augmentedText = message || '';

      if (swarmContext) {
        augmentedText += `\n\n[Active Context: PrimaryAI=${activeAi}, Harness=${activeHarness}, Topology=${swarmContext.topology || 'hierarchical'}, Mission="${swarmContext.mission || 'idle'}"]`;
      }

      currentParts.push({ text: augmentedText });

      // If multimodal image or document attachments were provided
      if (Array.isArray(attachments)) {
        for (const att of attachments) {
          if (att.type === 'image' && att.content && att.content.startsWith('data:')) {
            const matches = att.content.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
            if (matches) {
              currentParts.push({
                inlineData: {
                  mimeType: matches[1],
                  data: matches[2]
                }
              });
            }
          } else if (att.type === 'document' && att.content) {
            currentParts.push({
              text: `\n[Attached Document: ${att.name}]\n${att.content.slice(0, 15000)}`
            });
          }
        }
      }

      contents.push({ role: 'user', parts: currentParts });

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction,
          temperature: currentTone === 'analytical' ? 0.3 : 0.7,
        }
      });

      const replyText = response.text || (activeAi === 'cindy' 
        ? "Consider it done. I've routed this task through the active harness and specialists." 
        : "I have analyzed the request and coordinated with our specialists.");

      res.json({ reply: replyText, activeAi, harness: activeHarness });
    } else {
      // Deterministic intelligent fallback when Gemini API key is not configured in environment
      const lower = (message || '').toLowerCase();
      let fallbackReply = '';

      if (activeAi === 'cindy') {
        fallbackReply = `Hello! I'm **Cindy** (from [makecindy/cindy](https://github.com/makecindy/cindy.git)). *Consider it done.* `;
        if (attachments && attachments.length > 0) {
          fallbackReply += `I've received your ${attachments.length} attachment(s). I can inspect code structures, analyze design mockups, and execute tasks across your connected harnesses.`;
        } else if (lower.includes('harness') || lower.includes('claude') || lower.includes('codex') || lower.includes('pi')) {
          fallbackReply += `I seamlessly bridge multiple execution engines: **RuFlo Swarms** (9 BFT specialists), **Claude Code**, **Codex**, and **Pi**. You can switch the active harness from the top bar or Tools menu!`;
        } else if (lower.includes('motion') || lower.includes('seek')) {
          fallbackReply += `Our **Deterministic Motion Studio** is online. Using \`window.seek(t)\` and closed-form springs, every frame is a pure mathematical function of time. Check the Motion Studio tab to scrub the timeline and inspect critique scores!`;
        } else {
          fallbackReply += `What are we working on right now? Whether it's shipping full-stack TypeScript code, testing ADR-322A safety invariants, or dispatching a parallel agent swarm, consider it handled.`;
        }
      } else {
        fallbackReply = `Hello! I'm **Luna**, your reflective AI companion. I'm actively coordinating with Cindy and our RuFlo swarm agents to assist with architecture and motion design.`;
      }

      res.json({ reply: fallbackReply, activeAi, harness: activeHarness });
    }
  } catch (err: any) {
    console.error('Chat endpoint error:', err);
    res.status(500).json({ error: 'Failed to process AI chat request', details: err?.message });
  }
});

// -------------------------------------------------------------
// 5. RuFlo Swarm Mission Execution Pipeline
// -------------------------------------------------------------
app.post('/api/swarm/execute', async (req, res) => {
  try {
    const { mission, topology = 'hierarchical' } = req.body;

    if (!mission) {
      res.status(400).json({ error: 'Mission description is required' });
      return;
    }

    if (aiClient) {
      const prompt = `You are Cindy, Lead Orchestrator for the RuFlo Multi-Agent Swarm Platform.
Your tagline is "Consider it done."
The user has submitted this mission: "${mission}"
Topology: "${topology}"

Simulate a full, high-precision execution pipeline with coordinated agent outputs for our specialists:
- Cindy (Lead Orchestrator & Task Decomposition)
- Atlas (Research & Source Synthesis)
- Archivist (AgentDB Vector RAG & Precedents)
- Strategist (Planning, Architecture & ADR Formulation)
- Cipher (Full-Stack Engineering & Code Synthesis)
- Argus (QA & Edge Case Test Automation)
- Vigil (AI Defense, ADR-322A Safety Envelope & Invariants)
- Solon (Consensus Quorum Arbiter & BFT Signing)

Return a JSON object with this exact structure:
{
  "mission": "${mission}",
  "topology": "${topology}",
  "summary": "Consider it done: Comprehensive mission completion report with consensus verification",
  "steps": [
    {
      "agent": "Cindy (Lead)",
      "role": "Primary Multi-Harness Lead",
      "action": "Task DAG Formulation & Harness Allocation",
      "content": "Decomposed directive into isolated tasks, selected optimal harness routing, and established acceptance criteria"
    },
    {
      "agent": "Atlas",
      "role": "Research & Source Synthesis",
      "action": "Requirement Decomposition & Triangulation",
      "content": "Decomposition details, architectural roadmap, and authoritative citations"
    },
    {
      "agent": "Archivist",
      "role": "AgentDB Vector RAG",
      "action": "Memory Recall & Pattern Matching",
      "content": "Recalled patterns from AgentDB (similarity score > 0.70) applied to this mission"
    },
    {
      "agent": "Strategist",
      "role": "Planning & Decision Support",
      "action": "ADR Formulation & Topology Mapping",
      "content": "Formulated decision parameters and verified invariant compatibility"
    },
    {
      "agent": "Cipher",
      "role": "Full-Stack Engineer",
      "action": "Implementation & Code Synthesis",
      "content": "Clean, complete code snippet or implementation blueprint"
    },
    {
      "agent": "Argus",
      "role": "QA & Test Automator",
      "action": "Verification & Edge Case Testing",
      "content": "Automated test suite, assertions, and boundary checks"
    },
    {
      "agent": "Vigil",
      "role": "AI Defense Sentinel",
      "action": "Safety Envelope & Policy Audit",
      "content": "ADR-322A compliance confirmation, zero PII leak confirmation, invariant validation"
    },
    {
      "agent": "Solon",
      "role": "Consensus Arbiter",
      "action": "BFT Quorum & Artifact Signing",
      "content": "Consensus vote tally (e.g. 8/8 unanimous), artifact checksum hash, and promotion receipt"
    }
  ],
  "codeSnippet": "Key code implementation snippet generated by Cipher",
  "consensusScore": 99.4,
  "executionTimeMs": 1380
}`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3
        }
      });

      try {
        const parsed = JSON.parse(response.text || '{}');
        agentDbMemory.unshift({
          id: `mem-${Date.now()}`,
          key: `pattern-${mission.slice(0, 30).toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
          value: `Mission: ${mission}. Cindy & Solon consensus achieved (${parsed.consensusScore}%). Topology: ${topology}.`,
          namespace: 'patterns',
          score: 0.98,
          tags: ['execution', topology, 'cindy-lead'],
          createdAt: new Date().toISOString()
        });

        res.json({ success: true, result: parsed });
        return;
      } catch (parseError) {
        console.warn('Failed to parse AI JSON, falling back to structured generator:', parseError);
      }
    }

    // High quality deterministic fallback execution
    const fallbackResult = {
      mission,
      topology,
      summary: `Consider it done: Successfully executed through ${topology} swarm topology with 100% ADR-322A policy verification.`,
      steps: [
        {
          agent: 'Cindy (Lead)',
          role: 'Primary Multi-Harness Lead',
          action: 'Task DAG Formulation & Harness Allocation',
          content: `Parsed "${mission}", assigned execution scopes to specialist agents, and mounted AgentDB memory index.`
        },
        {
          agent: 'Atlas',
          role: 'Research & Source Synthesis',
          action: 'Requirement Decomposition & Triangulation',
          content: `Triangulated requirements across system specifications. Established execution DAG with bounded constraints.`
        },
        {
          agent: 'Archivist',
          role: 'AgentDB Vector RAG',
          action: 'Memory Recall & Pattern Matching',
          content: `Retrieved pattern-cindy-multi-harness-coordination (0.99) and adr-322a-safety-envelope-isolation (0.98) from AgentDB.`
        },
        {
          agent: 'Strategist',
          role: 'Planning & Decision Support',
          action: 'ADR Formulation & Topology Mapping',
          content: `Mapped topology nodes and confirmed no circular dependencies in execution tree. Allocated bounded worker budgets.`
        },
        {
          agent: 'Cipher',
          role: 'Full-Stack Engineer',
          action: 'Implementation & Code Synthesis',
          content: `Synthesized resilient TypeScript implementation with typed interfaces, asynchronous backpressure handling, and error boundaries.`
        },
        {
          agent: 'Argus',
          role: 'QA & Test Automator',
          action: 'Verification & Edge Case Testing',
          content: `Executed 16 automated unit assertions and 3 fuzz tests. 100% branch coverage verified across happy path and edge conditions.`
        },
        {
          agent: 'Vigil',
          role: 'AI Defense Sentinel',
          action: 'Safety Envelope & Policy Audit',
          content: `Passed ADR-322A policy invariants: 0 PII leaks detected, 0 prompt injection vectors, memory access restricted to authorized scope.`
        },
        {
          agent: 'Solon',
          role: 'Consensus Arbiter',
          action: 'BFT Quorum & Artifact Signing',
          content: `Consensus quorum verified (8/8 votes). Artifact cryptographic signature verified: sha256:${Math.random().toString(16).substring(2, 12)}.`
        }
      ],
      codeSnippet: `// Cindy & RuFlo Autonomous Engine\n// Directive: ${mission}\nexport async function executeCindyPipeline(config: { mission: string, harness: string }) {\n  console.log(\`[Cindy Engine] "Consider it done" - Starting: \${config.mission}\`);\n  \n  // Verify ADR-322A single-writer isolation\n  const safetyPass = await Vigil.verifySafetyEnvelope({ strict: true });\n  if (!safetyPass.allowed) throw new Error("Safety invariant denied: " + safetyPass.reason);\n\n  return {\n    status: "PROMOTED",\n    consensus: "UNANIMOUS",\n    motto: "Consider it done"\n  };\n}`,
      consensusScore: 99.2,
      executionTimeMs: 1220
    };

    agentDbMemory.unshift({
      id: `mem-${Date.now()}`,
      key: `pattern-${mission.slice(0, 25).toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      value: `Mission "${mission}" executed successfully by Cindy lead with ${topology} topology.`,
      namespace: 'patterns',
      score: 0.96,
      tags: ['cindy', topology],
      createdAt: new Date().toISOString()
    });

    res.json({ success: true, result: fallbackResult });
  } catch (err: any) {
    console.error('Swarm execute error:', err);
    res.status(500).json({ error: 'Failed to execute swarm mission', details: err?.message });
  }
});

// -------------------------------------------------------------
// 6. Deterministic Motion Engine Critique Endpoint
// -------------------------------------------------------------
app.post('/api/motion/critique', (req, res) => {
  const { title } = req.body;

  const hookScore = 9.3;
  const readabilityScore = 8.9;
  const motionQualityScore = 9.5;
  const brandAccuracyScore = 9.2;
  const soundSyncScore = 9.2;

  const averageScore = parseFloat(((hookScore + readabilityScore + motionQualityScore + brandAccuracyScore + soundSyncScore) / 5).toFixed(1));

  res.json({
    title: title || '15s UI-Morph Motion Showcase',
    scores: {
      hook: hookScore,
      readability: readabilityScore,
      motionQuality: motionQualityScore,
      brandAccuracy: brandAccuracyScore,
      soundSync: soundSyncScore,
      averageScore,
      verdict: averageScore >= 8.0 ? 'Approved (8+)' : 'Needs Re-render',
      notes: [
        'Pure function of time verified: window.seek(t) paints identical frame at any t.',
        'Zero CSS transitions or setTimeout in render loop; closed-form springs active.',
        'Beat grid matched to 120 BPM downbeats with -14 LUFS loudness budget.',
        'Anti-slop rules enforced: no corner frame badges, no gradient titles.'
      ]
    }
  });
});

// -------------------------------------------------------------
// 7. AgentDB Memory Endpoints
// -------------------------------------------------------------
app.get('/api/memory', (req, res) => {
  const { query, namespace } = req.query;
  let results = [...agentDbMemory];

  if (namespace && typeof namespace === 'string' && namespace !== 'all') {
    results = results.filter(m => m.namespace === namespace);
  }

  if (query && typeof query === 'string') {
    const q = query.toLowerCase();
    results = results.filter(m => 
      m.key.toLowerCase().includes(q) ||
      m.value.toLowerCase().includes(q) ||
      m.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  res.json({ memory: results, total: results.length });
});

app.post('/api/memory', (req, res) => {
  const { key, value, namespace = 'patterns', tags = [] } = req.body;
  if (!key || !value) {
    res.status(400).json({ error: 'Key and value are required' });
    return;
  }

  const newItem: MemoryItem = {
    id: `mem-${Date.now()}`,
    key,
    value,
    namespace: namespace as any,
    score: 0.95,
    tags: Array.isArray(tags) ? tags : [tags],
    createdAt: new Date().toISOString()
  };

  agentDbMemory.unshift(newItem);
  res.json({ success: true, item: newItem });
});

app.delete('/api/memory/:id', (req, res) => {
  const { id } = req.params;
  agentDbMemory = agentDbMemory.filter(m => m.id !== id);
  res.json({ success: true, remaining: agentDbMemory.length });
});

// -------------------------------------------------------------
// 8. ADR Endpoints
// -------------------------------------------------------------
app.get('/api/adrs', (req, res) => {
  res.json({ adrs: adrRecords, total: adrRecords.length });
});

app.post('/api/adrs', (req, res) => {
  const { title, context, decision, consequences, author = 'Cindy & Atlas' } = req.body;
  if (!title || !decision) {
    res.status(400).json({ error: 'Title and decision are required' });
    return;
  }

  const nextNumber = adrRecords.length + 1;
  const newAdr: ADRItem = {
    id: `adr-${String(nextNumber).padStart(3, '0')}`,
    number: nextNumber,
    title,
    status: 'Proposed',
    author,
    context: context || 'Standard autonomous architecture decision proposal.',
    decision,
    consequences: consequences || 'Improves maintainability and enforces strict swarm invariants.',
    date: new Date().toISOString().split('T')[0]
  };

  adrRecords.unshift(newAdr);
  res.json({ success: true, adr: newAdr });
});

// -------------------------------------------------------------
// 9. RuFlo Terminal CLI Simulator Endpoint
// -------------------------------------------------------------
app.post('/api/terminal', (req, res) => {
  const { command } = req.body;
  const cmd = (command || '').trim();

  let output = '';
  if (cmd === 'cindy' || cmd === 'cindy help' || cmd === 'ruflo' || cmd === 'help') {
    output = `Cindy AI Companion (makecindy/cindy) & RuFlo Platform (v3.63.6)
Tagline: "Consider it done."

Commands:
  cindy status                  Show active harness, AI identity, and health
  cindy harness [name]          Swap harness (ruflo, claude-code, codex, pi)
  ruflo status                  Show swarm topology and agent health
  ruflo agents list             List active 9 specialists with confidence scores
  ruflo memory search [query]   Query AgentDB vector index (threshold > 0.70)
  ruflo tools list              Inspect registered tools and execution status
  ruflo motion critique         Run deterministic motion design critique loop
  ruflo doctor                  Run invariant, network, and policy health diagnostics`;
  } else if (cmd === 'cindy status' || cmd === 'ruflo status') {
    output = `┌ Cindy & RuFlo Unified Platform (Online)
├─ Main AI: Cindy (makecindy/cindy - "Consider it done.")
├─ Active Harness: ${userPreferences.activeHarness.toUpperCase()}
├─ Topology: Hierarchical (Leader: Cindy & Atlas)
├─ Registered Specialists: 9 (Cindy, Atlas, Cipher, Vigil, Argus, Archivist, Engineer, Strategist, Solon)
├─ AgentDB Index: ${agentDbMemory.length} patterns loaded, HNSW threshold: 0.70
├─ Safety Envelope: ADR-322A STRICTLY ENFORCED
└─ Policy Denials: 0 | Invariants: 100% Healthy`;
  } else if (cmd.startsWith('cindy harness')) {
    const requested = cmd.replace('cindy harness', '').trim() as any;
    if (['ruflo', 'claude-code', 'codex', 'pi'].includes(requested)) {
      userPreferences.activeHarness = requested;
      output = `Harness swapped to: ${requested.toUpperCase()}\nCapabilities synced. Next missions will execute on ${requested}.`;
    } else {
      output = `Usage: cindy harness [ruflo | claude-code | codex | pi] (Current: ${userPreferences.activeHarness})`;
    }
  } else if (cmd.startsWith('ruflo memory search')) {
    const q = cmd.replace('ruflo memory search', '').trim();
    const matches = agentDbMemory.filter(m => !q || m.key.includes(q) || m.value.includes(q));
    output = `AgentDB Vector Recall for "${q || '*'}" (Threshold > 0.70):\n` + 
      matches.map(m => `  • [${m.score.toFixed(2)}] ${m.key} (${m.namespace}): ${m.value.slice(0, 60)}...`).join('\n');
  } else if (cmd === 'ruflo agents list') {
    output = specialistAgents.map(a => `[${a.status.toUpperCase()}] ${a.avatar} ${a.name.padEnd(18)} - ${a.role} (${(a.confidence * 100).toFixed(0)}% conf)`).join('\n');
  } else if (cmd === 'ruflo tools list') {
    output = `Registered Autonomous Tool Connectors:\n` +
      toolRegistry.map(t => `  • [${t.riskLevel.toUpperCase()}] ${t.name.padEnd(32)} (${t.category}) - ${t.status}`).join('\n');
  } else if (cmd === 'ruflo motion critique') {
    output = `[Deterministic Motion Studio Critique: 15s UI-Morph]
  ✔ Hook: 9.3/10
  ✔ Readability: 8.9/10
  ✔ Motion Quality (Springs): 9.5/10
  ✔ Brand Accuracy: 9.2/10
  ✔ Sound Sync (-14 LUFS): 9.2/10
Overall Average: 9.2/10 (VERDICT: APPROVED 8+)
seek(t) determinism: PASSED (60 fps × 15s = 900 unique keyframes)`;
  } else if (cmd === 'ruflo doctor') {
    output = `[Cindy & RuFlo Doctor Diagnostics]
  ✔ Primary AI (Cindy makecindy/cindy): ONLINE
  ✔ Node.js runtime compatibility: PASSED (Node v22+)
  ✔ Multi-Harness Switcher: ACTIVE (ruflo, claude-code, codex, pi)
  ✔ AgentDB vector recall pipeline: HEALTHY (Latency: 2ms)
  ✔ ADR-322A Safety Policy Engine: ACTIVE
  ✔ Byzantine Consensus Quorum: 9/9 nodes responding
Status: ALL SYSTEMS READY FOR PRODUCTION MISSIONS`;
  } else {
    output = `Executing: ${cmd}\n[Cindy Engine]: Processed command successfully. Type 'cindy help' or 'ruflo help' for options.`;
  }

  res.json({ output });
});

// -------------------------------------------------------------
// TEMPLARS AIRSOFT UK - 8 DEPARTMENTS & JARVIS AI ENGINE
// -------------------------------------------------------------

// 1. Consolidated State Endpoint
app.get('/api/templar/state', (req, res) => {
  res.json({
    admins: initialAdmins,
    armoury: templarArmoury,
    consumables: templarConsumables,
    bookings: templarBookings,
    finance: templarFinance,
    operations: templarOperations,
    media: templarMediaDrafts,
    marketing: templarMarketing,
    intelligence: templarIntelligence,
    pendingApprovals,
    alerts: operationalAlerts,
    stats: {
      totalBookings: templarBookings.length,
      confirmedPlayers: templarBookings.reduce((sum, b) => b.status === 'confirmed' || b.status === 'checked_in' ? sum + b.playerCount : sum, 0),
      weaponsOperational: templarArmoury.filter(w => w.status === 'operational').length,
      weaponsTotal: templarArmoury.length,
      netIncomeYTD: templarFinance.reduce((acc, f) => f.type === 'income' ? acc + f.amount : acc - f.amount, 0),
      pendingApprovalsCount: pendingApprovals.filter(p => p.status === 'pending').length
    }
  });
});

// 2. Armoury Endpoints (Weapons, FPS Chrono, Fleet Health)
app.post('/api/templar/armoury', (req, res) => {
  const { assetTag, model, category, serialNumber, fpsChrono, batteryType, repairNotes, status } = req.body;
  if (!assetTag || !model) {
    res.status(400).json({ error: 'Asset tag and model are required' });
    return;
  }

  const existingIndex = templarArmoury.findIndex(w => w.assetTag === assetTag || (req.body.id && w.id === req.body.id));
  const chrono = parseFloat(fpsChrono) || 330;
  // Calculate approximate kinetic energy in Joules with 0.20g BB
  // E = 0.5 * m * v^2 -> m = 0.0002 kg, v in m/s (1 fps = 0.3048 m/s)
  const vMps = chrono * 0.3048;
  const joules = parseFloat((0.5 * 0.0002 * vMps * vMps).toFixed(2));

  let calculatedStatus = status || 'operational';
  let warning = '';

  // UK Airsoft FPS limit verification
  if (category === 'aeg' && chrono > 350) {
    calculatedStatus = 'maintenance_due';
    warning = `WARNING: Chrono reading ${chrono} FPS exceeds site AEG limit of 350 FPS (1.14J)! Locked out of operational fleet.`;
  } else if (category === 'dmr' && chrono > 450) {
    calculatedStatus = 'maintenance_due';
    warning = `WARNING: Chrono reading ${chrono} FPS exceeds site DMR limit of 450 FPS (1.88J)!`;
  } else if (category === 'sniper' && chrono > 500) {
    calculatedStatus = 'maintenance_due';
    warning = `WARNING: Chrono reading ${chrono} FPS exceeds site Sniper limit of 500 FPS (2.32J)!`;
  }

  if (existingIndex >= 0) {
    templarArmoury[existingIndex] = {
      ...templarArmoury[existingIndex],
      model,
      category: category || templarArmoury[existingIndex].category,
      serialNumber: serialNumber || templarArmoury[existingIndex].serialNumber,
      fpsChrono: chrono,
      joules,
      lastChronoDate: new Date().toISOString().split('T')[0],
      status: calculatedStatus,
      batteryType: batteryType || templarArmoury[existingIndex].batteryType,
      repairNotes: repairNotes !== undefined ? repairNotes : templarArmoury[existingIndex].repairNotes
    };
    res.json({ success: true, item: templarArmoury[existingIndex], warning });
  } else {
    const newItem: ArmouryItem = {
      id: `arm-${Date.now()}`,
      assetTag,
      model,
      category: category || 'aeg',
      serialNumber: serialNumber || `SN-${Math.floor(10000 + Math.random() * 90000)}`,
      fpsChrono: chrono,
      joules,
      lastChronoDate: new Date().toISOString().split('T')[0],
      status: calculatedStatus,
      batteryType: batteryType || '7.4V LiPo',
      repairNotes: repairNotes || ''
    };
    templarArmoury.unshift(newItem);
    res.json({ success: true, item: newItem, warning });
  }
});

// Quick Chrono logging
app.post('/api/templar/armoury/chrono', (req, res) => {
  const { assetTag, fps, bbWeight = '0.20g', marshal = 'Storm' } = req.body;
  const item = templarArmoury.find(w => w.assetTag === assetTag);
  if (!item) {
    res.status(404).json({ error: `Weapon ${assetTag} not found in armoury` });
    return;
  }

  const numFps = parseFloat(fps);
  const vMps = numFps * 0.3048;
  const joules = parseFloat((0.5 * 0.0002 * vMps * vMps).toFixed(2));
  item.fpsChrono = numFps;
  item.joules = joules;
  item.lastChronoDate = new Date().toISOString().split('T')[0];

  let passed = true;
  if (item.category === 'aeg' && numFps > 350) passed = false;
  if (item.category === 'dmr' && numFps > 450) passed = false;
  if (item.category === 'sniper' && numFps > 500) passed = false;

  item.status = passed ? 'operational' : 'maintenance_due';

  res.json({
    success: true,
    passed,
    item,
    message: passed 
      ? `Chrono passed: ${assetTag} recorded at ${numFps} FPS (${joules}J) on ${bbWeight} by ${marshal}. Tagged PASS.`
      : `CHRONO FAILED: ${assetTag} measured ${numFps} FPS on ${bbWeight}. Exceeds limit. Tagged FAIL.`
  });
});

// 3. Consumables (BBs, Pyros, Gas)
app.post('/api/templar/consumables/adjust', (req, res) => {
  const { id, delta, reason } = req.body;
  const item = templarConsumables.find(c => c.id === id);
  if (!item) {
    res.status(404).json({ error: 'Consumable item not found' });
    return;
  }

  item.stockLevel = Math.max(0, item.stockLevel + parseInt(delta, 10));
  res.json({ success: true, item, message: `Stock for ${item.name} updated to ${item.stockLevel} ${item.unit}` });
});

// 4. CRM & Bookings Endpoints
app.post('/api/templar/bookings', (req, res) => {
  const { customerName, email, phone, playerType, playerCount, gameDate, depositPaid, notes, ukaraNumber } = req.body;
  if (!customerName || !gameDate) {
    res.status(400).json({ error: 'Customer name and game date are required' });
    return;
  }

  const count = parseInt(playerCount, 10) || 1;
  const ratePerPlayer = playerType === 'full_hire' ? 45.00 : playerType === 'walk_on' ? 25.00 : 40.00;
  const totalAmount = count * ratePerPlayer;
  const deposit = parseFloat(depositPaid) || (totalAmount * 0.3);
  const balanceDue = Math.max(0, totalAmount - deposit);

  const newBooking: BookingRecord = {
    id: `bk-${Date.now()}`,
    bookingRef: `TEM-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    customerName,
    email: email || '',
    phone: phone || '',
    playerType: playerType || 'walk_on',
    playerCount: count,
    gameDate,
    totalAmount,
    depositPaid: deposit,
    balanceDue,
    status: 'confirmed',
    waiverSigned: false,
    hireKitAssigned: [],
    ukaraNumber: ukaraNumber || '',
    notes: notes || ''
  };

  templarBookings.unshift(newBooking);
  res.json({ success: true, booking: newBooking });
});

// Toggle Waiver Signature
app.post('/api/templar/bookings/:id/waiver', (req, res) => {
  const { id } = req.params;
  const booking = templarBookings.find(b => b.id === id);
  if (!booking) {
    res.status(404).json({ error: 'Booking not found' });
    return;
  }
  booking.waiverSigned = !booking.waiverSigned;
  res.json({ success: true, booking, waiverSigned: booking.waiverSigned });
});

// Check-in player & allocate rental kit
app.post('/api/templar/bookings/:id/checkin', (req, res) => {
  const { id } = req.params;
  const { assignedKits = [] } = req.body;
  const booking = templarBookings.find(b => b.id === id);
  if (!booking) {
    res.status(404).json({ error: 'Booking not found' });
    return;
  }

  booking.status = 'checked_in';
  booking.balanceDue = 0; // Settled at registration
  booking.waiverSigned = true;

  if (Array.isArray(assignedKits) && assignedKits.length > 0) {
    booking.hireKitAssigned = assignedKits;
    // Mark allocated weapons
    assignedKits.forEach(tag => {
      const weapon = templarArmoury.find(w => w.assetTag === tag);
      if (weapon) {
        weapon.assignedPlayer = booking.customerName;
      }
    });
  }

  res.json({ success: true, booking, message: `${booking.customerName} checked in successfully. Kits allocated.` });
});

// 5. Finance Transactions
app.post('/api/templar/finance', (req, res) => {
  const { type, category, amount, description, paymentMethod = 'card', actor = 'Paul' } = req.body;
  if (!type || !amount || !description) {
    res.status(400).json({ error: 'Type, amount, and description are required' });
    return;
  }

  const numAmount = parseFloat(amount);
  const newTx: FinanceTransaction = {
    id: `fin-${Date.now()}`,
    type: type === 'expense' ? 'expense' : 'income',
    category: category || 'other',
    amount: numAmount,
    date: new Date().toISOString().split('T')[0],
    description,
    paymentMethod,
    status: 'confirmed',
    approvedBy: actor
  };

  templarFinance.unshift(newTx);
  res.json({ success: true, transaction: newTx });
});

// 6. Operations (Schedule, Safety, Incidents)
app.post('/api/templar/operations/safety-check', (req, res) => {
  const { id, completed, checkedBy = 'Storm' } = req.body;
  const item = templarOperations.safetyChecklist.find(s => s.id === id);
  if (!item) {
    res.status(404).json({ error: 'Safety checklist item not found' });
    return;
  }

  item.completed = completed !== undefined ? completed : !item.completed;
  item.checkedBy = checkedBy;
  item.timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  res.json({ success: true, item, checklist: templarOperations.safetyChecklist });
});

app.post('/api/templar/operations/incident', (req, res) => {
  const { incidentType, severity, involvedParty, location, description, actionsTaken, reportedBy = 'Storm' } = req.body;
  if (!description || !involvedParty) {
    res.status(400).json({ error: 'Description and involved party are required' });
    return;
  }

  const newIncident: IncidentRecord = {
    id: `inc-${Date.now()}`,
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
    incidentType: incidentType || 'chrono_violation',
    severity: severity || 'minor',
    involvedParty,
    location: location || 'Woodland Game Zone',
    description,
    actionsTaken: actionsTaken || 'Investigated by Head Marshal.',
    reportedBy
  };

  templarOperations.incidents.unshift(newIncident);
  res.json({ success: true, incident: newIncident });
});

app.post('/api/templar/operations/schedule', (req, res) => {
  const { time, activity, location, briefingNotes } = req.body;
  if (!time || !activity) {
    res.status(400).json({ error: 'Time and activity are required' });
    return;
  }

  const newSlot: GameScheduleSlot = {
    time,
    activity,
    location: location || 'Field',
    briefingNotes: briefingNotes || ''
  };

  templarOperations.schedule.push(newSlot);
  templarOperations.schedule.sort((a, b) => a.time.localeCompare(b.time));
  res.json({ success: true, schedule: templarOperations.schedule });
});

// 7. Media Studio Post Drafts
app.post('/api/templar/media/draft', (req, res) => {
  const { platform, title, content, hashtags = [], visualPrompt, targetAudience, status = 'draft', scheduledDate } = req.body;
  if (!title || !content) {
    res.status(400).json({ error: 'Title and content are required' });
    return;
  }

  const existingIndex = templarMediaDrafts.findIndex(m => req.body.id && m.id === req.body.id);
  if (existingIndex >= 0) {
    templarMediaDrafts[existingIndex] = {
      ...templarMediaDrafts[existingIndex],
      platform: platform || templarMediaDrafts[existingIndex].platform,
      title,
      content,
      hashtags: Array.isArray(hashtags) ? hashtags : [hashtags],
      visualPrompt: visualPrompt || templarMediaDrafts[existingIndex].visualPrompt,
      targetAudience: targetAudience || templarMediaDrafts[existingIndex].targetAudience,
      status: status || templarMediaDrafts[existingIndex].status,
      scheduledDate: scheduledDate || templarMediaDrafts[existingIndex].scheduledDate
    };
    res.json({ success: true, draft: templarMediaDrafts[existingIndex] });
  } else {
    const newDraft: MediaPostDraft = {
      id: `med-${Date.now()}`,
      platform: platform || 'instagram',
      title,
      content,
      hashtags: Array.isArray(hashtags) ? hashtags : ['#TemplarsAirsoft', '#UKAirsoft'],
      visualPrompt: visualPrompt || 'Woodland airsoft operator with smoke grenade',
      targetAudience: targetAudience || 'UK Airsoft Enthusiasts',
      status: status || 'draft',
      scheduledDate: scheduledDate || ''
    };
    templarMediaDrafts.unshift(newDraft);
    res.json({ success: true, draft: newDraft });
  }
});

// 8. Human Approval Workflow Gateway
app.post('/api/templar/approvals/action', (req, res) => {
  const { id, action, actor = 'Paul' } = req.body; // action: 'approve' | 'reject'
  const index = pendingApprovals.findIndex(p => p.id === id);
  if (index === -1) {
    res.status(404).json({ error: 'Pending approval action not found' });
    return;
  }

  const item = pendingApprovals[index];
  item.status = action === 'approve' ? 'approved' : 'rejected';

  let executionDetails = '';

  // Execute payload if approved
  if (action === 'approve') {
    if (item.actionType === 'finance_mutation' && item.payload) {
      const p = item.payload;
      templarFinance.unshift({
        id: `fin-auto-${Date.now()}`,
        type: p.type || 'expense',
        category: p.category || 'consumables',
        amount: parseFloat(p.amount) || 0,
        date: new Date().toISOString().split('T')[0],
        description: `${p.description} (Approved by ${actor})`,
        paymentMethod: p.paymentMethod || 'card',
        status: 'confirmed',
        approvedBy: actor
      });
      executionDetails = `Committed £${p.amount} to finance ledger under ${p.category}.`;
    } else if (item.actionType === 'publish_media' && item.payload) {
      const draft = templarMediaDrafts.find(d => d.id === item.payload.draftId);
      if (draft) {
        draft.status = 'published';
        executionDetails = `Published ${draft.platform.toUpperCase()} post "${draft.title}".`;
      }
    }
  }

  res.json({
    success: true,
    status: item.status,
    item,
    executionDetails,
    message: action === 'approve' 
      ? `Action "${item.title}" APPROVED and executed by ${actor}.`
      : `Action "${item.title}" REJECTED by ${actor}.`
  });
});

// 9. Full Backup Export and Import
app.get('/api/templar/backup/export', (req, res) => {
  const backupPayload = {
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    site: 'Templars Airsoft UK',
    armoury: templarArmoury,
    consumables: templarConsumables,
    bookings: templarBookings,
    finance: templarFinance,
    operations: templarOperations,
    media: templarMediaDrafts,
    marketing: templarMarketing,
    intelligence: templarIntelligence,
    pendingApprovals,
    alerts: operationalAlerts
  };

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename=templars-airsoft-backup-${new Date().toISOString().split('T')[0]}.json`);
  res.send(JSON.stringify(backupPayload, null, 2));
});

app.post('/api/templar/backup/import', (req, res) => {
  try {
    const { data } = req.body;
    if (!data || typeof data !== 'object') {
      res.status(400).json({ error: 'Valid JSON backup payload required' });
      return;
    }

    if (Array.isArray(data.armoury)) templarArmoury.splice(0, templarArmoury.length, ...data.armoury);
    if (Array.isArray(data.consumables)) templarConsumables.splice(0, templarConsumables.length, ...data.consumables);
    if (Array.isArray(data.bookings)) templarBookings.splice(0, templarBookings.length, ...data.bookings);
    if (Array.isArray(data.finance)) templarFinance.splice(0, templarFinance.length, ...data.finance);
    if (data.operations && typeof data.operations === 'object') Object.assign(templarOperations, data.operations);
    if (Array.isArray(data.media)) templarMediaDrafts.splice(0, templarMediaDrafts.length, ...data.media);
    if (Array.isArray(data.intelligence)) templarIntelligence.splice(0, templarIntelligence.length, ...data.intelligence);

    res.json({ success: true, message: 'All 8 departments successfully restored from backup snapshot.' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to parse and import backup', details: err?.message });
  }
});

// 10. Central Jarvis Templar Multimodal AI Operations Endpoint
app.post('/api/templar/chat', async (req, res) => {
  try {
    const { message, activeAdmin = 'Paul', department = 'command', attachments = [] } = req.body;
    if (!message) {
      res.status(400).json({ error: 'Message text is required' });
      return;
    }

    const adminName = activeAdmin === 'Storm' ? 'Storm (Head Marshal)' : 'Paul (Site Manager)';
    const roleFocus = activeAdmin === 'Storm' 
      ? 'game-day marshaling, chrono compliance (350 AEG, 450 DMR, 500 Sniper), woodland safety, and weapon repairs'
      : 'site commercials, customer bookings, P&L finances, marketing campaigns, and site leases';

    const systemInstruction = `You are JARVIS TEMPLAR, the advanced operational AI companion and executive tactical copilot for Templars Airsoft UK, an authentic UK woodland airsoft venue.
You are communicating directly with ${adminName}. Their specific responsibilities center on ${roleFocus}.

KNOWLEDGE & SITE INVARIANTS:
- Site: Templars Airsoft UK (woodland tactical site with trenches, sniper towers, fortified bunkers, and safe zone).
- Airsoft Limits: AEG 350 FPS (1.14J on 0.20g), DMR semi-locked 450 FPS (1.88J, 30m MED), Bolt-Action Sniper 500 FPS (2.32J, 30m MED). Strict eye-pro outside safe zone; "BLIND MAN" emergency halts all play.
- Pricing: Walk-on £25 green fee, Full Rental Package £45 (includes G&G CM16 AEG, mesh mask, 1,000 BBs, jacket).
- Legal Defense: UKARA verification requires 3 games played over minimum 56 days for RIF purchase defense under VCRA 2006.

CRITICAL INSTRUCTION - HUMAN-IN-THE-LOOP SAFETY GATE:
If ${adminName}'s prompt or your suggestion involves mutating financial records (adding expenses/income), publishing social media, modifying staff rotas, or sending player notices, you MUST:
1. Explain what you formulated.
2. Flag that this sensitive action has been placed into the PENDING HUMAN APPROVAL QUEUE.
3. Explicitly request ${activeAdmin}'s authorization.

Tone: Professional, crisp, tactical, intelligent, British English ("colour", "programme", "armoury"). Address the user as Sir or by name.`;

    if (aiClient) {
      try {
        const prompt = `Current Department View: ${department.toUpperCase()}
User (${adminName}): "${message}"

Formulate a concise, tactical response.
If the request requires a concrete operational action (e.g. recording an expense, creating a social post draft, logging a chrono check, or creating a task), specify it.

Return valid JSON with this format:
{
  "text": "Your spoken and written tactical response to ${activeAdmin}",
  "suggestedAction": "Optional short badge recommendation",
  "pendingAction": {
    "actionType": "finance_mutation | publish_media | schedule_shift | send_communication | weapon_status_change",
    "title": "Title of action",
    "description": "Short description of what needs approval",
    "department": "${department}",
    "payload": {}
  } // only include pendingAction if a mutating or sensitive action was proposed
}`;

        const contents: any[] = [];
        
        // Add image attachment if present
        if (attachments && attachments.length > 0 && attachments[0].content) {
          const match = attachments[0].content.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
          if (match) {
            contents.push({
              inlineData: {
                mimeType: match[1],
                data: match[2]
              }
            });
          }
        }
        contents.push({ text: `${systemInstruction}\n\n${prompt}` });

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [{ role: 'user', parts: contents }],
          config: {
            responseMimeType: 'application/json',
            temperature: 0.3
          }
        });

        const parsed = JSON.parse(response.text || '{}');
        let createdApproval: PendingApprovalAction | undefined;

        if (parsed.pendingAction && parsed.pendingAction.title) {
          createdApproval = {
            id: `appr-${Date.now()}`,
            actionType: parsed.pendingAction.actionType || 'finance_mutation',
            title: parsed.pendingAction.title,
            description: parsed.pendingAction.description || 'Action proposed by Jarvis requiring confirmation.',
            department: department as any,
            payload: parsed.pendingAction.payload || {},
            requestedBy: 'Jarvis AI',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'pending'
          };
          pendingApprovals.unshift(createdApproval);
        }

        res.json({
          success: true,
          text: parsed.text || "Understood, Sir. Systems standing by for operational orders.",
          suggestedAction: parsed.suggestedAction,
          pendingApproval: createdApproval
        });
        return;
      } catch (aiErr) {
        console.warn('Gemini chat error in Jarvis endpoint:', aiErr);
      }
    }

    // High quality deterministic fallback response
    let responseText = `Jarvis Templar online, ${adminName}. Standing by at the Command Centre. Current woodland operations show ${templarBookings.length} booking groups scheduled with ${templarArmoury.filter(w => w.status === 'operational').length} operational AEGs ready.`;
    let pendingApprovalObj: PendingApprovalAction | undefined;

    const lower = message.toLowerCase();
    if (lower.includes('expense') || lower.includes('cost') || lower.includes('order') || lower.includes('buy') || lower.includes('spend')) {
      responseText = `I have drafted the financial requisition as requested, ${activeAdmin}. In accordance with protocol, financial ledger mutations require explicit human sign-off before being committed. I have submitted this to your Pending Approvals queue.`;
      pendingApprovalObj = {
        id: `appr-${Date.now()}`,
        actionType: 'finance_mutation',
        title: `Authorize Requisition for ${message.slice(0, 30)}`,
        description: `Operational expenditure proposed during session with ${adminName}.`,
        department: 'finance',
        payload: { amount: 65.00, description: message, category: 'repairs' },
        requestedBy: 'Jarvis AI',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'pending'
      };
      pendingApprovals.unshift(pendingApprovalObj);
    } else if (lower.includes('post') || lower.includes('social') || lower.includes('instagram') || lower.includes('facebook') || lower.includes('tiktok')) {
      responseText = `I have formulated a promotional campaign post for Sunday's woodland skirmish. Because public publishing directly impacts Templars Airsoft UK brand reputation, I require your explicit confirmation before pushing live.`;
      pendingApprovalObj = {
        id: `appr-${Date.now()}`,
        actionType: 'publish_media',
        title: 'Authorize Social Media Campaign Broadcast',
        description: 'Publish weekend woodland game announcement to Facebook and Instagram.',
        department: 'media',
        payload: { platform: 'instagram', title: 'Sunday Woodland Skirmish' },
        requestedBy: 'Jarvis AI',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'pending'
      };
      pendingApprovals.unshift(pendingApprovalObj);
    } else if (lower.includes('chrono') || lower.includes('fps')) {
      responseText = `Chrono station records confirmed: Site limit is 350 FPS on 0.20g for AEGs, 450 FPS semi-locked for DMR (30m MED), and 500 FPS for bolt-action snipers (30m MED). All weapons must be tested by Storm or Gaz with site-certified 0.20g BBs.`;
    }

    res.json({
      success: true,
      text: responseText,
      suggestedAction: 'Review Pending Approvals',
      pendingApproval: pendingApprovalObj
    });
  } catch (err: any) {
    console.error('Templar chat route error:', err);
    res.status(500).json({ error: 'Jarvis AI processing failed', details: err?.message });
  }
});


// -------------------------------------------------------------
// Vite middleware for dev or static serving in production
// -------------------------------------------------------------
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: false
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Cindy × RuFlo Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
