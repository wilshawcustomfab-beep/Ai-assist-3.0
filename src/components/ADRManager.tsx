import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  ChevronDown,
  Lock,
  ExternalLink
} from 'lucide-react';
import { ADRItem } from '../types';

interface ADRManagerProps {
  onOpenLuna: () => void;
}

export const ADRManager: React.FC<ADRManagerProps> = ({ onOpenLuna }) => {
  const [adrs, setAdrs] = useState<ADRItem[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>('adr-001');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [context, setContext] = useState('');
  const [decision, setDecision] = useState('');
  const [consequences, setConsequences] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchADRs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/adrs');
      if (res.ok) {
        const data = await res.json();
        setAdrs(data.adrs || []);
      }
    } catch (err) {
      console.error('Failed to fetch ADRs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchADRs();
  }, []);

  const handleCreateADR = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !decision.trim()) return;

    try {
      const res = await fetch('/api/adrs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          context: context.trim(),
          decision: decision.trim(),
          consequences: consequences.trim(),
          author: 'Atlas & Luna'
        })
      });

      if (res.ok) {
        setShowCreateModal(false);
        setTitle('');
        setContext('');
        setDecision('');
        setConsequences('');
        fetchADRs();
      }
    } catch (err) {
      console.error('Failed to create ADR:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-white tracking-tight">
                Architecture Decision Records & Policy Invariants
              </h2>
              <span className="text-xs text-cyan-400 font-mono">GOVERNANCE</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Immutable architectural decisions governing swarm execution boundaries, ADR-322A safety envelopes, and consensus rules.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Propose ADR</span>
            </button>
            <button
              onClick={onOpenLuna}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Audit with Luna</span>
            </button>
          </div>
        </div>

        {/* Invariant Highlights */}
        <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Single Writer Isolation</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Never run two writers in one worktree. Multi-writer race conditions result in immediate policy cancellation.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
            <div className="flex items-center gap-1.5 text-cyan-400 font-semibold mb-1">
              <Lock className="w-3.5 h-3.5" />
              <span>Safety Envelope Bounding</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Delegation may only reduce tools, servers, namespaces, network, and spend—never expand permissions.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
            <div className="flex items-center gap-1.5 text-purple-400 font-semibold mb-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>BFT Release Gate</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Publishing artifacts requires Solon cryptographic signing and minimum 67% Byzantine Fault Tolerant consensus.
            </p>
          </div>
        </div>
      </div>

      {/* ADR List */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Decisions Ledger ({adrs.length})
        </h3>

        <div className="space-y-3">
          {adrs.map((adr) => {
            const isExpanded = expandedId === adr.id;
            return (
              <div
                key={adr.id}
                className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : adr.id)}
                  className="w-full text-left p-4 flex items-center justify-between gap-3 hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded border border-cyan-800/50">
                      ADR-{String(adr.number).padStart(3, '0')}
                    </span>
                    <div>
                      <h4 className="text-sm font-semibold text-white">{adr.title}</h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <span>Author: {adr.author}</span>
                        <span aria-hidden="true">·</span>
                        <span>Date: {adr.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full border bg-emerald-950/60 text-emerald-300 border-emerald-800/50">
                      {adr.status}
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="p-4 pt-2 border-t border-slate-800/80 bg-slate-950/40 text-xs space-y-3">
                    <div>
                      <strong className="text-slate-300 block mb-1 text-[11px] uppercase tracking-wider">
                        Context & Problem Statement:
                      </strong>
                      <p className="text-slate-400 leading-relaxed pl-2 border-l-2 border-slate-800">
                        {adr.context}
                      </p>
                    </div>

                    <div>
                      <strong className="text-cyan-300 block mb-1 text-[11px] uppercase tracking-wider">
                        Decision Outcome:
                      </strong>
                      <p className="text-slate-200 leading-relaxed pl-2 border-l-2 border-cyan-500/40 font-mono text-[11px]">
                        {adr.decision}
                      </p>
                    </div>

                    <div>
                      <strong className="text-slate-300 block mb-1 text-[11px] uppercase tracking-wider">
                        Consequences & Invariant Guarantees:
                      </strong>
                      <p className="text-slate-400 leading-relaxed pl-2 border-l-2 border-slate-800">
                        {adr.consequences}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Propose ADR Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-white">Propose Architecture Decision Record (ADR)</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateADR} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  ADR Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Distributed Circuit Breaker for Redis Cluster"
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Context & Architectural Drivers
                </label>
                <textarea
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  rows={2}
                  placeholder="What forces or constraints motivated this decision?"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Decision
                </label>
                <textarea
                  value={decision}
                  onChange={(e) => setDecision(e.target.value)}
                  rows={3}
                  placeholder="The chosen solution, topology, and execution rules..."
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono text-[11px]"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Consequences & Invariant Guarantees
                </label>
                <textarea
                  value={consequences}
                  onChange={(e) => setConsequences(e.target.value)}
                  rows={2}
                  placeholder="Positive impacts, tradeoffs, and compliance checks..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg shadow-sm"
                >
                  Propose Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
