import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Search, 
  Plus, 
  Layers, 
  Tag, 
  Check, 
  Copy, 
  Sparkles,
  ArrowUpRight,
  Filter,
  RefreshCw
} from 'lucide-react';
import { MemoryItem } from '../types';

interface AgentDBViewProps {
  onOpenLuna: () => void;
  onRefreshTotalCount?: (count: number) => void;
}

export const AgentDBView: React.FC<AgentDBViewProps> = ({ onOpenLuna, onRefreshTotalCount }) => {
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [selectedNamespace, setSelectedNamespace] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newNamespace, setNewNamespace] = useState<'patterns' | 'adrs' | 'guardrails' | 'benchmarks'>('patterns');
  const [newTags, setNewTags] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchMemories = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedNamespace !== 'all') params.append('namespace', selectedNamespace);
      if (searchQuery.trim()) params.append('query', searchQuery.trim());

      const res = await fetch(`/api/memory?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setMemories(data.memory || []);
        if (onRefreshTotalCount && selectedNamespace === 'all' && !searchQuery.trim()) {
          onRefreshTotalCount(data.total || data.memory.length);
        }
      }
    } catch (err) {
      console.error('Failed to fetch AgentDB memory:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMemories();
  }, [selectedNamespace]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMemories();
  };

  const handleAddMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim() || !newValue.trim()) return;

    try {
      const res = await fetch('/api/memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: newKey.trim(),
          value: newValue.trim(),
          namespace: newNamespace,
          tags: newTags.split(',').map(t => t.trim()).filter(Boolean)
        })
      });

      if (res.ok) {
        setShowAddModal(false);
        setNewKey('');
        setNewValue('');
        setNewTags('');
        fetchMemories();
      }
    } catch (err) {
      console.error('Failed to add memory to AgentDB:', err);
    }
  };

  const copyPattern = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-white tracking-tight">AgentDB Vector Memory & Recall</h2>
              <span className="text-xs text-cyan-400 font-mono">HNSW RAG</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Persistent cross-session pattern store. In accordance with RuFlo standards, memories with similarity score &gt; 0.70 are automatically incorporated into executor agent contexts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Crystallize Pattern</span>
            </button>
            <button
              onClick={onOpenLuna}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Ask Luna to Query</span>
            </button>
          </div>
        </div>

        {/* Search & Namespace Filtering */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-col md:flex-row gap-3">
          <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search vector memory by key, pattern content, or tags..."
                className="w-full bg-slate-950 border border-slate-700/80 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all font-sans"
              />
            </div>
            <button
              type="submit"
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors"
            >
              Search
            </button>
          </form>

          {/* Namespace Filter Pills / Buttons */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg overflow-x-auto text-xs">
            {['all', 'patterns', 'guardrails', 'adrs', 'benchmarks'].map((ns) => (
              <button
                key={ns}
                onClick={() => setSelectedNamespace(ns)}
                className={`px-3 py-1 font-medium rounded-md capitalize transition-colors ${
                  selectedNamespace === ns
                    ? 'bg-slate-800 text-cyan-300 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {ns}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Memory Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>Showing {memories.length} vector records</span>
            <span className="text-slate-600">·</span>
            <span className="text-emerald-400">Recall Threshold: &gt; 0.70</span>
          </div>

          <button
            onClick={fetchMemories}
            disabled={isLoading}
            className="flex items-center gap-1 text-slate-400 hover:text-slate-200"
          >
            <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {memories.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/50 border border-slate-800 rounded-xl">
            <Database className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-slate-300">No Vector Memories Found</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              No pattern matches the current filter or search query. Click "Crystallize Pattern" to record a new pattern in AgentDB.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {memories.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="text-sm font-mono font-semibold text-cyan-300">
                        {item.key}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <span className="capitalize">{item.namespace}</span>
                        <span aria-hidden="true">·</span>
                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Vector Cosine Score Gauge */}
                    <div className="text-right flex-shrink-0">
                      <div className="text-xs font-mono font-bold text-emerald-400">
                        {(item.score * 100).toFixed(0)}% Match
                      </div>
                      <div className="w-14 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
                        <div
                          className="h-full bg-emerald-400 rounded-full"
                          style={{ width: `${item.score * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mt-2 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 font-mono text-[11px]">
                    {item.value}
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {item.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/60"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => copyPattern(item.id, item.value)}
                    className="text-slate-400 hover:text-slate-200 p-1 transition-colors"
                    title="Copy pattern value"
                  >
                    {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Pattern Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-white">Crystallize Pattern into AgentDB</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMemory} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Pattern Key (slug identifier)
                </label>
                <input
                  type="text"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  placeholder="e.g. pattern-bft-consensus-voting"
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Namespace
                </label>
                <select
                  value={newNamespace}
                  onChange={(e) => setNewNamespace(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="patterns">patterns</option>
                  <option value="guardrails">guardrails</option>
                  <option value="adrs">adrs</option>
                  <option value="benchmarks">benchmarks</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Pattern Blueprint / Learned Rule
                </label>
                <textarea
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  rows={4}
                  placeholder="Explain what worked, invariants required, or architectural guidelines..."
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="e.g. consensus, distributed, latency"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
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
                  Store Pattern
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
