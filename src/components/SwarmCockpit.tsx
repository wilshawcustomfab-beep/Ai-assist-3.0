import React, { useState } from 'react';
import { 
  Play, 
  RotateCw, 
  CheckCircle2, 
  ShieldCheck, 
  Cpu, 
  Code, 
  Layers, 
  Brain, 
  Copy, 
  Check, 
  Clock, 
  Sparkles,
  Award,
  ArrowRight
} from 'lucide-react';
import { Agent, SwarmTopology, SwarmMissionResult } from '../types';

interface SwarmCockpitProps {
  topology: SwarmTopology;
  setTopology: (top: SwarmTopology) => void;
  onOpenLuna: () => void;
  presetMission?: string;
}

const specialistRoster: Agent[] = [
  { id: 'luna-coord', name: 'Luna Coordinator', role: 'Omniscient Dispatcher & User Liaison', avatar: '✨', status: 'ready', specialty: 'Intent parsing, conversational empathy, task DAG planning & result cohesion', confidence: 0.99 },
  { id: 'atlas', name: 'Atlas', role: 'Research & Source Synthesis', avatar: '🏛️', status: 'ready', specialty: 'Authoritative data retrieval, multi-source triangulation & architecture roadmaps', confidence: 0.98 },
  { id: 'cipher', name: 'Cipher', role: 'Autonomous Full-Stack Engineer', avatar: '⚡', status: 'ready', specialty: 'TypeScript, React, Node.js, microservices & code review', confidence: 0.96 },
  { id: 'vigil', name: 'Vigil', role: 'AI Defense & ADR-322A Sentinel', avatar: '🛡️', status: 'ready', specialty: 'PII detection, prompt injection mitigation & strict execution bounds', confidence: 0.99 },
  { id: 'argus', name: 'Argus', role: 'QA & Verification Automator', avatar: '🔬', status: 'ready', specialty: 'Property-based tests, boundary checks, fuzzing & regression coverage', confidence: 0.95 },
  { id: 'archivist', name: 'Archivist', role: 'Memory & Knowledge Graph Indexer', avatar: '📚', status: 'ready', specialty: 'AgentDB vector recall, semantic ontology & entity relationship mapping', confidence: 0.97 },
  { id: 'engineer', name: 'Engineer', role: 'Implementation & Build Diagnostics', avatar: '⚙️', status: 'ready', specialty: 'Zero-regression refactoring, package hygiene & runtime debugging', confidence: 0.96 },
  { id: 'strategist', name: 'Strategist', role: 'Planning & Decision Support', avatar: '🧭', status: 'ready', specialty: 'Cost/benefit analysis, invariant proofs & ADR justification', confidence: 0.97 },
  { id: 'solon', name: 'Solon', role: 'Consensus & Invariant Arbiter', avatar: '⚖️', status: 'ready', specialty: 'Byzantine fault-tolerant voting, invariant proofs & release signing', confidence: 0.98 }
];

export const SwarmCockpit: React.FC<SwarmCockpitProps> = ({
  topology,
  setTopology,
  onOpenLuna,
  presetMission
}) => {
  const [missionInput, setMissionInput] = useState(
    presetMission || 'Build a resilient distributed cache layer with circuit breaker, rate limiting, and automated benchmark verification.'
  );
  const [isRunning, setIsRunning] = useState(false);
  const [agents, setAgents] = useState<Agent[]>(specialistRoster);
  const [lastResult, setLastResult] = useState<SwarmMissionResult | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const presetMissions = [
    "Build a distributed cache layer with circuit breaker & Prometheus metrics",
    "Implement OAuth2 PKCE Authentication with ADR-322A security policy audit",
    "Refactor legacy REST endpoint into high-speed gRPC streaming service",
    "Deploy AgentDB vector memory search with HNSW threshold filtering (>0.70)"
  ];

  const handleRunMission = async (taskText?: string) => {
    const task = taskText || missionInput.trim();
    if (!task || isRunning) return;

    setIsRunning(true);
    setAgents(prev => prev.map(a => ({ ...a, status: 'working' })));

    try {
      const response = await fetch('/api/swarm/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mission: task, topology })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      if (data.result) {
        setLastResult(data.result);
      }
    } catch (err) {
      console.error('Mission execution error:', err);
    } finally {
      setIsRunning(false);
      setAgents(prev => prev.map(a => ({ ...a, status: 'ready' })));
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Mission Control Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">RuFlo Swarm Mission Dispatcher</h2>
              <span className="text-xs text-cyan-400 font-mono">9 SPECIALISTS ACTIVE</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Specify your engineering directive. Luna Coordinator assembles the execution DAG, Archivist pulls AgentDB patterns, and Solon verifies Byzantine consensus.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 font-mono">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              Topology: <strong className="text-slate-200 capitalize">{topology}</strong>
            </span>
            <span className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 font-mono">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              Active Nodes: <strong className="text-slate-200">9/9</strong>
            </span>
          </div>
        </div>

        {/* Input Box */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={missionInput}
              onChange={(e) => setMissionInput(e.target.value)}
              placeholder="e.g. Build an autonomous token bucket rate-limiter with Redis backplane and failover"
              disabled={isRunning}
              className="flex-1 bg-slate-950 border border-slate-700/80 rounded-lg px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-sans"
            />
            <button
              onClick={() => handleRunMission()}
              disabled={isRunning || !missionInput.trim()}
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-cyan-950/40 transition-all cursor-pointer"
            >
              {isRunning ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>Executing Swarm...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Execute Mission</span>
                </>
              )}
            </button>
          </div>

          {/* Presets */}
          <div className="flex items-center gap-2 flex-wrap text-xs pt-1">
            <span className="text-slate-500 font-medium">Presets:</span>
            {presetMissions.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setMissionInput(preset);
                  handleRunMission(preset);
                }}
                disabled={isRunning}
                className="text-slate-400 hover:text-cyan-300 hover:bg-slate-800 px-2.5 py-1 rounded-md border border-slate-800 hover:border-cyan-800/60 transition-colors text-left"
              >
                {preset.length > 40 ? preset.slice(0, 40) + '...' : preset}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Swarm Specialists Roster Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <span>Specialized Swarm Agents</span>
            <span className="text-slate-600">·</span>
            <span className="text-cyan-400">9 Registered Roles</span>
          </div>
          <button
            onClick={onOpenLuna}
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Consult Luna for Task Allocation</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {agents.map((agent) => {
            const isWorking = isRunning;
            return (
              <div
                key={agent.id}
                className={`p-4 rounded-xl border transition-all ${
                  isWorking
                    ? 'bg-slate-900/90 border-cyan-500/40 shadow-md shadow-cyan-950/20'
                    : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-lg">
                      {agent.avatar}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">{agent.name}</h4>
                      <p className="text-[11px] text-slate-400">{agent.role}</p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                      isWorking
                        ? 'bg-cyan-950/80 text-cyan-300 border-cyan-700/60 animate-pulse'
                        : 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40'
                    }`}
                  >
                    {isWorking ? 'PROCESSING' : 'ACTIVE'}
                  </span>
                </div>

                <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {agent.specialty}
                </p>

                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Confidence: <strong className="text-slate-300 font-mono">{(agent.confidence * 100).toFixed(0)}%</strong></span>
                  <span className="font-mono text-[10px] text-slate-400">ADR-322A Verified</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Swarm Mission Result & Coordinated Turn Pipeline */}
      {lastResult && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-cyan-400">MISSION COMPLETED</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {lastResult.executionTimeMs}ms
                  </span>
                </div>
                <h3 className="text-base font-semibold text-white mt-1">{lastResult.mission}</h3>
                <p className="text-xs text-slate-400 mt-1">{lastResult.summary}</p>
              </div>

              {/* Consensus Quorum Certificate */}
              <div className="flex items-center gap-2 bg-emerald-950/40 border border-emerald-800/60 px-3.5 py-2 rounded-lg">
                <Award className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div>
                  <div className="text-[10px] font-mono uppercase text-emerald-400">BFT Quorum Verified</div>
                  <div className="text-xs font-semibold text-emerald-200">
                    {lastResult.consensusScore}% Consensus Approved
                  </div>
                </div>
              </div>
            </div>

            {/* Turn-by-Turn Swarm Execution Pipeline */}
            <div className="mt-5 space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Coordinated Specialist Turn Pipeline
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {lastResult.steps.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800/90 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded bg-slate-800 flex items-center justify-center text-[10px] font-mono text-cyan-400 font-bold">
                          0{idx + 1}
                        </span>
                        <span className="text-xs font-bold text-white">{step.agent}</span>
                        <span className="text-[10px] text-slate-400">({step.role})</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400">VERIFIED</span>
                    </div>

                    <div className="text-[11px] font-medium text-cyan-300/90 mb-1">
                      {step.action}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {step.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Cipher's Synthesized Code Viewer */}
            {lastResult.codeSnippet && (
              <div className="mt-5 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <Code className="w-4 h-4 text-cyan-400" />
                    <span className="font-semibold">Synthesized Artifact (Agent Cipher)</span>
                    <span className="text-slate-500 font-mono text-[11px]">TypeScript</span>
                  </div>

                  <button
                    onClick={() => copyCode(lastResult.codeSnippet)}
                    className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded border border-slate-700 transition-colors"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
                  </button>
                </div>

                <pre className="p-4 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed">
                  <code>{lastResult.codeSnippet}</code>
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
