import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { CommandCentre } from './components/departments/CommandCentre';
import { ArmouryDepartment } from './components/departments/ArmouryDepartment';
import { OperationsDepartment } from './components/departments/OperationsDepartment';
import { CustomerCRMDepartment } from './components/departments/CustomerCRMDepartment';
import { FinanceDepartment } from './components/departments/FinanceDepartment';
import { MediaStudioDepartment } from './components/departments/MediaStudioDepartment';
import { MarketingDepartment } from './components/departments/MarketingDepartment';
import { IntelligenceDepartment } from './components/departments/IntelligenceDepartment';
import { JarvisTacticalHUD } from './components/JarvisTacticalHUD';
import { HumanApprovalModal } from './components/HumanApprovalModal';
import { ThreeLiveBrainGraph } from './components/ThreeLiveBrainGraph';
import { CindySurroundingsVisionHub } from './components/CindySurroundingsVisionHub';
import { DeterministicMotionStudio } from './components/DeterministicMotionStudio';
import { 
  DepartmentTab, 
  TemplarAdmin, 
  ArmouryItem, 
  ConsumableStock, 
  BookingRecord, 
  FinanceTransaction, 
  OperationalDayEvent, 
  MediaPostDraft, 
  MarketingCampaign, 
  IntelligenceDocument, 
  PendingApprovalAction, 
  OperationalAlert, 
  ChatMessage, 
  MessageAttachment 
} from './types';
import { testFirestoreConnection } from './services/firebase';
import { AlertOctagon, X, Volume2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<DepartmentTab>('command');
  const [admins, setAdmins] = useState<TemplarAdmin[]>([
    {
      id: 'admin-paul',
      name: 'Paul',
      callsign: 'Templar 1 (Actual)',
      role: 'manager',
      roleTitle: 'Site Manager & Commercial Director',
      permissions: ['all'],
      badge: 'MANAGER',
      avatar: '👑'
    },
    {
      id: 'admin-storm',
      name: 'Storm',
      callsign: 'Templar 2 (Head Marshal)',
      role: 'head_marshal',
      roleTitle: 'Head Marshal & Operations Lead',
      permissions: ['operations:write', 'armoury:write'],
      badge: 'HEAD MARSHAL',
      avatar: '⚡'
    }
  ]);

  const [activeAdmin, setActiveAdmin] = useState<TemplarAdmin>(admins[0]);
  const [armoury, setArmoury] = useState<ArmouryItem[]>([]);
  const [consumables, setConsumables] = useState<ConsumableStock[]>([]);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [finance, setFinance] = useState<FinanceTransaction[]>([]);
  const [operations, setOperations] = useState<OperationalDayEvent | null>(null);
  const [mediaDrafts, setMediaDrafts] = useState<MediaPostDraft[]>([]);
  const [marketing, setMarketing] = useState<MarketingCampaign[]>([]);
  const [intelligence, setIntelligence] = useState<IntelligenceDocument[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<PendingApprovalAction[]>([]);
  const [alerts, setAlerts] = useState<OperationalAlert[]>([]);

  // Emergency Ceasefire ("BLIND MAN") State
  const [blindManActive, setBlindManActive] = useState(false);

  // Active Human Approval Modal Action
  const [selectedApprovalModalAction, setSelectedApprovalModalAction] = useState<PendingApprovalAction | null>(null);

  // Jarvis Voice & Chat State
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [companionState, setCompanionState] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-jarvis',
      sender: 'jarvis',
      text: "Jarvis Templar online. Welcome, Paul. Command grid synchronized across all 8 departments.\n\nAll systems primed for Sunday's woodland skirmish (40 acres). Chrono station certified for 350 FPS (AEG) and 450/500 FPS (DMR/Sniper with 30m MED). How may I assist your operations today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const recognitionRef = useRef<any>(null);

  // Fetch full state from backend on mount
  const fetchState = async () => {
    try {
      const res = await fetch('/api/templar/state');
      const data = await res.json();
      if (data.admins) setAdmins(data.admins);
      if (data.armoury) setArmoury(data.armoury);
      if (data.consumables) setConsumables(data.consumables);
      if (data.bookings) setBookings(data.bookings);
      if (data.finance) setFinance(data.finance);
      if (data.operations) setOperations(data.operations);
      if (data.media) setMediaDrafts(data.media);
      if (data.marketing) setMarketing(data.marketing);
      if (data.intelligence) setIntelligence(data.intelligence);
      if (data.pendingApprovals) setPendingApprovals(data.pendingApprovals);
      if (data.alerts) setAlerts(data.alerts);
    } catch (err) {
      console.warn('Failed to load Templars Airsoft state:', err);
    }
  };

  useEffect(() => {
    fetchState();
    testFirestoreConnection().catch(() => {});
  }, []);

  // Switch between Paul and Storm
  const handleSwitchAdmin = (name: 'Paul' | 'Storm') => {
    const target = admins.find(a => a.name === name) || admins[0];
    setActiveAdmin(target);
    const greeting = name === 'Storm'
      ? `Command transfer confirmed. Welcome Head Marshal Storm. Armoury and woodland marshal rotas are on your active channel.`
      : `Command transfer confirmed. Welcome Site Manager Paul. Commercial P&L, customer booking CRM, and marketing funnels ready.`;
    
    setMessages(prev => [
      ...prev,
      {
        id: `switch-${Date.now()}`,
        sender: 'jarvis',
        text: greeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    speakText(greeting);
  };

  // Trigger Emergency Ceasefire ("BLIND MAN")
  const handleTriggerBlindMan = () => {
    setBlindManActive(true);
    // Play alert beep via Web Audio API
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch (e) {}

    const announcement = 'EMERGENCY CEASEFIRE INITIATED: BLIND MAN CALLED. ALL PLAYERS CEASE FIRE, CLEAR CHAMBERS AND HOLD GROUND.';
    speakText(announcement);
  };

  // Text-To-Speech Synthesis (UK Voice Preference)
  const speakText = (text: string) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      setCompanionState('speaking');

      const cleaned = text
        .replace(/[*#`_~]/g, '')
        .replace(/```[\s\S]*?```/g, 'Code block omitted.')
        .slice(0, 300);

      const utterance = new SpeechSynthesisUtterance(cleaned);
      utterance.pitch = 0.95;
      utterance.rate = 1.05;

      // Select British English voice if available
      const voices = window.speechSynthesis.getVoices();
      const ukVoice = voices.find(v => v.lang === 'en-GB' || v.lang.startsWith('en_GB'));
      if (ukVoice) utterance.voice = ukVoice;

      utterance.onend = () => setCompanionState('idle');
      utterance.onerror = () => setCompanionState('idle');

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
      setCompanionState('idle');
    }
  };

  // Toggle Microphone Input (Speech Recognition)
  const handleToggleListen = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setMessages(prev => [
        ...prev,
        {
          id: `speech-unsupported-${Date.now()}`,
          sender: 'system',
          text: 'Speech recognition is not supported in this browser. Please type into the console below.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      setCompanionState('idle');
      return;
    }

    try {
      const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRec();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-GB';

      recognition.onstart = () => {
        setIsListening(true);
        setCompanionState('listening');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        setCompanionState('idle');
        handleSendMessage(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
        setCompanionState('idle');
      };

      recognition.onend = () => {
        setIsListening(false);
        setCompanionState('idle');
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn('Speech recognition failed to start:', err);
      setIsListening(false);
      setCompanionState('idle');
    }
  };

  // Send message to central Jarvis Templar AI Endpoint
  const handleSendMessage = async (text: string, attachment?: MessageAttachment) => {
    if (!text.trim() && !attachment) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      attachments: attachment ? [attachment] : undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoadingAi(true);
    setCompanionState('thinking');

    try {
      const res = await fetch('/api/templar/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          activeAdmin: activeAdmin.name,
          department: activeTab,
          attachments: attachment ? [attachment] : []
        })
      });

      const data = await res.json();
      if (data.success) {
        const jarvisMsg: ChatMessage = {
          id: `msg-${Date.now()}`,
          sender: 'jarvis',
          text: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedAction: data.suggestedAction,
          pendingApproval: data.pendingApproval
        };
        setMessages(prev => [...prev, jarvisMsg]);
        speakText(data.text);
        fetchState();
      } else {
        throw new Error(data.error || 'Failed to receive Jarvis response');
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: 'system',
        text: `Command error: ${err?.message || 'Unable to reach Jarvis Templar'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoadingAi(false);
      setCompanionState('idle');
    }
  };

  // Execute Human Approval Action (Approve / Reject)
  const handleExecuteApproval = async (action: PendingApprovalAction, decision: 'approve' | 'reject') => {
    try {
      const res = await fetch('/api/templar/approvals/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: action.id,
          action: decision,
          actor: activeAdmin.name
        })
      });
      const data = await res.json();
      if (data.success) {
        setSelectedApprovalModalAction(null);
        fetchState();
        setMessages(prev => [
          ...prev,
          {
            id: `appr-done-${Date.now()}`,
            sender: 'jarvis',
            text: `Action executed: ${data.message} ${data.executionDetails || ''}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        speakText(`Action ${decision === 'approve' ? 'authorized and committed' : 'rejected'} by ${activeAdmin.name}.`);
      }
    } catch (err) {
      console.warn('Approval action failed:', err);
    }
  };

  // Quick Green Fee entry helper
  const handleQuickGreenFee = async () => {
    try {
      await fetch('/api/templar/finance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'income',
          category: 'green_fees',
          amount: 25.00,
          description: `Walk-on player green fee (£25.00) recorded by ${activeAdmin.name}`,
          paymentMethod: 'card',
          actor: activeAdmin.name
        })
      });
      fetchState();
      speakText('Walk on green fee of 25 pounds recorded to ledger.');
    } catch (e) {}
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans selection:bg-red-900/40 selection:text-red-200 pb-20 lg:pb-8">
      {/* Emergency Ceasefire ("BLIND MAN") Banner */}
      {blindManActive && (
        <div className="bg-red-600 text-white px-4 py-3 shadow-2xl flex items-center justify-between sticky top-0 z-50 animate-pulse border-b-2 border-white">
          <div className="flex items-center gap-3">
            <AlertOctagon className="w-6 h-6 animate-spin text-white" />
            <div>
              <strong className="font-black text-sm uppercase tracking-wider block">
                SITEWIDE CEASEFIRE ACTIVE • "BLIND MAN" BROADCAST
              </strong>
              <span className="text-xs">
                All players must cease fire, clear chambers, and point barrels to ground. Marshals deploying on PMR Ch 1.
              </span>
            </div>
          </div>
          <button
            onClick={() => setBlindManActive(false)}
            className="px-3 py-1.5 rounded-lg bg-black hover:bg-zinc-900 text-white font-bold text-xs uppercase tracking-wider border border-white/50 active:scale-95"
          >
            Clear "Game On"
          </button>
        </div>
      )}

      {/* Tactical Top Header & Bottom Nav */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeAdmin={activeAdmin}
        onSwitchAdmin={handleSwitchAdmin}
        onTriggerBlindMan={handleTriggerBlindMan}
        pendingApprovalsCount={pendingApprovals.filter(p => p.status === 'pending').length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8">
        {/* Department 1: Command Centre */}
        {activeTab === 'command' && operations && (
          <CommandCentre
            activeAdmin={activeAdmin}
            bookings={bookings}
            armoury={armoury}
            finance={finance}
            operations={operations}
            alerts={alerts}
            pendingApprovals={pendingApprovals}
            onNavigateDepartment={(dept) => setActiveTab(dept)}
            onOpenApproval={(action) => setSelectedApprovalModalAction(action)}
            onTriggerBlindMan={handleTriggerBlindMan}
            onQuickGreenFee={handleQuickGreenFee}
          />
        )}

        {/* Department 5: Armoury & Inventory */}
        {activeTab === 'armoury' && (
          <ArmouryDepartment
            armoury={armoury}
            consumables={consumables}
            activeAdmin={activeAdmin}
            onRefresh={fetchState}
          />
        )}

        {/* Department 4: Operations & Game-Day */}
        {activeTab === 'operations' && operations && (
          <OperationsDepartment
            operations={operations}
            activeAdmin={activeAdmin}
            onRefresh={fetchState}
          />
        )}

        {/* Department 7: Customer CRM & Bookings */}
        {activeTab === 'crm' && (
          <CustomerCRMDepartment
            bookings={bookings}
            armoury={armoury}
            activeAdmin={activeAdmin}
            onRefresh={fetchState}
          />
        )}

        {/* Department 6: Finance & P&L */}
        {activeTab === 'finance' && (
          <FinanceDepartment
            finance={finance}
            activeAdmin={activeAdmin}
            onRefresh={fetchState}
          />
        )}

        {/* Department 2: Media Studio */}
        {activeTab === 'media' && (
          <MediaStudioDepartment
            mediaDrafts={mediaDrafts}
            activeAdmin={activeAdmin}
            onRefresh={fetchState}
            onRequestApproval={(draft) => {
              const approvalAction: PendingApprovalAction = {
                id: `appr-med-${Date.now()}`,
                actionType: 'publish_media',
                title: `Broadcast ${draft.platform.toUpperCase()} Post "${draft.title}"`,
                description: `Request to publish promotional content to public channels.`,
                department: 'media',
                payload: { draftId: draft.id, title: draft.title, platform: draft.platform },
                requestedBy: activeAdmin.name,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                status: 'pending'
              };
              setPendingApprovals(prev => [approvalAction, ...prev]);
              setSelectedApprovalModalAction(approvalAction);
            }}
          />
        )}

        {/* Department 3: Marketing & Growth */}
        {activeTab === 'marketing' && (
          <MarketingDepartment
            marketing={marketing}
            activeAdmin={activeAdmin}
          />
        )}

        {/* Department 8: Intelligence & SOPs */}
        {activeTab === 'intelligence' && (
          <IntelligenceDepartment
            intelligence={intelligence}
            activeAdmin={activeAdmin}
          />
        )}

        {/* Central Voice-Enabled Jarvis HUD Copilot */}
        {activeTab === ('jarvis' as any) && (
          <JarvisTacticalHUD
            activeAdmin={activeAdmin}
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoadingAi}
            onExecuteApproval={handleExecuteApproval}
            voiceEnabled={voiceEnabled}
            setVoiceEnabled={setVoiceEnabled}
            isListening={isListening}
            onToggleListen={handleToggleListen}
            companionState={companionState}
          />
        )}

        {/* Preserved High-Tech Developer Views */}
        {activeTab === 'brain3d' && (
          <div className="space-y-4">
            <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-white">3D Live Neural Brain Graph</h3>
                <p className="text-xs text-zinc-400">Interactive WebGL tactical node topography for Templars Airsoft UK</p>
              </div>
            </div>
            <ThreeLiveBrainGraph
              onDispatchOpportunity={(action) => {
                setActiveTab('jarvis' as any);
                handleSendMessage(`Jarvis, dispatch tactical action from 3D neural brain graph: ${action}`);
              }}
              onOpenVisionHub={() => setActiveTab('vision')}
            />
          </div>
        )}

        {activeTab === 'vision' && (
          <CindySurroundingsVisionHub
            onDispatchTask={(directive) => {
              setActiveTab('jarvis' as any);
              handleSendMessage(`Jarvis, optical vision inspection directive: ${directive}`);
            }}
            onAnnounceVoice={(text) => speakText(text)}
            onOpenBrain3D={() => setActiveTab('brain3d')}
          />
        )}

        {activeTab === 'motion' && (
          <DeterministicMotionStudio />
        )}
      </main>

      {/* Human Approval Modal Gate */}
      <HumanApprovalModal
        action={selectedApprovalModalAction}
        onClose={() => setSelectedApprovalModalAction(null)}
        onExecute={handleExecuteApproval}
        activeAdmin={activeAdmin}
      />
    </div>
  );
}
