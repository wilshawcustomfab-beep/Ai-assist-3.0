import React, { useState, useEffect } from 'react';
import { 
  Wrench, 
  Play, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Terminal, 
  RotateCw, 
  Code, 
  Sparkles,
  Lock,
  Search
} from 'lucide-react';
import { ToolDefinition } from '../types';

interface ToolRegistryViewProps {
  onOpenLuna: () => void;
}

export const ToolRegistryView: React.FC<ToolRegistryViewProps> = ({ onOpenLuna }) => {
  const [tools, setTools] = useState<ToolDefinition[]>([]);
  const [selectedTool, setSelectedTool] = useState<ToolDefinition | null>(null);
  const [executionInput, setExecutionInput] = useState<string>('{}');
  const [executionOutput, setExecutionOutput] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchTools = async () => {
    try {
      const res = await fetch('/api/tools');
      if (res.ok) {
        const data = await res.json();
        setTools(data.tools || []);
        if (data.tools && data.tools.length > 0 && !selectedTool) {
          setSelectedTool(data.tools[0]);
          setDefaultInput(data.tools[0]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch tool registry:', err);
    }
  };

  useEffect(() => {
    fetchTools();
  }, []);

  const setDefaultInput = (tool: ToolDefinition) => {
    if (tool.id === 'tool-agentdb-search') {
      setExecutionInput(JSON.stringify({ query: 'consensus' }, null, 2));
    } else if (tool.id === 'tool-code-eval') {
      setExecutionInput(JSON.stringify({ code: 'Math.sqrt(144) * Math.sin(Math.PI / 4)' }, null, 2));
    } else if (tool.id === 'tool-motion-seek') {
      setExecutionInput(JSON.stringify({ t: 2.5, target: 1.0 }, null, 2));
    } else {
      setExecutionInput(JSON.stringify({ test: true }, null, 2));
    }
  };

  const handleSelectTool = (tool: ToolDefinition) => {
    setSelectedTool(tool);
    setDefaultInput(tool);
    setExecutionOutput(null);
  };

  const handleExecuteTool = async () => {
    if (!selectedTool || isExecuting) return;

    setIsExecuting(true);
    setExecutionOutput(null);

    let parsedInput = {};
    try {
      parsedInput = JSON.parse(executionInput);
    } catch (e) {
      setExecutionOutput({ error: 'Invalid JSON input syntax' });
      setIsExecuting(false);
      return;
    }

    try {
      const res = await fetch('/api/tools/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolId: selectedTool.id,
          input: parsedInput
        })
      });

      const data = await res.json();
      setExecutionOutput(data);
      fetchTools();
    } catch (err: any) {
      setExecutionOutput({ error: err.message || 'Execution failed' });
    } finally {
      setIsExecuting(false);
    }
  };

  const filteredTools = tools.filter(t => 
    !searchQuery.trim() ||
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Wrench className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-white tracking-tight">
                Tool Discovery Registry & Autonomous Connectors
              </h2>
              <span className="text-xs text-cyan-400 font-mono">SANDBOXED RUNTIME</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Verified callable integrations available to Luna and the RuFlo swarm specialists. Every tool specifies bounded input schemas, execution risk level, and ADR-322A permissions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              Sandbox Isolator: Active
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Tools List + Execution Console */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tools List */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search available connectors..."
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-2">
            {filteredTools.map((tool) => {
              const isSelected = selectedTool?.id === tool.id;
              return (
                <div
                  key={tool.id}
                  onClick={() => handleSelectTool(tool)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-500/60 shadow-lg shadow-cyan-950/20'
                      : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="text-xs font-semibold text-white">{tool.name}</h4>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                      tool.riskLevel === 'low' 
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40' 
                        : 'bg-amber-950/60 text-amber-300 border-amber-800/40'
                    }`}>
                      {tool.riskLevel.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {tool.description}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>Perm: {tool.requiredPermission}</span>
                    <span className="text-cyan-400 capitalize">{tool.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tool Execution Sandbox Console */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          {selectedTool ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">{selectedTool.name}</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                      {selectedTool.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{selectedTool.description}</p>
                </div>

                <button
                  onClick={handleExecuteTool}
                  disabled={isExecuting}
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-medium text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  {isExecuting ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                  <span>Execute Tool</span>
                </button>
              </div>

              {/* JSON Input Editor */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 font-mono">
                  Input Parameters (JSON):
                </label>
                <textarea
                  value={executionInput}
                  onChange={(e) => setExecutionInput(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500 leading-relaxed"
                ></textarea>
              </div>

              {/* Live Output Inspector */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-slate-300 font-mono">
                    Sandbox Execution Output:
                  </label>
                  {executionOutput && (
                    <span className="text-[10px] font-mono text-emerald-400">
                      STATUS 200 OK
                    </span>
                  )}
                </div>

                <pre className="w-full h-48 bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-300 overflow-y-auto leading-relaxed">
                  <code>
                    {executionOutput 
                      ? JSON.stringify(executionOutput, null, 2)
                      : '// Click "Execute Tool" to run the connector within the sandbox and observe output.'}
                  </code>
                </pre>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-slate-500 text-xs">
              Select a tool connector to inspect its execution envelope.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
