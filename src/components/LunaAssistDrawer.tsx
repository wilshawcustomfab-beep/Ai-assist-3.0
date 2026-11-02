import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  ArrowRight, 
  Lightbulb, 
  ShieldCheck, 
  Cpu, 
  RotateCcw,
  Volume2,
  Copy,
  Check
} from 'lucide-react';
import { ChatMessage, SwarmTopology } from '../types';

interface LunaAssistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  topology: SwarmTopology;
  voiceEnabled: boolean;
  onDispatchMission?: (mission: string) => void;
}

export const LunaAssistDrawer: React.FC<LunaAssistDrawerProps> = ({
  isOpen,
  onClose,
  topology,
  voiceEnabled,
  onDispatchMission
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'luna',
      text: "Hello! I'm **Luna**, your proactive assistant for the RuFlo multi-agent swarm platform.\n\nI can help you decompose engineering tasks, orchestrate Atlas, Cipher, Vigil, and Argus, recall patterns from AgentDB, and enforce ADR-322A safety envelopes. What mission are we building today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const proactiveTips = [
    {
      title: "Recommend Swarm Topology",
      prompt: "Which swarm topology (Hierarchical, Mesh, Ring, or Star) should I use for a distributed microservice workflow?",
      icon: Cpu
    },
    {
      title: "ADR-322A Safety Audit",
      prompt: "Can you explain how Vigil enforces ADR-322A invariants and prevents unauthorized side-effects in RuFlo?",
      icon: ShieldCheck
    },
    {
      title: "AgentDB Recall Strategy",
      prompt: "How does RuFlo's score > 0.70 vector recall threshold guarantee precision in AgentDB?",
      icon: Lightbulb
    }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const speakText = (text: string) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      // Clean markdown tags for natural speech
      const cleaned = text.replace(/[*#`_~]/g, '').slice(0, 280);
      const utterance = new SpeechSynthesisUtterance(cleaned);
      utterance.pitch = 1.05;
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  };

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputValue.trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    if (!textToSend) setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages,
          swarmContext: { topology }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const replyText = data.reply || "I've reviewed the swarm parameters and can assist with orchestrating the next execution phase.";

      const lunaMessage: ChatMessage = {
        id: `luna-${Date.now()}`,
        sender: 'luna',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, lunaMessage]);
      speakText(replyText);
    } catch (err) {
      console.error('Luna assistant error:', err);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'luna',
        text: "I experienced a brief connection interruption with the backend service. RuFlo swarms remain active and reachable via the CLI and Swarm Cockpit.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'reset-msg',
        sender: 'luna',
        text: "Chat cleared. I'm ready for your next question or mission prompt!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  if (!isOpen) return null;

  return (
    <aside className="fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] bg-slate-900/95 backdrop-blur-xl border-l border-slate-800 shadow-2xl flex flex-col transition-all duration-300">
      {/* Top Header */}
      <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center text-white shadow-md shadow-cyan-950">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-sm text-white">Luna AI Copilot</h2>
              <span className="text-[10px] text-cyan-400 font-mono">PROACTIVE ASSIST</span>
            </div>
            <p className="text-xs text-slate-400">
              Topology: <span className="text-slate-200 capitalize">{topology}</span> · 6 Agents Linked
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleClearHistory}
            title="Clear Chat"
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Proactive Quick Prompts */}
      <div className="p-3 bg-slate-950/40 border-b border-slate-800/80">
        <div className="text-[11px] font-medium text-slate-400 mb-2 flex items-center gap-1.5">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          <span>Proactive Suggestions</span>
        </div>
        <div className="flex flex-col gap-1.5">
          {proactiveTips.map((tip, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(tip.prompt)}
              className="text-left px-2.5 py-1.5 text-xs text-slate-300 hover:text-cyan-300 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-cyan-500/30 rounded-md transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center gap-2 truncate">
                <tip.icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 flex-shrink-0" />
                <span className="truncate">{tip.title}</span>
              </div>
              <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 flex-shrink-0 ml-1 transition-transform group-hover:translate-x-0.5" />
            </button>
          ))}
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isLuna = msg.sender === 'luna';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isLuna ? '' : 'flex-row-reverse'}`}
            >
              <div
                className={`w-7 h-7 rounded-md flex-shrink-0 flex items-center justify-center text-xs ${
                  isLuna
                    ? 'bg-gradient-to-br from-cyan-600 to-blue-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-300 border border-slate-700'
                }`}
              >
                {isLuna ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
              </div>

              <div className={`max-w-[85%] ${isLuna ? 'items-start' : 'items-end'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-medium text-slate-400">
                    {isLuna ? 'Luna' : 'You'}
                  </span>
                  <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                  {isLuna && (
                    <button
                      onClick={() => copyToClipboard(msg.id, msg.text)}
                      className="text-slate-500 hover:text-slate-300 transition-colors ml-auto"
                      title="Copy message"
                    >
                      {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  )}
                </div>

                <div
                  className={`p-3 rounded-lg text-xs leading-relaxed ${
                    isLuna
                      ? 'bg-slate-800/80 border border-slate-700/80 text-slate-200'
                      : 'bg-cyan-600 text-white shadow-md shadow-cyan-950/30'
                  }`}
                >
                  <div className="whitespace-pre-wrap space-y-2">
                    {msg.text.split('\n\n').map((paragraph, pIdx) => {
                      if (paragraph.startsWith('```') && paragraph.endsWith('```')) {
                        const code = paragraph.replace(/```[a-z]*\n?/g, '').trim();
                        return (
                          <pre key={pIdx} className="bg-slate-950 p-2.5 rounded font-mono text-[11px] overflow-x-auto text-cyan-300 border border-slate-800 my-1.5">
                            <code>{code}</code>
                          </pre>
                        );
                      }
                      return <p key={pIdx}>{paragraph}</p>;
                    })}
                  </div>

                  {/* If Luna suggests dispatching to swarm */}
                  {isLuna && onDispatchMission && (
                    <div className="mt-3 pt-2.5 border-t border-slate-700/60 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">Dispatch to RuFlo Swarm?</span>
                      <button
                        onClick={() => onDispatchMission(msg.text.slice(0, 100))}
                        className="text-[11px] text-cyan-300 hover:text-cyan-200 bg-cyan-950/60 hover:bg-cyan-900/60 px-2.5 py-1 rounded border border-cyan-800/60 transition-colors"
                      >
                        Run as Mission
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 items-center">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-cyan-600 to-blue-600 text-white flex items-center justify-center">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="bg-slate-800/80 border border-slate-700/80 px-3 py-2.5 rounded-lg flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]"></span>
              <span className="text-xs text-slate-400 font-mono ml-1">Luna thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="p-3 bg-slate-950/80 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask Luna anything or assign a swarm task..."
            disabled={isLoading}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="p-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:hover:bg-cyan-600 text-white transition-all shadow-md shadow-cyan-950/30"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 px-1">
          <span>Powered by Gemini & RuFlo Engine</span>
          <span>Press Enter to send</span>
        </div>
      </div>
    </aside>
  );
};
