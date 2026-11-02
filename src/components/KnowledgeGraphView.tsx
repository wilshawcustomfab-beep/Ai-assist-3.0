import React, { useState, useEffect } from 'react';
import { 
  Network, 
  Plus, 
  Search, 
  Link2, 
  CheckCircle2, 
  ShieldCheck, 
  Trash2, 
  Sparkles,
  Layers,
  Database,
  ArrowRight
} from 'lucide-react';
import { KnowledgeNode, UserPreferences } from '../types';

interface KnowledgeGraphViewProps {
  preferences: UserPreferences;
  onUpdatePreferences: (pref: Partial<UserPreferences>) => void;
  onOpenLuna: () => void;
}

export const KnowledgeGraphView: React.FC<KnowledgeGraphViewProps> = ({
  preferences,
  onUpdatePreferences,
  onOpenLuna
}) => {
  const [nodes, setNodes] = useState<KnowledgeNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newCategory, setNewCategory] = useState<'architecture' | 'policy' | 'workflow' | 'entity' | 'tool'>('entity');
  const [newSummary, setNewSummary] = useState('');
  const [newConnections, setNewConnections] = useState('');

  const fetchNodes = async () => {
    try {
      const res = await fetch('/api/knowledge-graph');
      if (res.ok) {
        const data = await res.json();
        setNodes(data.nodes || []);
        if (data.nodes && data.nodes.length > 0 && !selectedNode) {
          setSelectedNode(data.nodes[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load knowledge graph:', err);
    }
  };

  useEffect(() => {
    fetchNodes();
  }, []);

  const handleCreateNode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim() || !newSummary.trim()) return;

    try {
      const res = await fetch('/api/knowledge-graph', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          label: newLabel.trim(),
          category: newCategory,
          summary: newSummary.trim(),
          connections: newConnections.split(',').map(s => s.trim()).filter(Boolean)
        })
      });

      if (res.ok) {
        setShowAddModal(false);
        setNewLabel('');
        setNewSummary('');
        setNewConnections('');
        fetchNodes();
      }
    } catch (err) {
      console.error('Failed to create knowledge node:', err);
    }
  };

  const filteredNodes = nodes.filter(n => {
    const matchesCat = selectedCategory === 'all' || n.category === selectedCategory;
    const matchesQuery = !searchQuery.trim() || 
      n.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Network className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-white tracking-tight">
                Unified Knowledge Graph & Memory Directives
              </h2>
              <span className="text-xs text-cyan-400 font-mono">SEMANTIC ONTOLOGY</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Structural entity relationships linking Luna's conversational context, RuFlo swarm policies, AgentDB vectors, and verified architecture constraints.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Knowledge Node</span>
            </button>
            <button
              onClick={onOpenLuna}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Query Graph</span>
            </button>
          </div>
        </div>

        {/* User Companion Tone & Memory Retention Preferences */}
        <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400 block mb-1">Companion Personality Tone:</span>
            <select
              value={preferences.companionTone}
              onChange={(e) => onUpdatePreferences({ companionTone: e.target.value as any })}
              className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="witty">Witty, sharp & empathetic</option>
              <option value="analytical">Analytical, rigorous & formal</option>
              <option value="friendly">Warm, encouraging & supportive</option>
              <option value="concise">Concise, minimal & direct</option>
            </select>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400 block mb-1">ADR-322A Safety Policy:</span>
            <select
              value={preferences.safetyEnvelope}
              onChange={(e) => onUpdatePreferences({ safetyEnvelope: e.target.value as any })}
              className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="strict">Strict (Single-writer invariant enforced)</option>
              <option value="standard">Standard (Prompt injection check)</option>
              <option value="developer">Developer (Sandbox debug mode)</option>
            </select>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400 block mb-1">Memory Privacy Isolation:</span>
            <label className="flex items-center gap-2 text-slate-300 mt-1 cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.privacyMode}
                onChange={(e) => onUpdatePreferences({ privacyMode: e.target.checked })}
                className="accent-cyan-400 rounded"
              />
              <span>Redact secrets & credentials</span>
            </label>
          </div>
        </div>
      </div>

      {/* Main Grid: Node Network List + Selected Node Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Nodes Column */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search knowledge graph entities & relationships..."
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
              {['all', 'entity', 'architecture', 'policy', 'tool'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded capitalize font-medium transition-colors ${
                    selectedCategory === cat ? 'bg-slate-800 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredNodes.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-500/60 shadow-lg shadow-cyan-950/20'
                      : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h4 className="text-sm font-semibold text-white">{node.label}</h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-slate-700 bg-slate-800 text-cyan-300 capitalize">
                      {node.category}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {node.summary}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Link2 className="w-3 h-3 text-cyan-400" />
                      <span>{node.connections.length} edges</span>
                    </span>
                    <span className="font-mono text-emerald-400">
                      {(node.confidence * 100).toFixed(0)}% verified
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Node Details Inspector */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          {selectedNode ? (
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-800">
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block mb-1">
                  Entity Details & Invariant Constraints
                </span>
                <h3 className="text-base font-bold text-white">{selectedNode.label}</h3>
                <span className="text-xs text-slate-400 font-mono capitalize">
                  Category: {selectedNode.category}
                </span>
              </div>

              <div>
                <strong className="text-xs text-slate-300 block mb-1">Knowledge Definition:</strong>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800">
                  {selectedNode.summary}
                </p>
              </div>

              <div>
                <strong className="text-xs text-slate-300 block mb-1.5">Connected Graph Nodes:</strong>
                <div className="space-y-1.5">
                  {selectedNode.connections.map((connId, cIdx) => (
                    <div
                      key={cIdx}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs font-mono text-cyan-300 flex items-center gap-2"
                    >
                      <Link2 className="w-3.5 h-3.5 text-slate-500" />
                      <span>{connId}</span>
                    </div>
                  ))}
                  {selectedNode.connections.length === 0 && (
                    <span className="text-xs text-slate-500">Root vertex (no outward edges)</span>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onOpenLuna}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Inspect Relations in Luna Chat</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 text-xs">
              Select an entity to inspect its relational graph and invariants.
            </div>
          )}
        </div>
      </div>

      {/* Add Knowledge Node Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-white">Add Knowledge Graph Entity</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-200">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNode} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Entity Label</label>
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="e.g. Byzantine Fault Tolerant Release Gate"
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="entity">Entity</option>
                  <option value="architecture">Architecture</option>
                  <option value="policy">Policy / Invariant</option>
                  <option value="workflow">Workflow</option>
                  <option value="tool">Tool</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Knowledge Summary</label>
                <textarea
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  rows={3}
                  placeholder="Explain entity purpose, constraints, and relationships..."
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Connected Node IDs (comma separated)</label>
                <input
                  type="text"
                  value={newConnections}
                  onChange={(e) => setNewConnections(e.target.value)}
                  placeholder="node-luna, node-ruflo, node-adr322a"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono text-[11px]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg shadow-sm"
                >
                  Add Entity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
