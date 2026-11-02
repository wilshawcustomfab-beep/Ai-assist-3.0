import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Radio, 
  AlertTriangle, 
  Plus, 
  CheckSquare, 
  Square, 
  UserCheck, 
  MapPin, 
  X, 
  Flame,
  FileText
} from 'lucide-react';
import { OperationalDayEvent, MarshalDuty, SafetyCheckItem, IncidentRecord, TemplarAdmin } from '../../types';

interface OperationsDepartmentProps {
  operations: OperationalDayEvent;
  activeAdmin: TemplarAdmin;
  onRefresh: () => void;
}

export const OperationsDepartment: React.FC<OperationsDepartmentProps> = ({
  operations,
  activeAdmin,
  onRefresh
}) => {
  // Safety Checklist interactive toggling
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // New Incident Modal
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [incidentType, setIncidentType] = useState<any>('chrono_violation');
  const [severity, setSeverity] = useState<any>('minor');
  const [involvedParty, setInvolvedParty] = useState('');
  const [incidentLocation, setIncidentLocation] = useState('Sector Bravo');
  const [incidentDescription, setIncidentDescription] = useState('');
  const [incidentActions, setIncidentActions] = useState('');
  const [isSubmittingIncident, setIsSubmittingIncident] = useState(false);

  // New Schedule Slot Modal
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [slotTime, setSlotTime] = useState('11:30');
  const [slotActivity, setSlotActivity] = useState('');
  const [slotLocation, setSlotLocation] = useState('Bunker Ridge');
  const [slotBriefing, setSlotBriefing] = useState('');
  const [isSubmittingSlot, setIsSubmittingSlot] = useState(false);

  // Handle Safety Check Toggle
  const handleToggleSafetyCheck = async (item: SafetyCheckItem) => {
    setTogglingId(item.id);
    try {
      const res = await fetch('/api/templar/operations/safety-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: item.id,
          completed: !item.completed,
          checkedBy: activeAdmin.name
        })
      });
      const data = await res.json();
      if (data.success) {
        onRefresh();
      }
    } catch (err) {
      console.warn('Safety check toggle error:', err);
    } finally {
      setTogglingId(null);
    }
  };

  // Handle Submit Incident
  const handleSubmitIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!incidentDescription || !involvedParty) return;
    setIsSubmittingIncident(true);

    try {
      const res = await fetch('/api/templar/operations/incident', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          incidentType,
          severity,
          involvedParty,
          location: incidentLocation,
          description: incidentDescription,
          actionsTaken: incidentActions,
          reportedBy: `${activeAdmin.name} (${activeAdmin.callsign})`
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowIncidentModal(false);
        setInvolvedParty('');
        setIncidentDescription('');
        setIncidentActions('');
        onRefresh();
      }
    } catch (err) {
      console.warn('Incident submission error:', err);
    } finally {
      setIsSubmittingIncident(false);
    }
  };

  // Handle Add Schedule Slot
  const handleAddScheduleSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slotTime || !slotActivity) return;
    setIsSubmittingSlot(true);

    try {
      const res = await fetch('/api/templar/operations/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          time: slotTime,
          activity: slotActivity,
          location: slotLocation,
          briefingNotes: slotBriefing
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowScheduleModal(false);
        setSlotActivity('');
        setSlotBriefing('');
        onRefresh();
      }
    } catch (err) {
      console.warn('Schedule add error:', err);
    } finally {
      setIsSubmittingSlot(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 font-bold">
              DEPARTMENT 04 • OPERATIONS & SAFETY
            </span>
            <span className="text-zinc-500 text-xs font-mono">Head Marshal: {operations.headMarshal}</span>
          </div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <span>{operations.title}</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Mission briefing: <strong className="text-zinc-200">{operations.briefingTheme}</strong> • {operations.weatherForecast}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowIncidentModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-red-300 font-semibold text-xs border border-red-900/40 transition-all active:scale-95"
          >
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span>+ Log Safety Incident</span>
          </button>

          <button
            onClick={() => setShowScheduleModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-800 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-900/30 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Schedule Slot</span>
          </button>
        </div>
      </div>

      {/* Grid: Game Schedule & Safety Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Game-Day Run Sheet */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/90 p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-red-400" />
              <h3 className="font-bold text-sm text-zinc-100">Sunday Game Schedule Run-Sheet</h3>
            </div>
            <span className="text-[11px] font-mono text-zinc-500">Timeline</span>
          </div>

          <div className="space-y-3">
            {operations.schedule.map((slot, idx) => (
              <div 
                key={idx}
                className="p-3 rounded-lg bg-zinc-850/80 border border-zinc-800 flex items-start gap-3 text-xs"
              >
                <span className="font-mono font-bold text-red-300 bg-zinc-900 px-2 py-1 rounded border border-zinc-800 text-[11px]">
                  {slot.time}
                </span>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white text-xs">{slot.activity}</h4>
                    <span className="text-[10px] font-mono text-zinc-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-zinc-400" />
                      {slot.location}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-1 italic">{slot.briefingNotes}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pre-Game Safety Checklist */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/90 p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-sm text-zinc-100">Pre-Game Safety & Boundary Checklist</h3>
            </div>
            <span className="text-[11px] font-mono text-zinc-500">Zero-Harm Protocol</span>
          </div>

          <div className="space-y-2.5">
            {operations.safetyChecklist.map((check) => (
              <div
                key={check.id}
                onClick={() => handleToggleSafetyCheck(check)}
                className={`p-3 rounded-lg border text-xs cursor-pointer transition-all flex items-start gap-3 ${
                  check.completed
                    ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200'
                    : 'bg-zinc-850/70 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div className="mt-0.5">
                  {check.completed ? (
                    <CheckSquare className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Square className="w-4 h-4 text-zinc-500" />
                  )}
                </div>

                <div className="flex-1">
                  <span className={`block font-medium ${check.completed ? 'text-zinc-200' : 'text-zinc-300'}`}>
                    {check.item}
                  </span>
                  {check.completed && (
                    <span className="text-[10px] font-mono text-emerald-400 mt-0.5 block">
                      ✔ Verified by {check.checkedBy || 'Marshal'} {check.timestamp ? `at ${check.timestamp}` : ''}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Woodland Maintenance Logs */}
          <div className="mt-5 pt-4 border-t border-zinc-800">
            <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">Woodland Field Maintenance</h4>
            <ul className="space-y-1.5 text-[11px] text-zinc-400">
              {operations.woodlandMaintenanceNotes.map((note, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Marshal Duty Rota & Frequency Channels */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/90 p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-red-400" />
            <h3 className="font-bold text-sm text-zinc-100">Marshal Duty Rota & Radio Channels</h3>
          </div>
          <span className="text-xs font-mono text-zinc-500">PMR Frequencies</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {operations.marshalRota.map((marshal) => (
            <div key={marshal.id} className="p-3.5 rounded-xl bg-zinc-850/70 border border-zinc-800 text-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-white text-xs">{marshal.name}</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                  {marshal.status.replace('_', ' ')}
                </span>
              </div>
              <div className="space-y-1 text-[11px] text-zinc-400 font-mono">
                <div><span className="text-zinc-500">Callsign:</span> {marshal.callsign}</div>
                <div><span className="text-zinc-500">Radio:</span> {marshal.radioChannel}</div>
                <div><span className="text-zinc-500">Sector:</span> {marshal.assignedSector}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Incident Records Table */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/90 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-sm text-zinc-100">Incident & Safety Investigation Logbook</h3>
          </div>
          <span className="text-xs font-mono text-zinc-500">({operations.incidents.length} recorded)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950/70 text-zinc-400 font-mono uppercase text-[10px] border-b border-zinc-800">
              <tr>
                <th className="py-3 px-4">Date / Time</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Involved Party</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Description & Action Taken</th>
                <th className="py-3 px-4">Reported By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-mono">
              {operations.incidents.map((inc) => (
                <tr key={inc.id} className="hover:bg-zinc-850/50">
                  <td className="py-3 px-4 text-zinc-400 text-[11px]">{inc.timestamp}</td>
                  <td className="py-3 px-4 uppercase text-amber-300 font-bold">{inc.incidentType.replace('_', ' ')}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                      inc.severity === 'major' || inc.severity === 'riddor_reportable' 
                        ? 'bg-red-950 text-red-300 border border-red-800/50' 
                        : 'bg-zinc-800 text-zinc-300'
                    }`}>
                      {inc.severity}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-sans text-zinc-200">{inc.involvedParty}</td>
                  <td className="py-3 px-4 text-zinc-400">{inc.location}</td>
                  <td className="py-3 px-4 font-sans text-zinc-300 max-w-xs">
                    <div>{inc.description}</div>
                    <div className="text-[10px] text-emerald-400 font-mono mt-0.5">Action: {inc.actionsTaken}</div>
                  </td>
                  <td className="py-3 px-4 text-zinc-400 font-sans">{inc.reportedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Log Safety Incident */}
      {showIncidentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-zinc-900 border border-zinc-800 p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span>Log Safety Incident / Infraction</span>
              </h3>
              <button onClick={() => setShowIncidentModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitIncident} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-medium mb-1">Incident Type</label>
                  <select
                    value={incidentType}
                    onChange={(e: any) => setIncidentType(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 focus:border-red-600 focus:outline-none"
                  >
                    <option value="chrono_violation">Chrono Violation (Hot Gun)</option>
                    <option value="injury">First Aid / Eye Pro Slip</option>
                    <option value="hit_taking_dispute">Hit-Taking Dispute</option>
                    <option value="boundary_breach">Boundary Breach (Public Footpath)</option>
                    <option value="equipment_failure">Equipment Failure</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 font-medium mb-1">Severity</label>
                  <select
                    value={severity}
                    onChange={(e: any) => setSeverity(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 focus:border-red-600 focus:outline-none"
                  >
                    <option value="minor">Minor</option>
                    <option value="moderate">Moderate</option>
                    <option value="major">Major</option>
                    <option value="riddor_reportable">RIDDOR Reportable</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-medium mb-1">Involved Party / Player Name</label>
                <input
                  type="text"
                  value={involvedParty}
                  onChange={(e) => setInvolvedParty(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 focus:border-red-600 focus:outline-none"
                  placeholder="Walk-on player #41 / John Doe"
                  required
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-medium mb-1">Woodland Location / Sector</label>
                <input
                  type="text"
                  value={incidentLocation}
                  onChange={(e) => setIncidentLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 focus:border-red-600 focus:outline-none"
                  placeholder="Sector Bravo Outpost / Pine Ridge"
                  required
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-medium mb-1">Incident Description</label>
                <textarea
                  rows={2}
                  value={incidentDescription}
                  onChange={(e) => setIncidentDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 focus:border-red-600 focus:outline-none"
                  placeholder="Player rifle measured 382 FPS on 0.20g during mid-game spot check..."
                  required
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-medium mb-1">Actions Taken</label>
                <input
                  type="text"
                  value={incidentActions}
                  onChange={(e) => setIncidentActions(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 focus:border-red-600 focus:outline-none"
                  placeholder="Rifle tagged and locked in safe-zone cabin until end of day."
                  required
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowIncidentModal(false)}
                  className="px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingIncident}
                  className="px-4 py-2 rounded-lg bg-red-800 hover:bg-red-700 text-white font-bold"
                >
                  {isSubmittingIncident ? 'Logging...' : 'File Incident Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Schedule Slot */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-zinc-900 border border-zinc-800 p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
              <h3 className="font-bold text-sm text-white">Add Schedule Slot</h3>
              <button onClick={() => setShowScheduleModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddScheduleSlot} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-medium mb-1">Time (24h)</label>
                  <input
                    type="text"
                    value={slotTime}
                    onChange={(e) => setSlotTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 font-mono focus:border-red-600 focus:outline-none"
                    placeholder="11:30"
                    required
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-medium mb-1">Location / Sector</label>
                  <input
                    type="text"
                    value={slotLocation}
                    onChange={(e) => setSlotLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 focus:border-red-600 focus:outline-none"
                    placeholder="Sector Echo Bunkers"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-medium mb-1">Activity Title</label>
                <input
                  type="text"
                  value={slotActivity}
                  onChange={(e) => setSlotActivity(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 focus:border-red-600 focus:outline-none"
                  placeholder="Game 3: The Alamo Siege"
                  required
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-medium mb-1">Marshal Briefing Notes</label>
                <textarea
                  rows={2}
                  value={slotBriefing}
                  onChange={(e) => setSlotBriefing(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 focus:border-red-600 focus:outline-none"
                  placeholder="Defenders have 1 life with 5-minute respawn timer; attackers infinite respawns."
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingSlot}
                  className="px-4 py-2 rounded-lg bg-red-800 hover:bg-red-700 text-white font-bold"
                >
                  {isSubmittingSlot ? 'Saving...' : 'Add Slot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
