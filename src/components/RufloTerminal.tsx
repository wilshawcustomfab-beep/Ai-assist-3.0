import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Play, Trash2, HelpCircle, Check, Copy } from 'lucide-react';

interface TerminalEntry {
  type: 'command' | 'output';
  text: string;
  timestamp: string;
}

export const RufloTerminal: React.FC = () => {
  const [entries, setEntries] = useState<TerminalEntry[]>([
    {
      type: 'output',
      text: `╔═══════════════════════════════════════════════════════════════════════════╗
║  RuFlo Engine & Multi-Agent Meta-Harness (v3.63.6)                        ║
║  Connected to Luna AI Copilot · Byzantine Consensus Active                 ║
║  Type 'ruflo help' or click a command below to begin.                      ║
╚═══════════════════════════════════════════════════════════════════════════╝`,
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [commandInput, setCommandInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isExecuting, setIsExecuting] = useState(false);
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  const quickCommands = [
    'ruflo status',
    'ruflo doctor',
    'ruflo agents list',
    'ruflo memory search consensus',
    'ruflo adr list'
  ];

  useEffect(() => {
    terminalBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries]);

  const executeCommand = async (cmdToRun?: string) => {
    const cmd = (cmdToRun || commandInput).trim();
    if (!cmd || isExecuting) return;

    const time = new Date().toLocaleTimeString();
    setEntries(prev => [...prev, { type: 'command', text: `$ ${cmd}`, timestamp: time }]);
    setHistory(prev => [cmd, ...prev]);
    setHistoryIndex(-1);
    if (!cmdToRun) setCommandInput('');
    setIsExecuting(true);

    if (cmd === 'clear') {
      setEntries([]);
      setIsExecuting(false);
      return;
    }

    try {
      const res = await fetch('/api/terminal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: cmd })
      });

      if (res.ok) {
        const data = await res.json();
        setEntries(prev => [...prev, { type: 'output', text: data.output, timestamp: new Date().toLocaleTimeString() }]);
      } else {
        setEntries(prev => [...prev, { type: 'output', text: `Error: Command execution failed with status ${res.status}`, timestamp: new Date().toLocaleTimeString() }]);
      }
    } catch (err) {
      setEntries(prev => [...prev, { type: 'output', text: `Connection error: Unable to reach RuFlo terminal daemon.`, timestamp: new Date().toLocaleTimeString() }]);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0 && historyIndex < history.length - 1) {
        const nextIdx = historyIndex + 1;
        setHistoryIndex(nextIdx);
        setCommandInput(history[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setCommandInput(history[nextIdx]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCommandInput('');
      }
    }
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col h-[640px]">
      {/* Terminal Title Bar */}
      <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
          </div>
          <TerminalIcon className="w-4 h-4 text-cyan-400" />
          <span className="font-mono text-xs font-semibold text-slate-200">
            ruflo@session: ~ (v3.63.6 TUI)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setEntries([])}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded transition-colors"
            title="Clear Terminal"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quick Launch Buttons */}
      <div className="px-4 py-2 bg-slate-900/60 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto text-xs">
        <span className="text-[11px] font-mono text-slate-500">Quick:</span>
        {quickCommands.map((cmd, i) => (
          <button
            key={i}
            onClick={() => executeCommand(cmd)}
            disabled={isExecuting}
            className="font-mono text-[11px] text-cyan-300 hover:text-white bg-slate-800/90 hover:bg-slate-700 px-2.5 py-1 rounded border border-slate-700/60 transition-colors whitespace-nowrap"
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* Output Console Log */}
      <div className="flex-1 p-4 overflow-y-auto font-mono text-xs text-slate-300 space-y-2 bg-slate-950">
        {entries.map((entry, index) => (
          <div key={index} className="leading-relaxed">
            {entry.type === 'command' ? (
              <div className="text-cyan-400 font-semibold flex items-center gap-2">
                <span>{entry.text}</span>
                <span className="text-[10px] text-slate-600 font-normal">{entry.timestamp}</span>
              </div>
            ) : (
              <pre className="whitespace-pre-wrap text-slate-300 font-mono text-xs">
                {entry.text}
              </pre>
            )}
          </div>
        ))}
        {isExecuting && (
          <div className="text-cyan-400 animate-pulse font-mono flex items-center gap-2">
            <span>Executing command...</span>
          </div>
        )}
        <div ref={terminalBottomRef} />
      </div>

      {/* Command Line Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          executeCommand();
        }}
        className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
      >
        <span className="text-cyan-400 font-mono text-sm font-bold pl-1">$</span>
        <input
          type="text"
          value={commandInput}
          onChange={(e) => setCommandInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type 'ruflo status', 'ruflo doctor', 'help', or 'clear'..."
          disabled={isExecuting}
          className="flex-1 bg-transparent border-none text-slate-100 font-mono text-xs focus:outline-none placeholder-slate-600"
        />
        <button
          type="submit"
          disabled={isExecuting || !commandInput.trim()}
          className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white rounded font-mono text-xs transition-colors flex items-center gap-1"
        >
          <Play className="w-3 h-3 fill-white" />
          <span>Run</span>
        </button>
      </form>
    </div>
  );
};
