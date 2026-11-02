import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  ShieldCheck, 
  BookOpen, 
  Cpu, 
  X, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Award
} from 'lucide-react';
import { IntelligenceDocument, TemplarAdmin, Agent } from '../../types';

interface IntelligenceDepartmentProps {
  intelligence: IntelligenceDocument[];
  activeAdmin: TemplarAdmin;
}

export const IntelligenceDepartment: React.FC<IntelligenceDepartmentProps> = ({
  intelligence,
  activeAdmin
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<IntelligenceDocument | null>(null);

  const airsoftSpecialistAgents: Agent[] = [
    {
      id: 'agent-chrono',
      name: 'Chrono Sentinel',
      role: 'FPS & Kinetic Energy Compliance',
      avatar: '🎯',
      status: 'ready',
      specialty: 'Calculates exact Joules across 0.20g/0.25g/0.28g BBs. Enforces UK 350/450/500 FPS caps.',
      confidence: 0.99
    },
    {
      id: 'agent-ukara',
      name: 'UKARA Compliance Officer',
      role: 'VCRA 2006 Statutory Defense Auditor',
      avatar: '⚖️',
      status: 'ready',
      specialty: 'Validates 3 games in >= 56 days criteria and authenticates player membership database entries.',
      confidence: 0.98
    },
    {
      id: 'agent-marshal-lead',
      name: 'Woodland Tactics Director',
      role: 'Scenario & Safety Coordinator',
      avatar: '🌲',
      status: 'ready',
      specialty: 'Formulates balanced game scenarios (Outpost Assault, VIP Down) and emergency blind-man radio protocols.',
      confidence: 0.97
    },
    {
      id: 'agent-commercial',
      name: 'Commercial Revenue Strategist',
      role: 'Event Margin & Rental Kit Allocator',
      avatar: '💷',
      status: 'ready',
      specialty: 'Monitors £1,200/mo site lease amortization and optimizes walk-on vs full-hire package upsells.',
      confidence: 0.96
    }
  ];

  const filteredDocs = intelligence.filter(d => 
    d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800 p-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-purple-950/60 text-purple-300 border border-purple-800/40 font-bold">
            DEPARTMENT 08 • INTELLIGENCE & SOPS
          </span>
          <span className="text-zinc-500 text-xs font-mono">UKARA, VCRA 2006 & Operations Manual</span>
        </div>
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <span>Searchable Airsoft Knowledge Base & Specialist AI Agents</span>
        </h2>
        <p className="text-xs text-zinc-400 mt-0.5">
          Authoritative operating procedures, field safety policies, and legal statutory defense guidelines.
        </p>
      </div>

      {/* Specialist AI Agents Grid */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/90 p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-purple-400" />
            <h3 className="font-bold text-sm text-zinc-100">Specialist Operational AI Swarm</h3>
          </div>
          <span className="text-[10px] font-mono text-emerald-400">4 Specialists Calibrated</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {airsoftSpecialistAgents.map((agent) => (
            <div key={agent.id} className="p-3.5 rounded-xl bg-zinc-850/80 border border-zinc-800 flex flex-col justify-between text-xs">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl">{agent.avatar}</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                    ONLINE
                  </span>
                </div>
                <h4 className="font-bold text-white text-xs">{agent.name}</h4>
                <div className="text-[10px] text-purple-300 font-mono mt-0.5">{agent.role}</div>
                <p className="text-[11px] text-zinc-400 mt-2 leading-relaxed">{agent.specialty}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                <span>Confidence:</span>
                <strong className="text-emerald-400">{(agent.confidence * 100).toFixed(0)}%</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search and Document Repository */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3 p-3 bg-zinc-900/80 rounded-xl border border-zinc-800">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search SOPs, UKARA, chrono rules, blind man..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 focus:border-red-600 focus:outline-none"
            />
          </div>
          <span className="text-xs font-mono text-zinc-500">{filteredDocs.length} Documents Available</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              onClick={() => setSelectedDoc(doc)}
              className="group cursor-pointer rounded-xl bg-zinc-900/90 border border-zinc-800 hover:border-red-900/60 p-4 transition-all hover:bg-zinc-850 flex flex-col justify-between shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-zinc-800 text-zinc-300 border border-zinc-700">
                    {doc.category.toUpperCase()}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">v{doc.version}</span>
                </div>

                <h4 className="font-bold text-white text-xs mb-1.5 group-hover:text-red-300 transition-colors">
                  {doc.title}
                </h4>
                <p className="text-[11px] text-zinc-400 leading-relaxed line-clamp-3">
                  {doc.summary}
                </p>
              </div>

              <div className="mt-4 pt-2.5 border-t border-zinc-800/60 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                <span>Updated: {doc.lastUpdated}</span>
                <span className="flex items-center gap-1 text-red-400 font-bold group-hover:translate-x-0.5 transition-transform">
                  Read SOP <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Document Reader Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[85vh] rounded-2xl bg-zinc-900 border border-zinc-800 p-6 shadow-2xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-red-400 block mb-0.5">
                  TEMPLARS AIRSOFT UK • SOP DOCUMENTATION (v{selectedDoc.version})
                </span>
                <h3 className="font-bold text-base text-white">{selectedDoc.title}</h3>
              </div>
              <button onClick={() => setSelectedDoc(null)} className="text-zinc-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4 text-xs font-mono text-zinc-300 whitespace-pre-wrap leading-relaxed bg-zinc-950 p-4 rounded-xl border border-zinc-850">
              {selectedDoc.fullText}
            </div>

            <div className="pt-4 border-t border-zinc-800 mt-4 flex items-center justify-between text-xs text-zinc-500">
              <span>Tags: {selectedDoc.tags.join(', ')}</span>
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-1.5 rounded-lg bg-red-800 hover:bg-red-700 text-white font-bold"
              >
                Close Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
