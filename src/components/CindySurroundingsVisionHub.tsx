import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  FlipHorizontal, 
  RefreshCw, 
  Sparkles, 
  Eye, 
  Layers, 
  Maximize2, 
  Minimize2, 
  Sun, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  Zap,
  Shield,
  Activity,
  ScanLine
} from 'lucide-react';
import { VisionScanResult, OpportunityItem } from '../types';

interface CindySurroundingsVisionHubProps {
  onDispatchTask?: (directive: string) => void;
  onAnnounceVoice?: (text: string) => void;
  onOpenBrain3D?: () => void;
}

export const CindySurroundingsVisionHub: React.FC<CindySurroundingsVisionHubProps> = ({
  onDispatchTask,
  onAnnounceVoice,
  onOpenBrain3D
}) => {
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [continuousScan, setContinuousScan] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [lastScanResult, setLastScanResult] = useState<VisionScanResult | null>(null);
  const [capturedSnapshot, setCapturedSnapshot] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<any>(null);

  // Initialize Camera Stream
  const startCamera = async (mode: 'user' | 'environment') => {
    stopCamera();
    setCameraError(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access API is not supported in this browser environment.');
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: mode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setIsCameraActive(true);
        };
      }
    } catch (err: any) {
      console.warn('Camera stream error:', err);
      setCameraError(err.message || 'Unable to access camera.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    startCamera(facingMode);
    return () => {
      stopCamera();
      if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
    };
  }, [facingMode]);

  const toggleFacingMode = () => {
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextMode);
  };

  // Capture current video frame as base64 image
  const captureFrameBase64 = (): string | null => {
    if (!videoRef.current || !isCameraActive) {
      // In fallback mode, generate synthetic high-tech mock camera feed
      const offCanvas = document.createElement('canvas');
      offCanvas.width = 640;
      offCanvas.height = 360;
      const ctx = offCanvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, 640, 360);
        ctx.fillStyle = '#f43f5e';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText('Cindy Surroundings Optical Scanner', 40, 60);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '12px monospace';
        ctx.fillText(`Mode: ${facingMode.toUpperCase()} Camera`, 40, 90);
        ctx.fillText(`Target: Developer Workspace & Display Environment`, 40, 110);
        return offCanvas.toDataURL('image/jpeg');
      }
      return null;
    }

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.85);
  };

  // Trigger Surroundings Vision Analysis
  const handleAnalyzeSurroundings = async (customTextPrompt?: string) => {
    if (isScanning) return;
    setIsScanning(true);

    const frameBase64 = captureFrameBase64();
    if (!frameBase64) {
      setIsScanning(false);
      return;
    }

    setCapturedSnapshot(frameBase64);

    try {
      const response = await fetch('/api/vision/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: frameBase64,
          facingMode,
          prompt: customTextPrompt || customPrompt
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data: VisionScanResult = await response.json();
      setLastScanResult(data);

      if (onAnnounceVoice && data.environmentSummary) {
        onAnnounceVoice(`Cindy visual observation: ${data.environmentSummary.slice(0, 140)}`);
      }
    } catch (err: any) {
      console.error('Surroundings analysis error:', err);
    } finally {
      setIsScanning(false);
    }
  };

  // Continuous Scan Loop
  useEffect(() => {
    if (continuousScan) {
      handleAnalyzeSurroundings();
      scanIntervalRef.current = setInterval(() => {
        handleAnalyzeSurroundings();
      }, 12000); // scan every 12 seconds
    } else {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
        scanIntervalRef.current = null;
      }
    }
    return () => {
      if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
    };
  }, [continuousScan, facingMode]);

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-rose-400" />
              <h2 className="text-lg font-bold text-white tracking-tight">
                Cindy Surroundings & Vision Hub
              </h2>
              <span className="text-xs text-rose-400 font-mono">OPTICAL SENSORS</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Connect to your front and back camera to give Cindy real-time visual perception of your workspace, screens, notes, and environment to detect opportunities.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleFacingMode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
              title="Switch between front (user) and back (environment) camera"
            >
              <FlipHorizontal className="w-3.5 h-3.5 text-rose-400" />
              <span>{facingMode === 'user' ? 'Front Camera' : 'Back Camera'}</span>
            </button>

            {onOpenBrain3D && (
              <button
                onClick={onOpenBrain3D}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-medium border border-slate-700 transition-colors"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>View 3D Brains</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Live Camera Stream Viewport + Vision Telemetry & Opportunity Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Camera Viewport with Cyber HUD Overlay */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative">
          <div className="relative aspect-video bg-slate-950 flex items-center justify-center overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                isCameraActive ? 'opacity-100' : 'opacity-0'
              } ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
            />

            {/* Fallback View if camera is denied or inactive */}
            {!isCameraActive && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-950/95 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-950/60 border border-rose-800/80 flex items-center justify-center text-rose-400">
                  <Camera className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-200">
                    {cameraError ? 'Camera Unavailable' : 'Activating Optical Sensors...'}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm">
                    {cameraError 
                      ? `${cameraError} You can still run simulated surroundings audits or click retry below.`
                      : 'Connecting to physical camera video feed...'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startCamera(facingMode)}
                    className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium transition-colors"
                  >
                    Retry Permission
                  </button>
                  <button
                    onClick={() => handleAnalyzeSurroundings()}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
                  >
                    Run Test Environment Scan
                  </button>
                </div>
              </div>
            )}

            {/* Cyberpunk Optical HUD Overlay */}
            <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between">
              {/* Top HUD bar */}
              <div className="flex items-center justify-between text-[11px] font-mono">
                <div className="flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded border border-slate-800 text-rose-400">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                  <span>OPTICAL SCANNER: {facingMode.toUpperCase()}</span>
                </div>

                <div className="flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded border border-slate-800 text-slate-400">
                  <span>RES: 1080P</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-emerald-400">FPS: 30</span>
                </div>
              </div>

              {/* Center Targeting Reticle */}
              <div className="relative self-center w-36 h-36 border border-rose-500/30 rounded-2xl flex items-center justify-center">
                <div className="w-8 h-8 border-t-2 border-l-2 border-rose-400 absolute top-0 left-0"></div>
                <div className="w-8 h-8 border-t-2 border-r-2 border-rose-400 absolute top-0 right-0"></div>
                <div className="w-8 h-8 border-b-2 border-l-2 border-rose-400 absolute bottom-0 left-0"></div>
                <div className="w-8 h-8 border-b-2 border-r-2 border-rose-400 absolute bottom-0 right-0"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></div>

                {isScanning && (
                  <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-rose-400 to-transparent animate-bounce"></div>
                )}
              </div>

              {/* Bottom HUD bar */}
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded border border-slate-800">
                <span>CINDY VISION AI</span>
                <span>SPECTRAL: RGB</span>
                <span>STATUS: {isScanning ? 'ANALYZING SURROUNDINGS...' : 'STANDBY'}</span>
              </div>
            </div>
          </div>

          {/* Camera Action Controls */}
          <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleAnalyzeSurroundings()}
                disabled={isScanning}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 disabled:opacity-50 text-white font-medium text-xs flex items-center gap-1.5 shadow-md shadow-rose-950/40 transition-colors cursor-pointer"
              >
                {isScanning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{isScanning ? 'Inspecting Environment...' : 'Scan Surroundings Now'}</span>
              </button>

              <button
                onClick={() => setContinuousScan(!continuousScan)}
                className={`px-3 py-2 rounded-lg border text-xs font-medium transition-colors flex items-center gap-1.5 ${
                  continuousScan
                    ? 'bg-rose-950/80 border-rose-700 text-rose-300 animate-pulse'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                }`}
                title="Automatically scan surroundings every 12 seconds"
              >
                <ScanLine className="w-3.5 h-3.5" />
                <span>{continuousScan ? 'Auto-Scan Active' : 'Auto-Scan Loop'}</span>
              </button>
            </div>

            <button
              onClick={toggleFacingMode}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5"
            >
              <FlipHorizontal className="w-3.5 h-3.5 text-rose-400" />
              <span>Flip to {facingMode === 'user' ? 'Back / Environment' : 'Front / User'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Real-Time Environmental Vision Telemetry & Opportunities */}
        <div className="lg:col-span-5 space-y-4">
          {/* Surroundings Summary Card */}
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-rose-400" />
                <h3 className="text-sm font-bold text-white">Surroundings Perception</h3>
              </div>
              {lastScanResult && (
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Synced
                </span>
              )}
            </div>

            {lastScanResult ? (
              <div className="space-y-3">
                <div>
                  <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                    Environment Context:
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800 font-sans">
                    {lastScanResult.environmentSummary}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1.5">
                    Detected Entities in Field of View:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {lastScanResult.detectedEntities.map((ent, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-mono text-rose-300 bg-rose-950/60 border border-rose-800/60 px-2.5 py-0.5 rounded-full"
                      >
                        {ent}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                  <span>Lighting: <strong className="text-slate-200">{lastScanResult.lighting}</strong></span>
                  <span className="font-mono text-[10px]">
                    {new Date(lastScanResult.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 text-xs">
                Click "Scan Surroundings Now" to let Cindy perceive your workspace and identify opportunities.
              </div>
            )}
          </div>

          {/* Detected Opportunities Stream */}
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Visual Tactical Opportunities</h3>
              </div>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/50">
                ACTIVE
              </span>
            </div>

            <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
              {lastScanResult?.opportunities && lastScanResult.opportunities.length > 0 ? (
                lastScanResult.opportunities.map((opp, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-rose-500/40 transition-colors space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-semibold text-rose-300">{opp.title}</h4>
                      <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                        {opp.impact}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {opp.description}
                    </p>

                    {onDispatchTask && (
                      <div className="pt-1.5 flex justify-end">
                        <button
                          onClick={() => onDispatchTask(opp.suggestedAction)}
                          className="text-[11px] font-medium text-rose-300 hover:text-white bg-rose-950/80 hover:bg-rose-900 border border-rose-800/80 px-2.5 py-1 rounded transition-colors flex items-center gap-1"
                        >
                          <span>{opp.suggestedAction}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-500 text-center py-6">
                  No visual opportunities detected yet. Perform a surroundings scan to reveal actionable steps.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
