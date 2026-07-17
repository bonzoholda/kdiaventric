import React from 'react';
import { Lock, Unlock, HelpCircle } from 'lucide-react';
import { Language, WalletState, UserVesting } from '../types';
import { translations } from '../translations';

interface OverviewProps {
  language: Language;
  wallet: WalletState;
  vesting: UserVesting;
  pendingVestingAmount: number;
  onClaimVesting: () => void;
  claimLoading: boolean;
}

export const Overview: React.FC<OverviewProps> = ({
  language,
  wallet,
  vesting,
  pendingVestingAmount,
  onClaimVesting,
  claimLoading,
}) => {
  const t = translations[language];

  const hasAllocated = vesting.total > 0;
  const remaining = vesting.total - vesting.claimed;
  const progressPercent = hasAllocated ? (vesting.claimed / vesting.total) * 100 : 0;

  return (
    <div className="grid gap-8 md:grid-cols-3 select-none">
      
      {/* Wallet Balance Summary Panel */}
      <div className="md:col-span-1 neu-card p-6 sm:p-8 relative overflow-hidden border border-slate-800 bg-slate-900/40 backdrop-blur-md rounded-xl flex flex-col justify-between">
        <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-emerald-500/5 blur-2xl pointer-events-none"></div>
        
        <div>
          <h3 className="font-mono text-[10px] tracking-widest text-emerald-400 font-extrabold uppercase">
            {t.walletAddress}
          </h3>
          
          <p className="mt-2.5 font-mono text-xs font-semibold text-slate-300 truncate bg-slate-950/60 px-3 py-2 rounded-md border border-slate-800">
            {wallet.connected ? wallet.address : (language === 'en' ? 'Wallet Not Connected' : 'Dompet Belum Terhubung')}
          </p>

          <div className="mt-6 space-y-4">
            <div className="flex flex-col p-4 rounded-lg bg-slate-950/40 border border-slate-850 hover:border-slate-800 transition-all duration-300">
              <span className="text-xs text-slate-400 font-medium">{t.usdtBalance}</span>
              <span className="font-display font-black text-slate-100 hover:text-white transition-all duration-300 text-2xl mt-1 tracking-tight" id="wallet-usdt-balance">
                ${wallet.usdtBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
            
            <div className="flex flex-col p-4 rounded-lg bg-slate-950/40 border border-emerald-500/10 hover:border-emerald-500/20 transition-all duration-300">
              <span className="text-xs text-slate-400 font-medium">{t.kdiaBalance}</span>
              <span className="font-display font-black text-emerald-400 text-2xl mt-1 tracking-tight drop-shadow-[0_0_12px_rgba(16,185,129,0.2)] transition-all duration-300 hover:scale-[1.01]" id="wallet-kdia-balance">
                {wallet.kdiaBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })} <span className="text-xs font-semibold text-slate-500">KDIA</span>
              </span>
            </div>

            <div className="flex flex-col p-4 rounded-lg bg-slate-950/40 border border-slate-850 hover:border-slate-800 transition-all duration-300">
              <span className="text-xs text-slate-400 font-medium">{t.btcbBalance}</span>
              <span className="font-display font-black text-slate-100 hover:text-white transition-all duration-300 text-2xl mt-1 tracking-tight" id="wallet-btcb-balance">
                {wallet.btcbBalance.toLocaleString('en-US', { minimumFractionDigits: 6 })} <span className="text-xs font-semibold text-slate-500">BTCB</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Vesting Contract Panel (80% allocation) */}
      <div className="md:col-span-2 neu-card p-6 sm:p-8 relative overflow-hidden flex flex-col justify-between border border-emerald-500/20 bg-slate-900/40 backdrop-blur-md rounded-xl">
        <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none"></div>

        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/40">
            <h3 className="font-display text-md font-extrabold text-white flex items-center space-x-2.5 tracking-tight">
              <Lock className="h-5 w-5 text-emerald-400" />
              <span>{t.yourVesting}</span>
            </h3>
            {hasAllocated && (
              <span className="rounded bg-emerald-500/10 px-3 py-1 font-mono text-[10px] text-emerald-400 border border-emerald-500/20 font-extrabold uppercase tracking-wider">
                {progressPercent.toFixed(1)}% {language === 'en' ? 'Claimed' : 'Diklaim'}
              </span>
            )}
          </div>

          {!hasAllocated ? (
            <div className="my-8 text-center py-10 border border-dashed border-slate-850 rounded-lg bg-slate-950/20">
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                {t.notDeposited}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-950/40 p-4 rounded-lg border border-slate-850">
                <span className="block text-[9px] font-mono uppercase text-slate-500 font-bold tracking-wider">Total Vested</span>
                <span className="font-display text-lg sm:text-xl font-black text-slate-200 mt-1.5 block tracking-tight" id="vested-total">
                  {vesting.total.toFixed(2)} <span className="text-[10px] font-semibold text-slate-500">KDIA</span>
                </span>
              </div>
              
              <div className="bg-slate-950/40 p-4 rounded-lg border border-slate-850">
                <span className="block text-[9px] font-mono uppercase text-slate-500 font-bold tracking-wider">{t.vestingClaimed}</span>
                <span className="font-display text-lg sm:text-xl font-black text-slate-200 mt-1.5 block tracking-tight" id="vested-claimed">
                  {vesting.claimed.toFixed(2)} <span className="text-[10px] font-semibold text-slate-500">KDIA</span>
                </span>
              </div>
              
              <div className="bg-slate-950/40 p-4 rounded-lg border border-slate-850">
                <span className="block text-[9px] font-mono uppercase text-slate-500 font-bold tracking-wider">{t.vestingRemaining}</span>
                <span className="font-display text-lg sm:text-xl font-black text-slate-200 mt-1.5 block tracking-tight" id="vested-remaining">
                  {remaining.toFixed(2)} <span className="text-[10px] font-semibold text-slate-500">KDIA</span>
                </span>
              </div>
              
              <div className="bg-emerald-500/5 p-4 rounded-lg border border-emerald-500/20">
                <span className="block text-[9px] font-mono uppercase text-emerald-400 font-bold tracking-wider">{t.pendingClaim}</span>
                <span className="font-display text-lg sm:text-xl font-black text-emerald-400 mt-1.5 block animate-pulse tracking-tight drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]" id="vested-pending">
                  {pendingVestingAmount.toFixed(4)} <span className="text-[10px] font-semibold text-emerald-500">KDIA</span>
                </span>
              </div>
            </div>
          )}

          {/* Progress bar */}
          {hasAllocated && (
            <div className="py-2">
              <div className="h-2.5 w-full rounded bg-slate-950/60 overflow-hidden p-[1.5px] border border-slate-850 shadow-[inset_1px_1px_3px_rgba(0,0,0,0.8)]">
                <div
                  className="h-full rounded bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          )}

          <p className="text-[11px] leading-relaxed text-slate-400 flex items-start space-x-2 bg-slate-950/40 p-3.5 rounded-lg border border-slate-850">
            <HelpCircle className="h-4.5 w-4.5 text-slate-500 flex-shrink-0 mt-0.5" />
            <span>{t.vestingDesc}</span>
          </p>
        </div>

        {/* Claim Buttons */}
        {hasAllocated && (
          <div className="mt-4 pt-4 border-t border-slate-800/40 flex flex-col sm:flex-row items-center justify-end gap-4">
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
              <button
                onClick={onClaimVesting}
                disabled={pendingVestingAmount <= 0 || claimLoading || !wallet.connected}
                className={`w-full sm:w-auto font-display font-black tracking-wider text-xs px-6 py-3.5 rounded-lg border-none flex items-center justify-center space-x-2 cursor-pointer transition-all duration-300 ${
                  wallet.connected && pendingVestingAmount > 0 && !claimLoading
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 hover:from-emerald-400 hover:to-teal-300 shadow-lg shadow-emerald-500/10 hover:scale-[1.01] active:scale-[0.99]'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
                id="claim-vesting-btn"
              >
                <Unlock className="h-4 w-4" />
                <span>{claimLoading ? t.processing : t.claimVesting}</span>
              </button>
            </div>
          </div>
        )}

      </div>
      
    </div>
  );
};
