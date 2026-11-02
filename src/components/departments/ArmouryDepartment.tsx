import React, { useState } from 'react';
import { 
  Crosshair, 
  ShieldCheck, 
  AlertTriangle, 
  Wrench, 
  BatteryCharging, 
  Plus, 
  Zap, 
  Check, 
  X, 
  RefreshCw, 
  Package, 
  Flame, 
  Radio,
  FileSpreadsheet
} from 'lucide-react';
import { ArmouryItem, ConsumableStock, TemplarAdmin } from '../../types';

interface ArmouryDepartmentProps {
  armoury: ArmouryItem[];
  consumables: ConsumableStock[];
  activeAdmin: TemplarAdmin;
  onRefresh: () => void;
}

export const ArmouryDepartment: React.FC<ArmouryDepartmentProps> = ({
  armoury,
  consumables,
  activeAdmin,
  onRefresh
}) => {
  // Chrono Quick Log State
  const [selectedTag, setSelectedTag] = useState<string>(armoury[0]?.assetTag || 'AEG-01');
  const [chronoFps, setChronoFps] = useState<string>('340');
  const [bbWeight, setBbWeight] = useState<string>('0.20g');
  const [chronoResult, setChronoResult] = useState<{ message: string; passed: boolean } | null>(null);
  const [isLoggingChrono, setIsLoggingChrono] = useState(false);

  // New Weapon Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAssetTag, setNewAssetTag] = useState('');
  const [newModel, setNewModel] = useState('');
  const [newCategory, setNewCategory] = useState<'aeg' | 'dmr' | 'sniper' | 'pistol'>('aeg');
  const [newSerial, setNewSerial] = useState('');
  const [newBattery, setNewBattery] = useState('7.4V LiPo 1200mAh');
  const [isAddingWeapon, setIsAddingWeapon] = useState(false);

  // Category Filter
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredArmoury = categoryFilter === 'all' 
    ? armoury 
    : armoury.filter(item => item.category === categoryFilter);

  // Handle Quick Chrono Logging
  const handleLogChrono = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingChrono(true);
    setChronoResult(null);

    try {
      const res = await fetch('/api/templar/armoury/chrono', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assetTag: selectedTag,
          fps: chronoFps,
          bbWeight,
          marshal: activeAdmin.name
        })
      });
      const data = await res.json();
      if (data.success) {
        setChronoResult({
          message: data.message,
          passed: data.passed
        });
        onRefresh();
      } else {
        setChronoResult({ message: data.error || 'Failed to log chrono', passed: false });
      }
    } catch (err: any) {
      setChronoResult({ message: err?.message || 'Network error', passed: false });
    } finally {
      setIsLoggingChrono(false);
    }
  };

  // Handle Stock Adjustment
  const handleAdjustStock = async (id: string, delta: number) => {
    try {
      const res = await fetch('/api/templar/consumables/adjust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, delta, reason: `Manual adjustment by ${activeAdmin.name}` })
      });
      const data = await res.json();
      if (data.success) {
        onRefresh();
      }
    } catch (err) {
      console.warn('Stock update failed:', err);
    }
  };

  // Handle Add New Weapon
  const handleAddWeapon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssetTag || !newModel) return;
    setIsAddingWeapon(true);

    try {
      const res = await fetch('/api/templar/armoury', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assetTag: newAssetTag,
          model: newModel,
          category: newCategory,
          serialNumber: newSerial,
          fpsChrono: 340,
          batteryType: newBattery,
          status: 'operational'
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setNewAssetTag('');
        setNewModel('');
        setNewSerial('');
        onRefresh();
      }
    } catch (err) {
      console.warn('Add weapon failed:', err);
    } finally {
      setIsAddingWeapon(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-amber-950/60 text-amber-300 border border-amber-800/40 font-bold">
              DEPARTMENT 05 • ARMOURY & FLEET
            </span>
            <span className="text-zinc-500 text-xs font-mono">UKARA / VCRA 2006 Compliant</span>
          </div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <span>Rental Fleet, Chrono Station & Consumables</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Site Limits: AEG 350 FPS (1.14J) • DMR Semi 450 FPS (1.88J, 30m MED) • Bolt-Action Sniper 500 FPS (2.32J, 30m MED) on 0.20g BBs.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-red-800 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-900/30 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Weapon Asset</span>
        </button>
      </div>

      {/* Grid: Chrono Test Station & Consumable Inventory */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Quick Chrono Log Station */}
        <div className="rounded-xl border border-red-900/40 bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-950 p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <Crosshair className="w-4 h-4 text-red-400" />
              <h3 className="font-bold text-sm text-zinc-100">Live Chrono Test Station</h3>
            </div>
            <span className="text-[10px] font-mono text-zinc-500">Marshal: {activeAdmin.name}</span>
          </div>

          <form onSubmit={handleLogChrono} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Select Weapon / Asset Tag</label>
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs font-mono focus:border-red-600 focus:outline-none"
              >
                {armoury.map(w => (
                  <option key={w.id} value={w.assetTag}>
                    {w.assetTag} - {w.model} ({w.category.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Measured Velocity</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={chronoFps}
                    onChange={(e) => setChronoFps(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 font-mono text-sm font-bold focus:border-red-600 focus:outline-none pr-10"
                    placeholder="340"
                    required
                  />
                  <span className="absolute right-2.5 top-2 text-[10px] font-mono text-zinc-500">FPS</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">BB Weight</label>
                <select
                  value={bbWeight}
                  onChange={(e) => setBbWeight(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs font-mono focus:border-red-600 focus:outline-none"
                >
                  <option value="0.20g">0.20g (Standard)</option>
                  <option value="0.25g">0.25g</option>
                  <option value="0.28g">0.28g</option>
                </select>
              </div>
            </div>

            {/* Calculated Energy Live Preview */}
            <div className="p-3 rounded-lg bg-zinc-950/80 border border-zinc-800 text-xs flex items-center justify-between font-mono">
              <span className="text-zinc-500">Calculated Energy:</span>
              <span className="font-bold text-amber-400">
                {((0.5 * 0.0002 * Math.pow((parseFloat(chronoFps) || 0) * 0.3048, 2))).toFixed(2)} Joules
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoggingChrono}
              className="w-full py-2.5 rounded-lg bg-red-800 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wide transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {isLoggingChrono ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
              <span>Commit Chrono Verification</span>
            </button>
          </form>

          {/* Chrono Test Feedback Alert */}
          {chronoResult && (
            <div className={`mt-4 p-3 rounded-lg border text-xs flex items-start gap-2.5 ${
              chronoResult.passed 
                ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-200' 
                : 'bg-red-950/40 border-red-800/70 text-red-200'
            }`}>
              {chronoResult.passed ? <Check className="w-4 h-4 text-emerald-400 mt-0.5" /> : <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5" />}
              <div>
                <strong className="block">{chronoResult.passed ? 'PASSED SITE CHRONO' : 'CHRONO LIMIT EXCEEDED'}</strong>
                <p className="text-[11px] mt-0.5 opacity-90">{chronoResult.message}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right (2 Cols): Consumables (BBs, Pyros, Gas) */}
        <div className="lg:col-span-2 rounded-xl border border-zinc-800 bg-zinc-900/80 p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-sm text-zinc-100">Safe Zone Consumables & Pyro Inventory</h3>
            </div>
            <span className="text-[11px] text-zinc-500 font-mono">18+ Age Checked for Pyro</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {consumables.map((item) => {
              const isLow = item.stockLevel <= item.reorderThreshold;
              return (
                <div 
                  key={item.id}
                  className={`p-3.5 rounded-xl border text-xs transition-colors ${
                    isLow 
                      ? 'bg-red-950/20 border-red-900/50' 
                      : 'bg-zinc-850/80 border-zinc-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono uppercase font-bold ${
                          item.category === 'pyro' ? 'bg-orange-950 text-orange-300 border border-orange-800/40' : 'bg-zinc-800 text-zinc-300'
                        }`}>
                          {item.category.toUpperCase()}
                        </span>
                        {isLow && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase bg-red-950 text-red-300 border border-red-800/50 animate-pulse">
                            LOW STOCK
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-white text-xs">{item.name}</h4>
                    </div>

                    <div className="text-right">
                      <div className="text-base font-black text-amber-400 font-mono">
                        {item.stockLevel}
                      </div>
                      <div className="text-[10px] text-zinc-500">{item.unit}</div>
                    </div>
                  </div>

                  {/* Pricing & Adjust Buttons */}
                  <div className="mt-3 pt-2.5 border-t border-zinc-800/60 flex items-center justify-between">
                    <span className="text-[11px] text-zinc-400 font-mono">
                      Cost: £{item.costPrice.toFixed(2)} | Sale: <strong className="text-emerald-400">£{item.salePrice.toFixed(2)}</strong>
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleAdjustStock(item.id, -1)}
                        className="w-6 h-6 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold flex items-center justify-center transition-colors active:scale-95"
                        title="Deduct 1"
                      >
                        -
                      </button>
                      <button
                        onClick={() => handleAdjustStock(item.id, 1)}
                        className="w-6 h-6 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold flex items-center justify-center transition-colors active:scale-95"
                        title="Add 1"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Fleet Inventory Table */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/90 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-red-400" />
            <h3 className="font-bold text-sm text-zinc-100">Hire Weapons & Tactical Asset Register</h3>
            <span className="text-xs font-mono text-zinc-500">({armoury.length} Total Units)</span>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-zinc-950 rounded-lg text-xs font-mono border border-zinc-800">
            {['all', 'aeg', 'dmr', 'sniper', 'pistol'].map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded text-[11px] uppercase transition-all ${
                  categoryFilter === cat 
                    ? 'bg-red-800 text-white font-bold' 
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950/70 text-zinc-400 font-mono uppercase text-[10px] border-b border-zinc-800">
              <tr>
                <th className="py-3 px-4">Tag</th>
                <th className="py-3 px-4">Model & Platform</th>
                <th className="py-3 px-4">Serial Number</th>
                <th className="py-3 px-4">Chrono (FPS / Joules)</th>
                <th className="py-3 px-4">Battery / Power</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Assigned Player</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-mono">
              {filteredArmoury.map((weapon) => {
                const isOp = weapon.status === 'operational';
                const isMaint = weapon.status === 'maintenance_due';
                return (
                  <tr key={weapon.id} className="hover:bg-zinc-850/50 transition-colors">
                    <td className="py-3 px-4 font-bold text-red-300">
                      {weapon.assetTag}
                    </td>
                    <td className="py-3 px-4 font-sans text-zinc-200">
                      <div className="font-semibold">{weapon.model}</div>
                      {weapon.repairNotes && (
                        <div className="text-[10px] text-zinc-500 italic mt-0.5">{weapon.repairNotes}</div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-zinc-400 text-[11px]">
                      {weapon.serialNumber}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-bold ${isOp ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {weapon.fpsChrono} FPS
                      </span>
                      <span className="text-[10px] text-zinc-500 ml-1">({weapon.joules}J)</span>
                    </td>
                    <td className="py-3 px-4 text-zinc-400 font-sans text-[11px]">
                      {weapon.batteryType}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${
                        isOp 
                          ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40' 
                          : isMaint 
                          ? 'bg-amber-950/60 text-amber-400 border-amber-800/40' 
                          : 'bg-red-950/60 text-red-400 border-red-800/40'
                      }`}>
                        {weapon.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-sans text-zinc-400">
                      {weapon.assignedPlayer || <span className="text-zinc-600 italic">Available</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Weapon Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-zinc-900 border border-zinc-800 p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
              <h3 className="font-bold text-sm text-white">Add New Weapon to Fleet</h3>
              <button onClick={() => setShowAddModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddWeapon} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-zinc-400 font-medium mb-1">Asset Tag (e.g. AEG-07)</label>
                <input
                  type="text"
                  value={newAssetTag}
                  onChange={(e) => setNewAssetTag(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 font-mono focus:border-red-600 focus:outline-none"
                  placeholder="AEG-07"
                  required
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-medium mb-1">Model Name</label>
                <input
                  type="text"
                  value={newModel}
                  onChange={(e) => setNewModel(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 focus:border-red-600 focus:outline-none"
                  placeholder="Specna Arms Edge SA-E03"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-medium mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e: any) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 focus:border-red-600 focus:outline-none"
                  >
                    <option value="aeg">AEG Rifle</option>
                    <option value="dmr">DMR (Semi-Locked)</option>
                    <option value="sniper">Bolt Action Sniper</option>
                    <option value="pistol">GBB Pistol</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 font-medium mb-1">Serial Number</label>
                  <input
                    type="text"
                    value={newSerial}
                    onChange={(e) => setNewSerial(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 font-mono focus:border-red-600 focus:outline-none"
                    placeholder="SN-2026-99"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-medium mb-1">Battery / Power Source</label>
                <input
                  type="text"
                  value={newBattery}
                  onChange={(e) => setNewBattery(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 focus:border-red-600 focus:outline-none"
                  placeholder="7.4V LiPo Deans"
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
                  disabled={isAddingWeapon}
                  className="px-4 py-2 rounded-lg bg-red-800 hover:bg-red-700 text-white font-bold"
                >
                  {isAddingWeapon ? 'Registering...' : 'Save to Armoury'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
