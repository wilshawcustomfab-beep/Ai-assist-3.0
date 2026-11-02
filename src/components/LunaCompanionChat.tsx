import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Paperclip, 
  Image as ImageIcon, 
  FileText, 
  X, 
  Sparkles, 
  Bot, 
  User, 
  Copy, 
  Check, 
  Square,
  ArrowRight,
  ShieldCheck,
  Maximize2,
  Minimize2,
  Cpu
} from 'lucide-react';
import { ChatMessage, CompanionState, MessageAttachment, UserPreferences, SwarmTopology, ActiveHarness, ActiveCompanion } from '../types';

interface LunaCompanionChatProps {
  messages: ChatMessage[];
  onSendMessage: (text: string, attachments?: MessageAttachment[]) => void;
  isLoading: boolean;
  companionState: CompanionState;
  onInterruptSpeech?: () => void;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  onDispatchMission?: (mission: string) => void;
  preferences: UserPreferences;
  topology: SwarmTopology;
  activeHarness: ActiveHarness;
  activeAi: ActiveCompanion;
}

export const LunaCompanionChat: React.FC<LunaCompanionChatProps> = ({
  messages,
  onSendMessage,
  isLoading,
  companionState,
  onInterruptSpeech,
  voiceEnabled,
  onToggleVoice,
  onDispatchMission,
  preferences,
  topology,
  activeHarness,
  activeAi
}) => {
  const [inputValue, setInputValue] = useState('');
  const [attachments, setAttachments] = useState<MessageAttachment[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const proactiveSuggestions = [
    "Refactor our API route using Claude Code harness and run unit tests",
    "Audit system boundaries under ADR-322A safety envelope rules",
    "Build a distributed cache with rate limiting & Prometheus metrics",
    "Inspect the seek(t) deterministic motion pipeline and critique scores"
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isImg = file.type.startsWith('image/');
      const reader = new FileReader();

      reader.onload = () => {
        const result = reader.result as string;
        setAttachments(prev => [
          ...prev,
          {
            type: isImg ? 'image' : 'document',
            name: file.name,
            content: result,
            mimeType: file.type
          }
        ]);
      };

      if (isImg) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!inputValue.trim() && attachments.length === 0) || isLoading) return;

    onSendMessage(inputValue.trim(), attachments);
    setInputValue('');
    setAttachments([]);
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const isCindy = activeAi === 'cindy';

  return (
    <div className={`flex flex-col bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl transition-all duration-300 ${
      isExpanded ? 'h-[720px]' : 'h-[520px]'
    }`}>
      {/* Top Header */}
      <div className="px-4 py-3 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between rounded-t-2xl">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-rose-500"></div>
          <span className="text-xs font-semibold text-white">
            {isCindy ? 'Cindy Agent Console' : 'Luna Multimodal Console'}
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-[10px] text-rose-300 font-mono">
            {activeHarness.toUpperCase()}
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-[10px] text-slate-400 font-mono">
            {topology.toUpperCase()}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {companionState === 'speaking' && onInterruptSpeech && (
            <button
              onClick={onInterruptSpeech}
              className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-rose-950/80 border border-rose-800/80 text-rose-300 hover:bg-rose-900 transition-colors"
              title="Interrupt speech"
            >
              <Square className="w-2.5 h-2.5 fill-current" />
              <span>Stop Speech</span>
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors"
            title={isExpanded ? 'Collapse Console' : 'Expand Console'}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-xs">
        {messages.map((msg) => {
          const isAi = msg.sender === 'cindy' || msg.sender === 'luna';
          const senderLabel = msg.sender === 'cindy' ? 'Cindy' : msg.sender === 'luna' ? 'Luna' : 'You';

          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isAi ? '' : 'flex-row-reverse'}`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center text-xs shadow-sm ${
                  isAi
                    ? 'bg-gradient-to-br from-rose-500 to-pink-600 text-white'
                    : 'bg-slate-800 text-slate-200 border border-slate-700'
                }`}
              >
                {isAi ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
              </div>

              <div className={`max-w-[85%] ${isAi ? 'items-start' : 'items-end'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-semibold text-slate-400">
                    {senderLabel}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{msg.timestamp}</span>
                  {msg.harnessUsed && (
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-rose-300 border border-slate-700">
                      {msg.harnessUsed}
                    </span>
                  )}
                  {isAi && (
                    <button
                      onClick={() => copyToClipboard(msg.id, msg.text)}
                      className="text-slate-500 hover:text-slate-300 transition-colors ml-auto"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  )}
                </div>

                <div
                  className={`p-3.5 rounded-xl leading-relaxed ${
                    isAi
                      ? 'bg-slate-800/90 border border-slate-700/80 text-slate-200 shadow-md'
                      : 'bg-rose-600 text-white shadow-md shadow-rose-950/30'
                  }`}
                >
                  {/* Attachments preview */}
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-2 pb-2 border-b border-slate-700/60">
                      {msg.attachments.map((att, aIdx) => (
                        <div key={aIdx} className="flex items-center gap-1.5 p-1.5 bg-slate-900/80 rounded border border-slate-700 text-[10px]">
                          {att.type === 'image' ? (
                            <ImageIcon className="w-3 h-3 text-rose-400" />
                          ) : (
                            <FileText className="w-3 h-3 text-amber-400" />
                          )}
                          <span className="truncate max-w-[120px]">{att.name}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Message Markdown Text */}
                  <div className="whitespace-pre-wrap space-y-2">
                    {msg.text.split('\n\n').map((paragraph, pIdx) => {
                      if (paragraph.startsWith('```') && paragraph.endsWith('```')) {
                        const code = paragraph.replace(/```[a-z]*\n?/g, '').trim();
                        return (
                          <pre key={pIdx} className="bg-slate-950 p-3 rounded-lg font-mono text-[11px] overflow-x-auto text-rose-200 border border-slate-800 my-1.5 leading-normal">
                            <code>{code}</code>
                          </pre>
                        );
                      }
                      return <p key={pIdx}>{paragraph}</p>;
                    })}
                  </div>

                  {/* Proactive Swarm Dispatcher Handoff */}
                  {isAi && onDispatchMission && (
                    <div className="mt-3 pt-2.5 border-t border-slate-700/70 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-rose-400" />
                        <span>Dispatch to RuFlo Swarm?</span>
                      </span>
                      <button
                        onClick={() => onDispatchMission(msg.text.slice(0, 110))}
                        className="text-[11px] font-medium text-rose-300 hover:text-rose-200 bg-rose-950 hover:bg-rose-900/80 px-2.5 py-1 rounded border border-rose-800/80 transition-colors flex items-center gap-1"
                      >
                        <span>Dispatch Task</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3 items-center">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 text-white flex items-center justify-center">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="bg-slate-800/90 border border-slate-700 px-3.5 py-2.5 rounded-xl flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-bounce"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-bounce [animation-delay:0.4s]"></span>
              <span className="text-xs text-slate-400 font-mono ml-1">
                {isCindy ? 'Cindy executing on ' + activeHarness + '...' : 'Luna coordinating specialists...'}
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Proactive Quick Suggestion Buttons */}
      <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto text-xs">
        <span className="text-[10px] font-mono text-slate-500 whitespace-nowrap">Suggested:</span>
        {proactiveSuggestions.map((sug, i) => (
          <button
            key={i}
            onClick={() => onSendMessage(sug)}
            disabled={isLoading}
            className="text-[11px] text-slate-400 hover:text-rose-300 hover:bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-800 transition-colors whitespace-nowrap"
          >
            {sug.length > 38 ? sug.slice(0, 38) + '...' : sug}
          </button>
        ))}
      </div>

      {/* Input Console */}
      <div className="p-3 bg-slate-950/90 border-t border-slate-800 rounded-b-2xl space-y-2">
        {/* Attachment chips */}
        {attachments.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap pb-1">
            {attachments.map((att, aIdx) => (
              <div
                key={aIdx}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 rounded-md border border-slate-700 text-xs text-slate-200"
              >
                {att.type === 'image' ? (
                  <ImageIcon className="w-3.5 h-3.5 text-rose-400" />
                ) : (
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                )}
                <span className="truncate max-w-[140px] text-[11px]">{att.name}</span>
                <button
                  type="button"
                  onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== aIdx))}
                  className="text-slate-400 hover:text-rose-400 ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            multiple
            accept="image/*,.txt,.json,.md,.ts,.js,.py"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Attach images or documents for multimodal analysis"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isCindy ? 'Talk to Cindy ("Consider it done")...' : 'Talk to Luna...'}
            disabled={isLoading}
            className="flex-1 bg-slate-900 border border-slate-700/80 rounded-lg px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 font-sans"
          />

          <button
            type="submit"
            disabled={(!inputValue.trim() && attachments.length === 0) || isLoading}
            className="px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white font-medium text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-rose-950/30"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
