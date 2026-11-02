import React, { useState } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  Crosshair, 
  Users, 
  PoundSterling, 
  Calendar, 
  CheckCircle2, 
  Radio, 
  Flame, 
  Clock, 
  Zap, 
  ChevronRight, 
  Volume2, 
  ArrowUpRight,
  TrendingUp,
  FileCheck,
  AlertOctagon
} from 'lucide-react';
import { TemplarAdmin, BookingRecord, ArmouryItem, FinanceTransaction, OperationalDayEvent, OperationalAlert, PendingApprovalAction } from '../../types';

interface CommandCentreProps {
  activeAdmin: TemplarAdmin;
  bookings: BookingRecord[];
  armoury: ArmouryItem[];
  finance: FinanceTransaction[];
  operations: OperationalDayEvent;
  alerts: OperationalAlert[];
  pendingApprovals: PendingApprovalAction[];
  onNavigateDepartment: (dept: any) => void;
  onOpenApproval: (item: PendingApprovalAction) => void;
  onTriggerBlindMan: () => void;
  onQuickGreenFee: () => void;
}

export const CommandCentre: React.FC<CommandCentreProps> = ({
  activeAdmin,
  bookings,
  armoury,
  finance,
  operations,
  alerts,
  pendingApprovals,
  onNavigateDepartment,
  onOpenApproval,
  onTriggerBlindMan,
  onQuickGreenFee
}) => {
  const confirmedPlayers = bookings.reduce((acc, b) => b.status === 'confirmed' || b.status === 'checked_in' ? acc + b.playerCount : acc, 0);
  const operationalWeapons = armoury.filter(w => w.status === 'operational').length;
  const netIncome = finance.reduce((acc, f) => f.type === 'income' ? acc + f.amount : acc - f.amount, 0);
  const activeAlerts = alerts.slice(0, 3);
  const pendingApprovalsCount = pendingApprovals.filter(p => p.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Top Banner: Site Status & Active Administrator */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-red-950/40 border border-red-900/30 p-5 shadow-2xl">
        <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wider font-bold bg-red-900/40 text-red-300 border border-red-800/50 uppercase">
                TEMPLARS AIRSOFT UK • COMMAND GRID
              </span>
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                SITE ACTIVE (40 ACRES)
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span>{operations.title}</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
              Operating under UKARA & VCRA 2006 defense protocols. Current Administrator on deck:{' '}
              <strong className="text-zinc-200">{activeAdmin.name} ({activeAdmin.callsign})</strong>.
            </p>
          </div>

          {/* Emergency "BLIND MAN" & Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onTriggerBlindMan}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-red-700 hover:bg-red-600 text-white font-bold text-xs shadow-lg shadow-red-900/40 border border-red-500/50 transition-all active:scale-95"
              title="Broadcast immediate game ceasefire across all marshal channels"
            >
              <AlertOctagon className="w-4 h-4 animate-bounce text-white" />
              <span>EMERGENCY "BLIND MAN"</span>
            </button>

            <button
              onClick={onQuickGreenFee}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs border border-zinc-700/60 transition-all active:scale-95"
            >
              <PoundSterling className="w-3.5 h-3.5 text-amber-400" />
              <span>+ Quick Walk-On (£25)</span>
            </button>
          </div>
        </div>

        {/* Weather & Chrono briefing bar */}
        <div className="mt-4 pt-3.5 border-t border-zinc-800/80 flex flex-wrap items-center gap-4 text-xs text-zinc-400">
          <div className="flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-red-400" />
            <span className="text-zinc-300 font-mono">PMR Ch 1 (446.006 MHz)</span>
          </div>
          <span className="text-zinc-700">|</span>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Next Phase: <strong className="text-zinc-200">10:00 Safety Briefing</strong></span>
          </div>
          <span className="text-zinc-700">|</span>
          <div className="flex items-center gap-1.5">
            <span className="text-blue-400">🌦️</span>
            <span>{operations.weatherForecast}</span>
          </div>
        </div>
      </div>

      {/* KPI Stats Matrix */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Stat 1: Bookings & Players */}
        <div 
          onClick={() => onNavigateDepartment('crm')}
          className="group cursor-pointer rounded-xl bg-zinc-900/90 border border-zinc-800 hover:border-red-900/60 p-4 transition-all hover:bg-zinc-850 shadow-md"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Confirmed Players</span>
            <div className="p-2 rounded-lg bg-red-950/40 text-red-400 border border-red-900/40 group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{confirmedPlayers}</span>
            <span className="text-xs text-zinc-400">/ 60 target</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-400 pt-2 border-t border-zinc-800/60">
            <span>{bookings.filter(b => b.playerType === 'full_hire').length} hire packs</span>
            <ChevronRight className="w-3 h-3 text-red-400 opacity-60 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Stat 2: Armoury Fleet Readiness */}
        <div 
          onClick={() => onNavigateDepartment('armoury')}
          className="group cursor-pointer rounded-xl bg-zinc-900/90 border border-zinc-800 hover:border-red-900/60 p-4 transition-all hover:bg-zinc-850 shadow-md"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Rental Fleet Health</span>
            <div className="p-2 rounded-lg bg-amber-950/40 text-amber-400 border border-amber-900/40 group-hover:scale-110 transition-transform">
              <Crosshair className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{operationalWeapons}</span>
            <span className="text-xs text-zinc-400">/ {armoury.length} operational</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-400 pt-2 border-t border-zinc-800/60">
            <span className="text-emerald-400 font-medium">100% Chrono Tested</span>
            <ChevronRight className="w-3 h-3 text-amber-400 opacity-60 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Stat 3: Commercial Net Profit */}
        <div 
          onClick={() => onNavigateDepartment('finance')}
          className="group cursor-pointer rounded-xl bg-zinc-900/90 border border-zinc-800 hover:border-red-900/60 p-4 transition-all hover:bg-zinc-850 shadow-md"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Net Site Revenue</span>
            <div className="p-2 rounded-lg bg-emerald-950/40 text-emerald-400 border border-emerald-900/40 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-400">£{netIncome.toFixed(2)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-400 pt-2 border-t border-zinc-800/60">
            <span>Rent £1,200/mo amortised</span>
            <ChevronRight className="w-3 h-3 text-emerald-400 opacity-60 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Stat 4: Human Approvals Queue */}
        <div 
          onClick={() => onNavigateDepartment('intelligence')}
          className="group cursor-pointer rounded-xl bg-zinc-900/90 border border-zinc-800 hover:border-red-900/60 p-4 transition-all hover:bg-zinc-850 shadow-md"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Pending Approvals</span>
            <div className="p-2 rounded-lg bg-red-950/40 text-red-400 border border-red-900/40 group-hover:scale-110 transition-transform">
              <Shield className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-red-400">{pendingApprovalsCount}</span>
            <span className="text-xs text-zinc-400">action{pendingApprovalsCount !== 1 ? 's' : ''} gated</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-400 pt-2 border-t border-zinc-800/60">
            <span>Human-in-the-Loop active</span>
            <ChevronRight className="w-3 h-3 text-red-400 opacity-60 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* Main Grid: Alerts & Pending Approvals vs Game Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Critical Action Queue & Tactical Alerts */}
        <div className="lg:col-span-2 space-y-5">
          {/* Section: Pending Human Approvals (High Priority) */}
          {pendingApprovals.filter(p => p.status === 'pending').length > 0 && (
            <div className="rounded-xl border border-red-800/60 bg-red-950/20 p-4 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                  <h3 className="font-bold text-sm text-red-200 uppercase tracking-wide">
                    Human Authorization Required ({pendingApprovals.filter(p => p.status === 'pending').length})
                  </h3>
                </div>
                <span className="text-[11px] text-red-400 font-mono">Explicit sign-off gate</span>
              </div>

              <div className="space-y-2.5">
                {pendingApprovals.filter(p => p.status === 'pending').map((item) => (
                  <div 
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg bg-zinc-900/90 border border-zinc-800 hover:border-red-800/60 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-red-950 text-red-300 border border-red-900/50">
                          {item.actionType.replace('_', ' ')}
                        </span>
                        <h4 className="font-semibold text-xs text-white">{item.title}</h4>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-1">{item.description}</p>
                    </div>

                    <button
                      onClick={() => onOpenApproval(item)}
                      className="self-start sm:self-center px-3 py-1.5 rounded-lg bg-red-800 hover:bg-red-700 text-white font-bold text-xs transition-all whitespace-nowrap active:scale-95"
                    >
                      Review & Authorize
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Active Operational Alerts */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm text-zinc-200">Active Field & Operational Alerts</h3>
              </div>
              <span className="text-[11px] text-zinc-500 font-mono">Live Monitoring</span>
            </div>

            <div className="space-y-2.5">
              {activeAlerts.map((alt) => (
                <div 
                  key={alt.id}
                  className={`p-3 rounded-lg border text-xs flex items-start gap-3 transition-colors ${
                    alt.level === 'critical'
                      ? 'bg-red-950/20 border-red-900/50 text-red-200'
                      : alt.level === 'warning'
                      ? 'bg-amber-950/20 border-amber-900/50 text-amber-200'
                      : 'bg-zinc-850 border-zinc-800 text-zinc-300'
                  }`}
                >
                  <div className="mt-0.5">
                    {alt.level === 'critical' ? (
                      <AlertOctagon className="w-4 h-4 text-red-400" />
                    ) : alt.level === 'warning' ? (
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                    ) : (
                      <Zap className="w-4 h-4 text-blue-400" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{alt.title}</span>
                      <span className="text-[10px] font-mono text-zinc-500">{alt.timestamp.slice(-5)}</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-0.5">{alt.message}</p>
                    {alt.actionRequired && (
                      <div className="mt-1.5 text-[10px] font-mono text-amber-300 flex items-center gap-1">
                        <strong className="text-zinc-500">ACTION:</strong> {alt.actionRequired}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Department Portals */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { id: 'armoury', label: 'Armoury & Chrono', icon: Crosshair, color: 'text-amber-400' },
              { id: 'operations', label: 'Game Operations', icon: Calendar, color: 'text-emerald-400' },
              { id: 'crm', label: 'Bookings & Players', icon: Users, color: 'text-blue-400' },
              { id: 'finance', label: 'Finance & P&L', icon: PoundSterling, color: 'text-rose-400' }
            ].map(dept => {
              const Icon = dept.icon;
              return (
                <button
                  key={dept.id}
                  onClick={() => onNavigateDepartment(dept.id)}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-zinc-900/70 border border-zinc-800 hover:border-red-900/50 hover:bg-zinc-800/80 transition-all text-center group"
                >
                  <Icon className={`w-5 h-5 ${dept.color} mb-1.5 group-hover:scale-110 transition-transform`} />
                  <span className="text-xs font-semibold text-zinc-300 group-hover:text-white">{dept.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Sunday Game-Day Run-Sheet & Marshalling */}
        <div className="space-y-5">
          {/* Sunday Schedule Widget */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4 shadow-lg">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-red-400" />
                <h3 className="font-bold text-sm text-zinc-200">Game-Day Run-Sheet</h3>
              </div>
              <button 
                onClick={() => onNavigateDepartment('operations')}
                className="text-[11px] text-red-400 hover:underline font-mono"
              >
                Full Rota →
              </button>
            </div>

            <div className="relative pl-4 space-y-3 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-800">
              {operations.schedule.slice(0, 5).map((slot, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-zinc-700 border-2 border-zinc-900 group-hover:bg-red-500 transition-colors" />
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono text-xs font-bold text-red-300">{slot.time}</span>
                    <span className="text-[10px] text-zinc-500">{slot.location}</span>
                  </div>
                  <div className="text-xs font-medium text-zinc-200 mt-0.5">{slot.activity}</div>
                  <div className="text-[11px] text-zinc-400 italic line-clamp-1 mt-0.5">{slot.briefingNotes}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Marshals on Frequency */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm text-zinc-200">Marshals on Frequency</h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400">PMR Ch 1</span>
            </div>

            <div className="space-y-2">
              {operations.marshalRota.map((marshal) => (
                <div 
                  key={marshal.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-zinc-850/70 border border-zinc-800 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <div>
                      <span className="font-semibold text-zinc-200">{marshal.name}</span>
                      <span className="text-[10px] text-zinc-500 font-mono ml-1.5">({marshal.callsign})</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-zinc-400 font-mono">{marshal.assignedSector.split('&')[0]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
