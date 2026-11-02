import React, { useState } from 'react';
import { 
  PoundSterling, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Download, 
  Upload, 
  Calendar, 
  CreditCard, 
  Banknote, 
  PieChart, 
  ShieldCheck, 
  X,
  FileCheck,
  RefreshCw
} from 'lucide-react';
import { FinanceTransaction, TemplarAdmin } from '../../types';

interface FinanceDepartmentProps {
  finance: FinanceTransaction[];
  activeAdmin: TemplarAdmin;
  onRefresh: () => void;
}

export const FinanceDepartment: React.FC<FinanceDepartmentProps> = ({
  finance,
  activeAdmin,
  onRefresh
}) => {
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [txType, setTxType] = useState<'income' | 'expense'>('income');
  const [category, setCategory] = useState<string>('green_fees');
  const [amount, setAmount] = useState<string>('25.00');
  const [description, setDescription] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | 'bacs'>('card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Financial aggregates
  const totalIncome = finance.filter(f => f.type === 'income').reduce((acc, f) => acc + f.amount, 0);
  const totalExpenses = finance.filter(f => f.type === 'expense').reduce((acc, f) => acc + f.amount, 0);
  const netProfit = totalIncome - totalExpenses;

  const cardIncome = finance.filter(f => f.type === 'income' && f.paymentMethod === 'card').reduce((acc, f) => acc + f.amount, 0);
  const cashIncome = finance.filter(f => f.type === 'income' && f.paymentMethod === 'cash').reduce((acc, f) => acc + f.amount, 0);

  const filteredTransactions = finance.filter(f => filterType === 'all' || f.type === filterType);

  // Handle Submit Transaction
  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/templar/finance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: txType,
          category,
          amount: parseFloat(amount),
          description,
          paymentMethod,
          actor: activeAdmin.name
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setDescription('');
        onRefresh();
      }
    } catch (err) {
      console.warn('Finance transaction error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Full System Export
  const handleExportBackup = () => {
    window.location.href = '/api/templar/backup/export';
  };

  // Import Backup
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        const res = await fetch('/api/templar/backup/import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: parsed })
        });
        const data = await res.json();
        if (data.success) {
          setImportStatus('Backup successfully restored to all 8 departments.');
          onRefresh();
        } else {
          setImportStatus('Failed to restore backup: ' + (data.error || 'Unknown error'));
        }
      } catch (err: any) {
        setImportStatus('Invalid JSON backup file: ' + err?.message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-rose-950/60 text-rose-300 border border-rose-800/40 font-bold">
              DEPARTMENT 06 • FINANCE & COMMERCIAL P&L
            </span>
            <span className="text-zinc-500 text-xs font-mono">Managed by {activeAdmin.name}</span>
          </div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <span>Site Revenue, Operational Outgoings & Event Margins</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Real-time cash flow reconciliation for Templars Woodland Airsoft. Monthly Forestry Lease: £1,200.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportBackup}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs border border-zinc-700/60 transition-all active:scale-95"
            title="Download full JSON encrypted snapshot"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export Snapshot</span>
          </button>

          <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs border border-zinc-700/60 transition-all active:scale-95 cursor-pointer">
            <Upload className="w-4 h-4 text-blue-400" />
            <span>Restore</span>
            <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
          </label>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-800 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-900/30 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Record Transaction</span>
          </button>
        </div>
      </div>

      {importStatus && (
        <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 font-mono flex items-center justify-between">
          <span>{importStatus}</span>
          <button onClick={() => setImportStatus(null)} className="text-zinc-400 hover:text-white">✕</button>
        </div>
      )}

      {/* KPI Cards: Income, Outgoings, Net Profit, Payment Methods */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 shadow-md">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
            <span>Total Gross Income</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            £{totalIncome.toFixed(2)}
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">Green fees, rentals & pyros</div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 shadow-md">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
            <span>Operational Outgoings</span>
            <TrendingDown className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-black text-red-400 font-mono">
            £{totalExpenses.toFixed(2)}
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">Lease, marshals, parts</div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 shadow-md">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
            <span>Net Operating Margin</span>
            <PoundSterling className="w-4 h-4 text-amber-400" />
          </div>
          <div className={`text-2xl font-black font-mono ${netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            £{netProfit.toFixed(2)}
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">Realized cash in bank</div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 shadow-md">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
            <span>Payment Breakdown</span>
            <CreditCard className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-xs text-zinc-300 font-mono space-y-0.5 mt-2">
            <div className="flex justify-between">
              <span>Card / Stripe:</span>
              <strong className="text-white">£{cardIncome.toFixed(2)}</strong>
            </div>
            <div className="flex justify-between">
              <span>Safe Zone Cash:</span>
              <strong className="text-amber-400">£{cashIncome.toFixed(2)}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Ledger Table */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/90 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <PoundSterling className="w-4 h-4 text-red-400" />
            <h3 className="font-bold text-sm text-zinc-100">Audited Financial Ledger</h3>
            <span className="text-xs font-mono text-zinc-500">({finance.length} Transactions)</span>
          </div>

          <div className="flex items-center gap-1 p-1 bg-zinc-950 rounded-lg text-xs font-mono border border-zinc-800">
            {['all', 'income', 'expense'].map((t: any) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1 rounded text-[11px] uppercase transition-all ${
                  filterType === t ? 'bg-red-800 text-white font-bold' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950/70 text-zinc-400 font-mono uppercase text-[10px] border-b border-zinc-800">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Sign-Off</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-mono">
              {filteredTransactions.map((tx) => {
                const isInc = tx.type === 'income';
                return (
                  <tr key={tx.id} className="hover:bg-zinc-850/50 transition-colors">
                    <td className="py-3 px-4 text-zinc-400 text-[11px]">{tx.date}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        isInc ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/40' : 'bg-red-950 text-red-300 border border-red-800/40'
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-zinc-300 font-sans text-xs capitalize">
                      {tx.category.replace('_', ' ')}
                    </td>
                    <td className="py-3 px-4 font-sans text-zinc-200">
                      {tx.description}
                    </td>
                    <td className="py-3 px-4 text-zinc-400 uppercase text-[11px]">
                      {tx.paymentMethod}
                    </td>
                    <td className="py-3 px-4 font-bold text-sm">
                      <span className={isInc ? 'text-emerald-400' : 'text-red-400'}>
                        {isInc ? '+' : '-'}£{tx.amount.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-sans text-zinc-400">
                      {tx.approvedBy ? (
                        <span className="flex items-center gap-1 text-[11px] text-zinc-300">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{tx.approvedBy}</span>
                        </span>
                      ) : (
                        <span className="text-zinc-600 italic">Pending</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Record Transaction */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-zinc-900 border border-zinc-800 p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
              <h3 className="font-bold text-sm text-white">Record Financial Transaction</h3>
              <button onClick={() => setShowAddModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddTransaction} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-medium mb-1">Transaction Type</label>
                  <select
                    value={txType}
                    onChange={(e: any) => setTxType(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 focus:border-red-600 focus:outline-none"
                  >
                    <option value="income">Income (+)</option>
                    <option value="expense">Expense (-)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 font-medium mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 focus:border-red-600 focus:outline-none"
                  >
                    {txType === 'income' ? (
                      <>
                        <option value="green_fees">Green Fees (£25/p)</option>
                        <option value="hire_packages">Hire Packages (£45/p)</option>
                        <option value="pyro_sales">Smoke & Frag Pyros</option>
                        <option value="consumables">BBs & Gas</option>
                        <option value="refreshments">Canteen / Drinks</option>
                        <option value="other">Other Income</option>
                      </>
                    ) : (
                      <>
                        <option value="site_rent">Woodland Site Lease (£1,200)</option>
                        <option value="marshal_wages">Marshal Wages (£80/p)</option>
                        <option value="repairs">AEG Gearbox Parts & Hop-ups</option>
                        <option value="consumables">Wholesale BB Restock</option>
                        <option value="insurance">Public Liability Insurance</option>
                        <option value="other">General Expense</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-medium mb-1">Amount (£)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 font-mono text-sm font-bold focus:border-red-600 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-medium mb-1">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e: any) => setPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 focus:border-red-600 focus:outline-none"
                  >
                    <option value="card">Card / SumUp</option>
                    <option value="cash">Cash in Safe Zone</option>
                    <option value="bacs">BACS Bank Transfer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-medium mb-1">Transaction Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 focus:border-red-600 focus:outline-none"
                  placeholder="e.g. 10 walk-on players morning gate fee"
                  required
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
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg bg-red-800 hover:bg-red-700 text-white font-bold"
                >
                  {isSubmitting ? 'Recording...' : 'Commit to Ledger'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
