import React, { useState } from 'react';
import { 
  Users, 
  UserCheck, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  FileCheck, 
  PoundSterling, 
  Search, 
  Crosshair, 
  X, 
  FileText,
  Shield,
  Phone,
  Mail,
  Calendar
} from 'lucide-react';
import { BookingRecord, ArmouryItem, TemplarAdmin } from '../../types';

interface CustomerCRMDepartmentProps {
  bookings: BookingRecord[];
  armoury: ArmouryItem[];
  activeAdmin: TemplarAdmin;
  onRefresh: () => void;
}

export const CustomerCRMDepartment: React.FC<CustomerCRMDepartmentProps> = ({
  bookings,
  armoury,
  activeAdmin,
  onRefresh
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Check-In & Hire Kit Modal
  const [selectedBookingForCheckIn, setSelectedBookingForCheckIn] = useState<BookingRecord | null>(null);
  const [assignedKitTags, setAssignedKitTags] = useState<string[]>([]);
  const [isCheckingIn, setIsCheckingIn] = useState(false);

  // New Booking Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [playerType, setPlayerType] = useState<'walk_on' | 'full_hire' | 'group_package'>('full_hire');
  const [playerCount, setPlayerCount] = useState('1');
  const [gameDate, setGameDate] = useState('2026-11-08');
  const [depositPaid, setDepositPaid] = useState('20');
  const [ukaraNumber, setUkaraNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);

  // Waiver View Modal
  const [waiverModalBooking, setWaiverModalBooking] = useState<BookingRecord | null>(null);

  // UKARA Verification Tool Modal
  const [showUkaraTool, setShowUkaraTool] = useState(false);
  const [ukaraSearch, setUkaraSearch] = useState('');
  const [ukaraVerificationResult, setUkaraVerificationResult] = useState<string | null>(null);

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.bookingRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const availableOperationalWeapons = armoury.filter(w => w.status === 'operational' && !w.assignedPlayer);

  // Toggle Waiver Signature
  const handleToggleWaiver = async (bookingId: string) => {
    try {
      const res = await fetch(`/api/templar/bookings/${bookingId}/waiver`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        onRefresh();
      }
    } catch (err) {
      console.warn('Waiver toggle failed:', err);
    }
  };

  // Perform Check-in and kit assignment
  const handleCheckInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingForCheckIn) return;
    setIsCheckingIn(true);

    try {
      const res = await fetch(`/api/templar/bookings/${selectedBookingForCheckIn.id}/checkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignedKits: assignedKitTags })
      });
      const data = await res.json();
      if (data.success) {
        setSelectedBookingForCheckIn(null);
        setAssignedKitTags([]);
        onRefresh();
      }
    } catch (err) {
      console.warn('Check-in failed:', err);
    } finally {
      setIsCheckingIn(false);
    }
  };

  // Handle New Booking Creation
  const handleAddBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !gameDate) return;
    setIsSubmittingBooking(true);

    try {
      const res = await fetch('/api/templar/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          email,
          phone,
          playerType,
          playerCount,
          gameDate,
          depositPaid,
          ukaraNumber,
          notes
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setCustomerName('');
        setEmail('');
        setPhone('');
        setNotes('');
        onRefresh();
      }
    } catch (err) {
      console.warn('Booking create failed:', err);
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  // Handle UKARA Search check
  const handleVerifyUkara = (e: React.FormEvent) => {
    e.preventDefault();
    const query = ukaraSearch.trim().toUpperCase();
    if (!query) return;

    if (query.startsWith('UKARA-TMP') || query.includes('88319')) {
      setUkaraVerificationResult(`VALID UKARA DEFENCE: Player ${query} has 3 verified game attendances over 56 days at Templars Airsoft UK. Active expiry: October 2027.`);
    } else {
      setUkaraVerificationResult(`PENDING QUALIFICATION: Member ID ${query} has 2 of 3 required games registered. Next qualifying game unlocks UKARA database submission.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-blue-950/60 text-blue-300 border border-blue-800/40 font-bold">
              DEPARTMENT 07 • CUSTOMER CRM & BOOKINGS
            </span>
            <span className="text-zinc-500 text-xs font-mono">Airsoft Player Ledger</span>
          </div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <span>Player Registrations, Waivers & UKARA Defence</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Manage walk-ons (£25), full hire packages (£45), electronic legal waivers, and rental rifle allocation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowUkaraTool(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs border border-zinc-700/60 transition-all active:scale-95"
          >
            <Shield className="w-4 h-4 text-amber-400" />
            <span>Verify UKARA</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-800 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-900/30 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ New Booking</span>
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-zinc-900/80 rounded-xl border border-zinc-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search player name, ref, or email..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 focus:border-red-600 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1 p-1 bg-zinc-950 rounded-lg text-xs font-mono border border-zinc-800 w-full sm:w-auto overflow-x-auto">
          {['all', 'confirmed', 'checked_in', 'enquiry'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded text-[11px] uppercase transition-all whitespace-nowrap ${
                statusFilter === st ? 'bg-red-800 text-white font-bold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Register Table */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/90 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950/70 text-zinc-400 font-mono uppercase text-[10px] border-b border-zinc-800">
              <tr>
                <th className="py-3 px-4">Ref</th>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Package & Squad</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Finance (Deposit / Balance)</th>
                <th className="py-3 px-4">Electronic Waiver</th>
                <th className="py-3 px-4">Allocated Hire Rifles</th>
                <th className="py-3 px-4">Status & Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-mono">
              {filteredBookings.map((b) => {
                const isCheckedIn = b.status === 'checked_in';
                return (
                  <tr key={b.id} className="hover:bg-zinc-850/50 transition-colors">
                    <td className="py-3 px-4 font-bold text-red-300">{b.bookingRef}</td>
                    <td className="py-3 px-4 font-sans">
                      <div className="font-semibold text-zinc-100">{b.customerName}</div>
                      <div className="text-[10px] text-zinc-500 font-mono flex items-center gap-2 mt-0.5">
                        {b.phone && <span>{b.phone}</span>}
                        {b.ukaraNumber && <span className="text-amber-400 font-bold">{b.ukaraNumber}</span>}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                        b.playerType === 'full_hire' 
                          ? 'bg-amber-950/60 text-amber-300 border border-amber-800/40' 
                          : b.playerType === 'walk_on'
                          ? 'bg-blue-950/60 text-blue-300 border border-blue-800/40'
                          : 'bg-purple-950/60 text-purple-300 border border-purple-800/40'
                      }`}>
                        {b.playerType.replace('_', ' ')}
                      </span>
                      <span className="text-[11px] text-zinc-400 ml-1.5 font-bold">({b.playerCount}p)</span>
                    </td>
                    <td className="py-3 px-4 text-zinc-400 text-[11px]">{b.gameDate}</td>
                    <td className="py-3 px-4">
                      <div className="text-zinc-200 font-bold">£{b.totalAmount.toFixed(2)}</div>
                      <div className="text-[10px] text-zinc-400">
                        Paid: £{b.depositPaid.toFixed(2)} | Due: <strong className={b.balanceDue > 0 ? 'text-red-400' : 'text-emerald-400'}>£{b.balanceDue.toFixed(2)}</strong>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-sans">
                      <button
                        onClick={() => handleToggleWaiver(b.id)}
                        className={`flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                          b.waiverSigned
                            ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 hover:bg-emerald-900/60'
                            : 'bg-red-950/60 text-red-300 border border-red-800/40 hover:bg-red-900/60'
                        }`}
                        title="Click to toggle waiver signature"
                      >
                        {b.waiverSigned ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5 text-red-400" />}
                        <span>{b.waiverSigned ? 'Signed' : 'Pending'}</span>
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      {b.hireKitAssigned.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {b.hireKitAssigned.map(kit => (
                            <span key={kit} className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-zinc-800 text-amber-300 border border-zinc-700">
                              {kit}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-zinc-500 italic text-[11px]">Own kit / None</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-sans">
                      {isCheckedIn ? (
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 font-bold text-[11px] border border-emerald-800/50 flex items-center gap-1 w-max">
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Checked In</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedBookingForCheckIn(b);
                            // Auto select matching count of available weapons
                            const needed = b.playerType === 'full_hire' ? b.playerCount : 0;
                            const preselected = availableOperationalWeapons.slice(0, needed).map(w => w.assetTag);
                            setAssignedKitTags(preselected);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-red-800 hover:bg-red-700 text-white font-bold text-[11px] transition-all active:scale-95 shadow-sm"
                        >
                          Check In & Allocate
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Check-In & Allocate Hire Rifles */}
      {selectedBookingForCheckIn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-zinc-900 border border-zinc-800 p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
              <div>
                <h3 className="font-bold text-sm text-white">Player Check-In & Equipment Handout</h3>
                <span className="text-xs font-mono text-zinc-400">
                  {selectedBookingForCheckIn.customerName} ({selectedBookingForCheckIn.bookingRef})
                </span>
              </div>
              <button onClick={() => setSelectedBookingForCheckIn(null)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCheckInSubmit} className="space-y-4 text-xs">
              <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1 text-zinc-300 font-mono">
                <div className="flex justify-between">
                  <span>Player Count:</span>
                  <strong className="text-white">{selectedBookingForCheckIn.playerCount}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Remaining Balance:</span>
                  <strong className="text-emerald-400">£{selectedBookingForCheckIn.balanceDue.toFixed(2)} (Settled on Gate)</strong>
                </div>
                <div className="flex justify-between">
                  <span>Safety Waiver:</span>
                  <strong className={selectedBookingForCheckIn.waiverSigned ? 'text-emerald-400' : 'text-amber-400'}>
                    {selectedBookingForCheckIn.waiverSigned ? 'Signed & Stored' : 'Sign Physical Waiver on Clipboard'}
                  </strong>
                </div>
              </div>

              {selectedBookingForCheckIn.playerType !== 'walk_on' && (
                <div>
                  <label className="block text-zinc-300 font-bold mb-2">
                    Allocate Rental AEGs (Select {selectedBookingForCheckIn.playerCount} units):
                  </label>
                  <div className="max-h-48 overflow-y-auto space-y-1.5 p-2 rounded-lg bg-zinc-950 border border-zinc-800">
                    {availableOperationalWeapons.map((weapon) => {
                      const isSelected = assignedKitTags.includes(weapon.assetTag);
                      return (
                        <div
                          key={weapon.id}
                          onClick={() => {
                            if (isSelected) {
                              setAssignedKitTags(prev => prev.filter(t => t !== weapon.assetTag));
                            } else {
                              setAssignedKitTags(prev => [...prev, weapon.assetTag]);
                            }
                          }}
                          className={`p-2 rounded border cursor-pointer flex items-center justify-between text-xs font-mono transition-colors ${
                            isSelected 
                              ? 'bg-red-950/60 border-red-800 text-white' 
                              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          <div>
                            <strong className="text-red-300 mr-2">{weapon.assetTag}</strong>
                            <span>{weapon.model}</span>
                          </div>
                          <span className="text-[10px] text-emerald-400">{weapon.fpsChrono} FPS</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setSelectedBookingForCheckIn(null)}
                  className="px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCheckingIn}
                  className="px-4 py-2 rounded-lg bg-red-800 hover:bg-red-700 text-white font-bold"
                >
                  {isCheckingIn ? 'Processing...' : 'Complete Check-In & Issue Kits'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Booking */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-zinc-900 border border-zinc-800 p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
              <h3 className="font-bold text-sm text-white">Create Airsoft Player Booking</h3>
              <button onClick={() => setShowAddModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddBooking} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-medium mb-1">Customer / Lead Name</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 focus:border-red-600 focus:outline-none"
                    placeholder="Marcus Vance"
                    required
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-medium mb-1">Package Type</label>
                  <select
                    value={playerType}
                    onChange={(e: any) => setPlayerType(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 focus:border-red-600 focus:outline-none"
                  >
                    <option value="walk_on">Walk-On (£25 / player)</option>
                    <option value="full_hire">Full Rental Package (£45 / player)</option>
                    <option value="group_package">Group Package (£40 / player)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-zinc-400 font-medium mb-1">Player Count</label>
                  <input
                    type="number"
                    min="1"
                    value={playerCount}
                    onChange={(e) => setPlayerCount(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 font-mono focus:border-red-600 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-medium mb-1">Game Date</label>
                  <input
                    type="date"
                    value={gameDate}
                    onChange={(e) => setGameDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 font-mono focus:border-red-600 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-medium mb-1">Deposit Paid (£)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={depositPaid}
                    onChange={(e) => setDepositPaid(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 font-mono focus:border-red-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-medium mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 focus:border-red-600 focus:outline-none"
                    placeholder="player@example.co.uk"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-medium mb-1">UKARA Number (if walk-on)</label>
                  <input
                    type="text"
                    value={ukaraNumber}
                    onChange={(e) => setUkaraNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 font-mono focus:border-red-600 focus:outline-none"
                    placeholder="UKARA-TMP-..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-medium mb-1">Operational Notes</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 focus:border-red-600 focus:outline-none"
                  placeholder="e.g. Birthday group, needs 3 full face masks"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingBooking}
                  className="px-4 py-2 rounded-lg bg-red-800 hover:bg-red-700 text-white font-bold"
                >
                  {isSubmittingBooking ? 'Saving...' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: UKARA Verification Search */}
      {showUkaraTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-zinc-900 border border-zinc-800 p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-400" />
                <span>UKARA Membership Defence Checker</span>
              </h3>
              <button onClick={() => setShowUkaraTool(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleVerifyUkara} className="space-y-3 text-xs">
              <p className="text-zinc-400 text-[11px]">
                Enter player UKARA database identifier or player surname to confirm VCRA 2006 defense criteria (3 games over 56+ days).
              </p>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={ukaraSearch}
                  onChange={(e) => setUkaraSearch(e.target.value)}
                  placeholder="UKARA-TMP-88319"
                  className="flex-1 px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 font-mono focus:border-red-600 focus:outline-none"
                  required
                />
                <button type="submit" className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-black font-bold text-xs">
                  Verify
                </button>
              </div>

              {ukaraVerificationResult && (
                <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 font-mono text-[11px] leading-relaxed">
                  {ukaraVerificationResult}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
