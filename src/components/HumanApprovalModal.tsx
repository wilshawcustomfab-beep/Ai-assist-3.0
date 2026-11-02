import React from 'react';
import { ShieldAlert, Check, X, AlertTriangle, PoundSterling, Film, Calendar, Crosshair } from 'lucide-react';
import { PendingApprovalAction, TemplarAdmin } from '../types';

interface HumanApprovalModalProps {
  action: PendingApprovalAction | null;
  onClose: () => void;
  onExecute: (action: PendingApprovalAction, decision: 'approve' | 'reject') => void;
  activeAdmin: TemplarAdmin;
}

export const HumanApprovalModal: React.FC<HumanApprovalModalProps> = ({
  action,
  onClose,
  onExecute,
  activeAdmin
}) => {
  if (!action) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-lg rounded-2xl bg-zinc-900 border-2 border-red-700 p-6 shadow-2xl relative overflow-hidden">
        {/* Warning corner banner */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-red-950 text-red-400 border border-red-800/60">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-red-400 font-bold block">
                MANDATORY HUMAN APPROVAL GATE
              </span>
              <h3 className="font-black text-sm text-white">{action.title}</h3>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-850 space-y-2">
            <div className="flex justify-between font-mono text-zinc-400">
              <span>Department:</span>
              <strong className="text-white uppercase">{action.department}</strong>
            </div>
            <div className="flex justify-between font-mono text-zinc-400">
              <span>Originator:</span>
              <strong className="text-amber-400">{action.requestedBy}</strong>
            </div>
            <div className="flex justify-between font-mono text-zinc-400">
              <span>Queued At:</span>
              <span className="text-zinc-300">{action.timestamp}</span>
            </div>
            <div className="pt-2 border-t border-zinc-850 text-zinc-300 leading-relaxed font-sans">
              {action.description}
            </div>
          </div>

          {/* Action Specific Payload Breakdown */}
          {action.payload && (
            <div className="p-3 rounded-xl bg-zinc-850/60 border border-zinc-800 font-mono text-[11px] text-zinc-300 space-y-1">
              <span className="font-bold text-zinc-400 uppercase text-[10px] block mb-1">Payload Parameters:</span>
              <pre className="overflow-x-auto whitespace-pre-wrap text-zinc-400">
                {JSON.stringify(action.payload, null, 2)}
              </pre>
            </div>
          )}

          <p className="text-[11px] text-zinc-400 italic">
            Executing this action will modify the authoritative database ledger and trigger operational updates across Templars Airsoft UK.
          </p>

          <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3">
            <button
              onClick={() => onExecute(action, 'reject')}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold transition-all active:scale-95"
            >
              Reject Action
            </button>

            <button
              onClick={() => onExecute(action, 'approve')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-700 hover:bg-red-600 text-white font-black shadow-lg shadow-red-900/50 transition-all active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Authorize as {activeAdmin.name}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
