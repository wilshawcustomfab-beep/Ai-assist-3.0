import React, { useRef, useEffect, useState } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  ShieldCheck, 
  Cpu,
  Layers,
  Check
} from 'lucide-react';
import { CompanionState, CompanionMood, UserPreferences, ActiveHarness, ActiveCompanion } from '../types';

interface LunaAvatarStageProps {
  state: CompanionState;
  mood: CompanionMood;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  isListening: boolean;
  onToggleListen: () => void;
  preferences: UserPreferences;
  onOpenPreferences?: () => void;
  activeSpecialist?: string;
  activeHarness: ActiveHarness;
  activeAi: ActiveCompanion;
  onToggleAi?: (ai: ActiveCompanion) => void;
}

export const LunaAvatarStage: React.FC<LunaAvatarStageProps> = ({
  state,
  mood,
  voiceEnabled,
  onToggleVoice,
  isListening,
  onToggleListen,
  preferences,
  onOpenPreferences,
  activeSpecialist,
  activeHarness,
  activeAi,
  onToggleAi
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  // Canvas visual rendering of Cindy / Companion Sentient Holographic Presence
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let t = 0;

    const render = () => {
      t += 0.025;
      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;

      ctx.clearRect(0, 0, width, height);

      // Cindy primary theme: Vibrant Rose/Coral/Violet; Luna theme: Cyan/Blue
      const isCindy = activeAi === 'cindy';

      let glowColor = isCindy ? 'rgba(244, 63, 94, 0.18)' : 'rgba(6, 182, 212, 0.15)'; // Rose or Cyan
      if (state === 'listening') glowColor = 'rgba(16, 185, 129, 0.25)'; // Emerald
      if (state === 'thinking') glowColor = isCindy ? 'rgba(217, 70, 239, 0.25)' : 'rgba(168, 85, 247, 0.25)'; // Fuchsia or Purple
      if (state === 'speaking') glowColor = isCindy ? 'rgba(251, 113, 133, 0.32)' : 'rgba(56, 189, 248, 0.3)'; // Coral or Sky blue
      if (state === 'executing') glowColor = 'rgba(234, 179, 8, 0.25)'; // Gold
      if (state === 'error') glowColor = 'rgba(239, 68, 68, 0.25)';

      const bgGradient = ctx.createRadialGradient(cx, cy, 20, cx, cy, 180);
      bgGradient.addColorStop(0, glowColor);
      bgGradient.addColorStop(1, 'rgba(15, 23, 42, 0)');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // Quantum Neural Orbit Rings
      const ringCount = 3;
      for (let i = 0; i < ringCount; i++) {
        ctx.save();
        ctx.translate(cx, cy);
        const rotSpeed = (i % 2 === 0 ? 1 : -1) * (0.45 + i * 0.15);
        ctx.rotate(t * rotSpeed);

        const radiusX = 90 + i * 22 + (state === 'speaking' ? Math.sin(t * 8) * 8 : Math.sin(t * 2) * 3);
        const radiusY = 55 + i * 14 + (state === 'listening' ? Math.cos(t * 6) * 6 : Math.cos(t * 2) * 2);

        ctx.beginPath();
        ctx.ellipse(0, 0, radiusX, radiusY, (i * Math.PI) / 3, 0, Math.PI * 2);
        ctx.strokeStyle = isCindy 
          ? (i === 0 ? 'rgba(251, 113, 133, 0.45)' : i === 1 ? 'rgba(192, 132, 252, 0.35)' : 'rgba(244, 63, 94, 0.25)')
          : (i === 0 ? 'rgba(56, 189, 248, 0.4)' : i === 1 ? 'rgba(168, 85, 247, 0.3)' : 'rgba(6, 182, 212, 0.2)');
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 6]);
        ctx.stroke();

        const orbAngle = t * rotSpeed * 1.5;
        const ox = Math.cos(orbAngle) * radiusX;
        const oy = Math.sin(orbAngle) * radiusY;
        ctx.beginPath();
        ctx.arc(ox, oy, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = isCindy ? '#fb7185' : '#38bdf8';
        ctx.fill();

        ctx.restore();
      }

      // Central Sentient Hologram Core
      ctx.save();
      ctx.translate(cx, cy);

      const breathing = Math.sin(t * 2) * 3;
      ctx.translate(0, breathing);

      // Outer Core Halo
      const coreHalo = ctx.createRadialGradient(0, 0, 10, 0, 0, 75);
      coreHalo.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      coreHalo.addColorStop(0.35, isCindy ? 'rgba(244, 63, 94, 0.75)' : 'rgba(56, 189, 248, 0.7)');
      coreHalo.addColorStop(0.7, isCindy ? 'rgba(168, 85, 247, 0.4)' : 'rgba(147, 51, 234, 0.35)');
      coreHalo.addColorStop(1, 'rgba(2, 6, 23, 0)');

      ctx.beginPath();
      ctx.arc(0, 0, 70, 0, Math.PI * 2);
      ctx.fillStyle = coreHalo;
      ctx.fill();

      // Holographic Face Grid Mask
      ctx.beginPath();
      ctx.ellipse(0, -5, 46, 56, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
      ctx.fill();
      ctx.strokeStyle = isCindy ? 'rgba(244, 63, 94, 0.65)' : 'rgba(56, 189, 248, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Eyes with Gaze Vector
      const gazeX = mousePos.x * 5;
      const gazeY = mousePos.y * 4;
      const eyeSpacing = 16;
      const eyeY = -12;
      const blink = Math.sin(t * 0.7) > 0.96 ? 0.15 : 1.0;

      // Left Eye
      ctx.save();
      ctx.translate(-eyeSpacing + gazeX, eyeY + gazeY);
      ctx.scale(1, blink);
      ctx.beginPath();
      ctx.ellipse(0, 0, 6, 4, 0, 0, Math.PI * 2);
      ctx.fillStyle = isCindy ? '#fb7185' : '#38bdf8';
      ctx.shadowColor = isCindy ? '#fb7185' : '#38bdf8';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(0.5, 0, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.restore();

      // Right Eye
      ctx.save();
      ctx.translate(eyeSpacing + gazeX, eyeY + gazeY);
      ctx.scale(1, blink);
      ctx.beginPath();
      ctx.ellipse(0, 0, 6, 4, 0, 0, Math.PI * 2);
      ctx.fillStyle = isCindy ? '#fb7185' : '#38bdf8';
      ctx.shadowColor = isCindy ? '#fb7185' : '#38bdf8';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(0.5, 0, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.restore();

      // Mouth / Waveform
      const mouthY = 16;
      if (state === 'speaking') {
        const mouthOpen = 4 + Math.abs(Math.sin(t * 12)) * 6;
        ctx.beginPath();
        ctx.ellipse(0, mouthY, 9, mouthOpen, 0, 0, Math.PI * 2);
        ctx.fillStyle = isCindy ? 'rgba(251, 113, 133, 0.85)' : 'rgba(56, 189, 248, 0.8)';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();
      } else if (state === 'listening') {
        ctx.beginPath();
        ctx.moveTo(-12, mouthY);
        for (let x = -12; x <= 12; x += 4) {
          const waveHeight = Math.sin(x * 0.5 + t * 10) * 3;
          ctx.lineTo(x, mouthY + waveHeight);
        }
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(0, mouthY - 4, 10, 0.2 * Math.PI, 0.8 * Math.PI, false);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [state, mood, mousePos, activeAi]);

  const getStatusBadge = () => {
    switch (state) {
      case 'listening':
        return { label: 'Listening to Voice...', color: 'text-emerald-400 border-emerald-800 bg-emerald-950/60' };
      case 'thinking':
        return { label: 'Synthesizing Solution...', color: 'text-pink-400 border-pink-800 bg-pink-950/60' };
      case 'speaking':
        return { label: 'Speaking (Voice Output)', color: 'text-rose-300 border-rose-800 bg-rose-950/60' };
      case 'executing':
        return { label: `Harness Executing: ${activeHarness.toUpperCase()}`, color: 'text-amber-400 border-amber-800 bg-amber-950/60' };
      case 'error':
        return { label: 'Attention Required', color: 'text-rose-400 border-rose-800 bg-rose-950/60' };
      default:
        return { label: 'Ready: "Consider it done"', color: 'text-rose-300 border-rose-800/60 bg-slate-900/80' };
    }
  };

  const statusBadge = getStatusBadge();

  return (
    <div 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative rounded-2xl bg-gradient-to-b from-slate-900/90 via-slate-950/95 to-slate-950 border border-slate-800/90 p-5 shadow-2xl flex flex-col items-center justify-between overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none"></div>

      {/* Top HUD: Identity & Companion Selector */}
      <div className="w-full flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></div>
          <span className="text-xs font-mono font-bold tracking-wider text-white">
            {activeAi === 'cindy' ? 'CINDY AI' : 'LUNA AI'}
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-[10px] text-rose-300 font-mono capitalize">
            {activeHarness}
          </span>
        </div>

        {/* AI Companion Switch (Cindy vs Luna) */}
        {onToggleAi && (
          <div className="flex items-center gap-1 p-0.5 bg-slate-900 border border-slate-800 rounded-md text-[10px] font-mono">
            <button
              onClick={() => onToggleAi('cindy')}
              className={`px-2 py-0.5 rounded transition-colors ${
                activeAi === 'cindy' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Cindy (Main)
            </button>
            <button
              onClick={() => onToggleAi('luna')}
              className={`px-2 py-0.5 rounded transition-colors ${
                activeAi === 'luna' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Luna
            </button>
          </div>
        )}
      </div>

      {/* Holographic Avatar Canvas */}
      <div className="relative my-2 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={320}
          height={260}
          className="w-[280px] h-[220px] sm:w-[320px] sm:h-[250px] object-contain drop-shadow-[0_0_35px_rgba(244,63,94,0.35)]"
        />

        {/* Floating Status Badge */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <div className={`px-3 py-1 rounded-full border text-[11px] font-mono tracking-wide shadow-lg flex items-center gap-1.5 ${statusBadge.color}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping"></span>
            <span>{statusBadge.label}</span>
          </div>
        </div>
      </div>

      {/* Bottom Controls Bar */}
      <div className="w-full pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3 z-10">
        <button
          onClick={onToggleListen}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${
            isListening
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400 shadow-md shadow-emerald-950/40 animate-pulse'
              : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700/80 hover:border-rose-500/40'
          }`}
          title={isListening ? 'Click to stop listening' : 'Click to speak to Cindy'}
        >
          {isListening ? <Mic className="w-4 h-4 text-white" /> : <MicOff className="w-4 h-4 text-slate-400" />}
          <span>{isListening ? 'Listening...' : 'Push to Talk'}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleVoice}
            className={`p-2 rounded-lg border text-xs transition-colors ${
              voiceEnabled
                ? 'bg-rose-950/60 border-rose-700/60 text-rose-300'
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
            title={voiceEnabled ? 'Spoken Voice Output Enabled' : 'Spoken Voice Output Muted'}
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {onOpenPreferences && (
            <button
              onClick={onOpenPreferences}
              className="px-2.5 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900 text-slate-400 hover:text-slate-200 text-xs font-mono transition-colors"
              title="Personalized Preferences"
            >
              Config
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
