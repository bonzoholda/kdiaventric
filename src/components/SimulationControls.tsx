import React from 'react';
import { Play, RotateCcw, Plus, Percent, RefreshCw, Terminal, Clock, ExternalLink } from 'lucide-react';
import { Language, TransactionHistory } from '../types';
import { translations } from '../translations';

interface SimulationControlsProps {
  language: Language;
  onAddMockUsers: () => void;
  onAddUsdtFunds: () => void;
  onSlashPrice: () => void;
  onBoostPrice: () => void;
  onResetSimulation: () => void;
  txHistory: TransactionHistory[];
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  language,
  onAddMockUsers,
  onAddUsdtFunds,
  onSlashPrice,
  onBoostPrice,
  onResetSimulation,
  txHistory,
}) => {
  const t = translations[language];

  return (
    <div className="neu-card p-8 sm:p-10 relative overflow-hidden border-none space-y-8">
      <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-indigo-500/5 blur-2xl"></div>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/20 pb-5 gap-3">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center space-x-2.5 tracking-tight font-display">
            <Terminal className="h-5 w-5 text-rose-500" />
            <span>{t.simTitle}</span>
          </h2>
          <p className="mt-2 text-xs text-slate-400 leading-relaxed">
            {t.simSubtitle}
          </p>
        </div>

        <button
          onClick={onResetSimulation}
          className="neu-btn text-emerald-400 font-mono text-[11px] font-bold uppercase tracking-wider px-4 py-2 transition-all border-none flex items-center space-x-2 cursor-pointer shadow-sm hover:text-emerald-300"
          title="Reset simulation parameters and wallet balances"
        >
          <RotateCcw className="h-3.5 w-3.5 text-emerald-400" />
          <span>Reset Demo</span>
        </button>
      </div>

      {/* Control Actions */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Action 1: Add Matrix Users */}
        <div className="neu-card-inset p-6 flex flex-col justify-between border-none min-h-[190px]">
          <div>
            <h4 className="text-xs font-bold text-slate-200 font-mono uppercase tracking-wider">{t.addMockUsers}</h4>
            <p className="mt-2.5 text-[11px] text-slate-400 leading-relaxed">
              {t.addMockUsersDesc}
            </p>
          </div>
          <button
            onClick={onAddMockUsers}
            className="mt-5 w-full neu-btn text-emerald-400 py-3 text-xs font-extrabold flex items-center justify-center space-x-2 transition-all border-none cursor-pointer hover:text-emerald-300"
          >
            <Plus className="h-4 w-4 text-emerald-400" />
            <span>Simulate Traffic</span>
          </button>
        </div>

        {/* Action 2: Add USDT Funds */}
        <div className="neu-card-inset p-6 flex flex-col justify-between border-none min-h-[190px]">
          <div>
            <h4 className="text-xs font-bold text-slate-200 font-mono uppercase tracking-wider">{t.addUsdtFunds}</h4>
            <p className="mt-2.5 text-[11px] text-slate-400 leading-relaxed">
              {t.addUsdtFundsDesc}
            </p>
          </div>
          <button
            onClick={onAddUsdtFunds}
            className="mt-5 w-full neu-btn text-emerald-400 py-3 text-xs font-extrabold flex items-center justify-center space-x-2 transition-all border-none cursor-pointer hover:text-emerald-300"
          >
            <Plus className="h-4 w-4 text-emerald-400" />
            <span>Fund Wallet</span>
          </button>
        </div>

        {/* Action 3: Slash Price */}
        <div className="neu-card-inset p-6 flex flex-col justify-between border-none min-h-[190px] bg-rose-550/5">
          <div>
            <h4 className="text-xs font-bold text-rose-400 font-mono uppercase tracking-wider">{t.dropKdiaPrice}</h4>
            <p className="mt-2.5 text-[11px] text-slate-400 leading-relaxed">
              Slashes simulated market price to invoke and unlock the Treasury price-floor redemption mode.
            </p>
          </div>
          <button
            onClick={onSlashPrice}
            className="mt-5 w-full neu-btn text-emerald-400 py-3 text-xs font-extrabold flex items-center justify-center space-x-2 transition-all border-none cursor-pointer hover:text-emerald-300"
          >
            <Percent className="h-4 w-4 text-emerald-400" />
            <span>Drop -30% Price</span>
          </button>
        </div>

        {/* Action 4: Boost Price */}
        <div className="neu-card-inset p-6 flex flex-col justify-between border-none min-h-[190px] bg-rose-550/5">
          <div>
            <h4 className="text-xs font-bold text-rose-400 font-mono uppercase tracking-wider">{t.raiseKdiaPrice}</h4>
            <p className="mt-2.5 text-[11px] text-slate-400 leading-relaxed">
              Simulates favorable market conditions to stabilize KDIA price and lock redemption.
            </p>
          </div>
          <button
            onClick={onBoostPrice}
            className="mt-5 w-full neu-btn text-emerald-400 py-3 text-xs font-extrabold flex items-center justify-center space-x-2 transition-all border-none cursor-pointer hover:text-emerald-300"
          >
            <Percent className="h-4 w-4 text-emerald-400" />
            <span>Boost +30% Price</span>
          </button>
        </div>

      </div>

      {/* Transaction History / Ledger */}
      <div className="mt-6 border-t border-slate-800/60 pt-5">
        <h3 className="text-xs font-mono uppercase text-slate-400 font-bold mb-3 flex items-center space-x-1.5">
          <Clock className="h-4 w-4 text-rose-400" />
          <span>{t.txLedger}</span>
        </h3>

        <div className="overflow-x-auto neu-card-inset border-none">
          <table className="w-full text-left border-collapse text-[11px] font-mono">
            <thead>
              <tr className="border-b border-[#0c0e12]/60 bg-slate-950/20 text-slate-500 uppercase font-bold">
                <th className="px-3.5 py-3">{t.txTime}</th>
                <th className="px-3.5 py-3">{t.txType}</th>
                <th className="px-3.5 py-3">{t.txDetails}</th>
                <th className="px-3.5 py-3">{t.txHash}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0c0e12]/30 text-slate-300">
              {txHistory.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-3 py-6 text-center text-slate-600 italic">
                    {t.noTxs}
                  </td>
                </tr>
              ) : (
                txHistory.map((tx, idx) => {
                  let badgeColor = 'bg-[#1b1f2b] text-slate-400';
                  if (tx.type === 'deposit') badgeColor = 'bg-rose-550/10 text-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.1)]';
                  if (tx.type === 'claim_ref') badgeColor = 'bg-rose-550/10 text-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.1)]';
                  if (tx.type === 'claim_matrix') badgeColor = 'bg-rose-550/10 text-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.1)]';
                  if (tx.type === 'vesting_claim') badgeColor = 'bg-slate-550/10 text-slate-300 shadow-[0_0_8px_rgba(255,255,255,0.05)]';
                  if (tx.type === 're_entry') badgeColor = 'bg-rose-550/10 text-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.1)]';
                  if (tx.type === 'redeem') badgeColor = 'bg-rose-550/10 text-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.1)]';

                  return (
                    <tr key={`${tx.id}-${idx}`} className="hover:bg-slate-950/10">
                      <td className="px-3.5 py-3.5 text-slate-500">
                        {new Date(tx.timestamp).toLocaleTimeString('en-US')}
                      </td>
                      <td className="px-3.5 py-3.5">
                        <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase ${badgeColor}`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="px-3.5 py-3.5 text-slate-200">
                        {tx.type === 'deposit' && `Deposited $${tx.amount} USDT`}
                        {tx.type === 'claim_ref' && `Claimed $${tx.amount} USDT Referral Commission`}
                        {tx.type === 'claim_matrix' && `Claimed $${tx.amount} USDT Matrix Reward`}
                        {tx.type === 'vesting_claim' && `Claimed ${tx.amount} KDIA from Vesting Pool`}
                        {tx.type === 'redeem' && `Redeemed ${tx.amount} KDIA for BTCB`}
                        {tx.type === 're_entry' && `Matrix Auto Re-Entry generated position`}
                      </td>
                      <td className="px-3.5 py-3.5 text-indigo-400 hover:text-indigo-300 flex items-center space-x-1">
                        <span className="truncate max-w-24 font-mono">{tx.txHash}</span>
                        <ExternalLink className="h-3 w-3" />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
