import React from 'react';
import { 
  Shield, 
  Crosshair, 
  Calendar, 
  Users, 
  PoundSterling, 
  Film, 
  TrendingUp, 
  BookOpen, 
  Mic, 
  Orbit, 
  Camera, 
  Activity, 
  AlertOctagon, 
  Radio,
  UserCheck
} from 'lucide-react';
import { TemplarAdmin, DepartmentTab } from '../types';

interface HeaderProps {
  activeTab: DepartmentTab;
  setActiveTab: (tab: DepartmentTab) => void;
  activeAdmin: TemplarAdmin;
  onSwitchAdmin: (adminName: 'Paul' | 'Storm') => void;
  onTriggerBlindMan: () => void;
  pendingApprovalsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  activeAdmin,
  onSwitchAdmin,
  onTriggerBlindMan,
  pendingApprovalsCount
}) => {
  const departments: Array<{ id: DepartmentTab; label: string; icon: any; badge?: number }> = [
    { id: 'command', label: 'Command', icon: Shield },
    { id: 'armoury', label: 'Armoury', icon: Crosshair },
    { id: 'operations', label: 'Operations', icon: Calendar },
    { id: 'crm', label: 'CRM Bookings', icon: Users },
    { id: 'finance', label: 'Finance', icon: PoundSterling },
    { id: 'media', label: 'Media', icon: Film },
    { id: 'marketing', label: 'Growth', icon: TrendingUp },
    { id: 'intelligence', label: 'Intel & SOPs', icon: BookOpen, badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined },
    { id: 'jarvis' as any, label: 'Jarvis Voice', icon: Mic },
    { id: 'brain3d', label: '3D Neural Mesh', icon: Orbit },
    { id: 'vision', label: 'Optical Vision', icon: Camera }
  ];

  return (
    <>
      {/* Top Desktop & Mobile Header Bar */}
      <header className="border-b border-red-950/60 bg-[#09090b]/95 backdrop-blur-md sticky top-0 z-40 px-3 lg:px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Brand Identity: Templars Airsoft UK */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Tactical Templar Shield Emblem */}
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-red-800 via-red-950 to-zinc-950 text-white font-black text-xs shadow-lg shadow-red-950/60 border border-red-600/40 relative">
                <span className="font-mono text-red-100 text-sm">⚔️</span>
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-zinc-950 animate-pulse" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-sm tracking-wider text-white uppercase">JARVIS TEMPLAR</span>
                  <span className="text-zinc-600 font-light">|</span>
                  <span className="font-bold text-xs text-red-400 uppercase tracking-widest">TEMPLARS AIRSOFT UK</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-mono">
                  <span className="text-amber-400 flex items-center gap-1 text-[10px]">
                    <Radio className="w-3 h-3 text-red-400" />
                    PMR Ch 1
                  </span>
                  <span>•</span>
                  <span className="text-zinc-500">VCRA 2006 Defended</span>
                </div>
              </div>
            </div>

            {/* Emergency Ceasefire Button (Visible on mobile top) */}
            <div className="md:hidden">
              <button
                onClick={onTriggerBlindMan}
                className="p-2 rounded-xl bg-red-800 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-950 flex items-center gap-1 active:scale-95"
                title="Emergency Blind Man Halt"
              >
                <AlertOctagon className="w-4 h-4 text-white animate-bounce" />
                <span className="text-[10px]">CEASEFIRE</span>
              </button>
            </div>
          </div>

          {/* Right Header Controls: Admin Role Switcher & Emergency Trigger */}
          <div className="flex items-center gap-3 justify-between md:justify-end">
            {/* Paul / Storm Profile Switcher */}
            <div className="flex items-center gap-1.5 p-1 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-mono">
              <span className="text-zinc-500 text-[10px] uppercase px-1.5 hidden sm:inline">ADMIN:</span>
              <button
                onClick={() => onSwitchAdmin('Paul')}
                className={`px-3 py-1 rounded-lg transition-all font-bold flex items-center gap-1.5 ${
                  activeAdmin.name === 'Paul'
                    ? 'bg-red-800 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <span>👑</span>
                <span>Paul (Manager)</span>
              </button>

              <button
                onClick={() => onSwitchAdmin('Storm')}
                className={`px-3 py-1 rounded-lg transition-all font-bold flex items-center gap-1.5 ${
                  activeAdmin.name === 'Storm'
                    ? 'bg-red-800 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <span>⚡</span>
                <span>Storm (Head Marshal)</span>
              </button>
            </div>

            {/* Desktop Emergency Ceasefire */}
            <button
              onClick={onTriggerBlindMan}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-800 hover:bg-red-700 text-white font-bold text-xs shadow-lg shadow-red-950/50 border border-red-500/40 transition-all active:scale-95"
              title="Broadcast immediate game ceasefire across all marshal channels"
            >
              <AlertOctagon className="w-3.5 h-3.5 text-white animate-bounce" />
              <span>"BLIND MAN" CEASEFIRE</span>
            </button>
          </div>
        </div>

        {/* Desktop Horizontal Navigation Ribbon */}
        <div className="hidden lg:flex items-center gap-1 max-w-7xl mx-auto mt-2.5 pt-2 border-t border-zinc-900 overflow-x-auto text-xs">
          {departments.map(dept => {
            const Icon = dept.icon;
            const isActive = activeTab === dept.id;
            return (
              <button
                key={dept.id}
                onClick={() => setActiveTab(dept.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 font-semibold rounded-lg transition-all whitespace-nowrap relative ${
                  isActive
                    ? 'bg-red-900/30 text-red-300 border border-red-800/60 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-red-400' : 'text-zinc-500'}`} />
                <span>{dept.label}</span>
                {dept.badge && (
                  <span className="w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-mono font-bold flex items-center justify-center animate-pulse">
                    {dept.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* iPhone-First Fixed Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#09090b]/95 backdrop-blur-md border-t border-red-950/80 px-2 py-2 safe-area-bottom">
        <div className="flex items-center justify-around gap-1 overflow-x-auto">
          {departments.slice(0, 6).map(dept => {
            const Icon = dept.icon;
            const isActive = activeTab === dept.id;
            return (
              <button
                key={dept.id}
                onClick={() => setActiveTab(dept.id)}
                className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-all min-w-[50px] relative ${
                  isActive ? 'text-red-400 font-bold' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Icon className="w-4 h-4 mb-0.5" />
                <span className="text-[9px] tracking-tight whitespace-nowrap">{dept.label}</span>
                {dept.badge && (
                  <span className="absolute top-0 right-1 w-3.5 h-3.5 rounded-full bg-red-600 text-white text-[8px] font-mono flex items-center justify-center font-bold">
                    {dept.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Quick Jarvis Voice FAB */}
          <button
            onClick={() => setActiveTab('jarvis' as any)}
            className={`flex flex-col items-center justify-center p-2 rounded-full transition-all shadow-lg ${
              activeTab === ('jarvis' as any)
                ? 'bg-red-600 text-white scale-105 ring-2 ring-red-400'
                : 'bg-red-900/60 text-red-200 hover:bg-red-800'
            }`}
            title="Jarvis Tactical AI Copilot"
          >
            <Mic className="w-4 h-4" />
          </button>
        </div>
      </nav>
    </>
  );
};
