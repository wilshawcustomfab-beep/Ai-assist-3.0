import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Send, 
  ShieldAlert, 
  Sparkles, 
  RefreshCw, 
  ShieldCheck, 
  Paperclip, 
  Check, 
  X,
  Radio,
  Crosshair,
  AlertTriangle,
  Flame,
  Clock
} from 'lucide-react';
import { ChatMessage, TemplarAdmin, PendingApprovalAction, MessageAttachment } from '../types';

interface JarvisTacticalHUDProps {
  activeAdmin: TemplarAdmin;
  messages: ChatMessage[];
  onSendMessage: (text: string, attachment?: MessageAttachment) => void;
  isLoading: boolean;
  onExecuteApproval: (item: PendingApprovalAction, action: 'approve' | 'reject') => void;
  voiceEnabled: boolean;
  setVoiceEnabled: (enabled: boolean) => void;
  isListening: boolean;
  onToggleListen: () => void;
  companionState: 'idle' | 'listening' | 'thinking' | 'speaking';
}

export const JarvisTacticalHUD: React.FC<JarvisTacticalHUDProps> = ({
  activeAdmin,
  messages,
  onSendMessage,
  isLoading,
  onExecuteApproval,
  voiceEnabled,
  setVoiceEnabled,
  isListening,
  onToggleListen,
  companionState
}) => {
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !selectedImage) return;

    let attachment: MessageAttachment | undefined;
    if (selectedImage) {
      attachment = {
        type: 'image',
        name: 'camera_capture.jpg',
        content: selectedImage
      };
    }

    onSendMessage(inputText, attachment);
    setInputText('');
    setSelectedImage(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const quickPrompts = [
    "Give me Sunday morning operational briefing",
    "Check rental fleet chrono compliance (350 FPS max)",
    "Draft Instagram announcement for Sunday skirmish",
    "Review balance due for Marcus Vance group (£170)",
    "Reorder 20 bags of Geoff’s 0.28g Bio BBs (£180)",
    "What is site protocol for 'BLIND MAN' ceasefire?"
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column: Tactical Animated HUD Core & Voice Status */}
      <div className="rounded-2xl border border-red-900/40 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 p-6 flex flex-col items-center justify-between shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent animate-pulse" />

        {/* Header Badges */}
        <div className="w-full flex items-center justify-between text-xs font-mono text-zinc-400 pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span className="font-bold text-red-300">JARVIS TEMPLAR</span>
          </div>
          <span className="text-[10px] text-zinc-500">v3.8 • UKARA CORE</span>
        </div>

        {/* Animated Tactical Reticle Avatar */}
        <div className="my-8 relative flex items-center justify-center">
          {/* Outer Pulsing Targeting Ring */}
          <div className={`w-48 h-48 rounded-full border-2 border-dashed transition-all duration-700 flex items-center justify-center ${
            companionState === 'speaking' 
              ? 'border-red-500 animate-spin scale-105 shadow-lg shadow-red-900/50' 
              : companionState === 'listening'
              ? 'border-amber-400 animate-pulse scale-110 shadow-lg shadow-amber-900/50'
              : companionState === 'thinking'
              ? 'border-red-400 animate-spin'
              : 'border-red-900/60'
          }`} style={{ animationDuration: companionState === 'speaking' ? '8s' : '20s' }}>
            
            {/* Middle Concentric Ring */}
            <div className="w-36 h-36 rounded-full border border-red-800/60 flex items-center justify-center">
              
              {/* Inner Glowing Core */}
              <div className={`w-24 h-24 rounded-full flex flex-col items-center justify-center transition-all ${
                companionState === 'speaking'
                  ? 'bg-gradient-to-br from-red-600 to-zinc-950 shadow-2xl shadow-red-600/60 scale-105'
                  : companionState === 'listening'
                  ? 'bg-gradient-to-br from-amber-600 to-zinc-950 shadow-2xl shadow-amber-600/60 scale-105'
                  : 'bg-gradient-to-br from-zinc-900 via-red-950 to-zinc-950 shadow-xl border border-red-900/50'
              }`}>
                <Crosshair className={`w-8 h-8 transition-colors ${
                  companionState === 'speaking' ? 'text-white animate-pulse' : 'text-red-400'
                }`} />
                <span className="text-[9px] font-mono font-bold text-zinc-200 mt-1 uppercase tracking-wider">
                  {companionState}
                </span>
              </div>
            </div>
          </div>

          {/* Crosshair Tick Marks */}
          <div className="absolute w-56 h-0.5 bg-red-900/30 pointer-events-none" />
          <div className="absolute h-56 w-0.5 bg-red-900/30 pointer-events-none" />
        </div>

        {/* Audio Waveform & Status Readout */}
        <div className="w-full space-y-4">
          <div className="flex items-center justify-center gap-1 h-6">
            {[40, 75, 90, 60, 30, 85, 95, 45, 65, 80, 50, 70].map((h, i) => (
              <span
                key={i}
                className={`w-1 rounded-full transition-all ${
                  companionState === 'speaking'
                    ? 'bg-red-500 animate-pulse'
                    : companionState === 'listening'
                    ? 'bg-amber-400 animate-pulse'
                    : 'bg-zinc-800'
                }`}
                style={{ 
                  height: companionState === 'speaking' || companionState === 'listening' 
                    ? `${(h * Math.random()).toFixed(0)}%` 
                    : '20%' 
                }}
              />
            ))}
          </div>

          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-850 text-xs font-mono space-y-1.5">
            <div className="flex justify-between text-zinc-400">
              <span>Administrator:</span>
              <strong className="text-white">{activeAdmin.name} ({activeAdmin.callsign})</strong>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Voice Feedback:</span>
              <strong className={voiceEnabled ? 'text-emerald-400' : 'text-zinc-500'}>
                {voiceEnabled ? 'ACTIVE (UK Accent)' : 'MUTED'}
              </strong>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Human Approval:</span>
              <strong className="text-red-400 font-bold">STRICTLY ENFORCED</strong>
            </div>
          </div>

          {/* Voice & Microphone Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleListen}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wide transition-all flex items-center justify-center gap-2 ${
                isListening
                  ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-900/40 animate-pulse'
                  : 'bg-red-800 hover:bg-red-700 text-white shadow-lg shadow-red-900/30'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              <span>{isListening ? 'Listening...' : 'Voice Input (PTT)'}</span>
            </button>

            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={`p-2.5 rounded-xl border transition-all ${
                voiceEnabled
                  ? 'bg-zinc-850 border-emerald-800/50 text-emerald-400'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'
              }`}
              title={voiceEnabled ? 'Mute Jarvis voice' : 'Enable spoken feedback'}
            >
              {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Right (2 Cols): Live Tactical Chat Stream & Human Approval Prompts */}
      <div className="lg:col-span-2 rounded-2xl border border-zinc-800 bg-zinc-900/90 flex flex-col h-[650px] shadow-2xl overflow-hidden">
        {/* Chat Stream Header */}
        <div className="p-3.5 border-b border-zinc-800 bg-zinc-950/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-red-400" />
            <span className="font-bold text-zinc-200">Jarvis Tactical Operations Console</span>
          </div>
          <span className="text-[11px] font-mono text-zinc-500">Autonomous Copilot</span>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div 
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500 mb-1">
                  <span>{isUser ? activeAdmin.name : 'Jarvis Templar'}</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div className={`p-3.5 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                  isUser 
                    ? 'bg-red-800 text-white rounded-tr-none shadow-md' 
                    : 'bg-zinc-950 border border-zinc-800 text-zinc-200 rounded-tl-none shadow-md'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Attachment preview if user uploaded image */}
                  {msg.attachments && msg.attachments.length > 0 && msg.attachments[0].content && (
                    <div className="mt-2 rounded-lg overflow-hidden border border-zinc-800 max-w-xs">
                      <img 
                        src={msg.attachments[0].content} 
                        alt="Multimodal scan" 
                        className="w-full h-auto object-cover" 
                      />
                    </div>
                  )}

                  {/* Inline Human Approval Gate */}
                  {msg.pendingApproval && msg.pendingApproval.status === 'pending' && (
                    <div className="mt-3 p-3 rounded-xl bg-red-950/50 border border-red-800/80 text-xs">
                      <div className="flex items-center gap-2 text-red-300 font-bold mb-1">
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                        <span>HUMAN APPROVAL REQUIRED BEFORE EXECUTION</span>
                      </div>
                      <p className="text-[11px] text-zinc-300 mb-2">
                        {msg.pendingApproval.description}
                      </p>
                      
                      <div className="flex items-center gap-2 pt-2 border-t border-red-900/40">
                        <button
                          onClick={() => onExecuteApproval(msg.pendingApproval!, 'approve')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1 active:scale-95"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Authorize as {activeAdmin.name}</span>
                        </button>
                        <button
                          onClick={() => onExecuteApproval(msg.pendingApproval!, 'reject')}
                          className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-xs active:scale-95"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-red-400" />
              <span>Jarvis evaluating tactical parameters...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2 border-t border-zinc-800/60 bg-zinc-950/40 flex items-center gap-1.5 overflow-x-auto text-[11px]">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => onSendMessage(prompt)}
              className="px-2.5 py-1 rounded-full bg-zinc-850 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 whitespace-nowrap transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Selected Image Preview */}
        {selectedImage && (
          <div className="px-4 py-2 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between text-xs">
            <span className="text-zinc-400 font-mono">Image attached for optical analysis</span>
            <button onClick={() => setSelectedImage(null)} className="text-zinc-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Chat Input Console */}
        <form onSubmit={handleSubmit} className="p-3 border-t border-zinc-800 bg-zinc-950 flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-zinc-200 border border-zinc-800 transition-colors"
            title="Attach weapon or chrono photo"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Instruct Jarvis Templar as ${activeAdmin.name}...`}
            className="flex-1 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:border-red-600 focus:outline-none"
          />

          <button
            type="submit"
            disabled={(!inputText.trim() && !selectedImage) || isLoading}
            className="p-2 rounded-xl bg-red-800 hover:bg-red-700 disabled:opacity-40 text-white transition-all active:scale-95 shadow-md shadow-red-900/30"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
