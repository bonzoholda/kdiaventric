import React from 'react';
import { Lock, Unlock, Zap, ChevronRight, HelpCircle, History } from 'lucide-react';
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
    <div className="grid gap-8 md:grid-cols-3">
      
      {/* Wallet Balance Summary Panel */}
      <div className="md:col-span-1 neu-card p-8 relative overflow-hidden border-none flex flex-col justify-between">
        <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-rose-500/5 blur-2xl"></div>
        
        <div>
          <h3 className="font-mono text-[10px] tracking-widest text-rose-400 font-bold uppercase">
            {t.walletAddress}
          </h3>
          
          <p className="mt-2.5 font-mono text-xs sm:text-[13px] font-semibold text-slate-200 truncate bg-slate-950/40 px-3 py-2 rounded-md border border-white/5">
            {wallet.connected ? wallet.address : 'Wallet Not Connected'}
          </p>

          <div className="mt-8 space-y-5">
            <div className="flex flex-col p-4 rounded-md bg-[#111319]/25 border border-slate-800/10 hover:bg-[#111319]/40 transition-all duration-300">
              <span className="text-xs text-slate-400 font-medium">{t.usdtBalance}</span>
              <span className="font-display font-black text-rose-100/90 hover:text-white transition-all duration-300 text-2xl sm:text-3xl mt-1 tracking-tight drop-shadow-[0_0_8px_rgba(244,63,94,0.15)]" id="wallet-usdt-balance">
                ${wallet.usdtBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
            
            <div className="flex flex-col p-4 rounded-md bg-[#111319]/25 border border-slate-800/10 hover:bg-[#111319]/40 transition-all duration-300">
              <span className="text-xs text-slate-400 font-medium">{t.kdiaBalance}</span>
              <span className="font-display font-black text-rose-400 text-2xl sm:text-3xl mt-1 tracking-tight drop-shadow-[0_0_12px_rgba(244,63,94,0.3)] transition-all duration-300 hover:scale-[1.01]" id="wallet-kdia-balance">
                {wallet.kdiaBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })} <span className="text-xs font-semibold text-rose-500/60">KDIA</span>
              </span>
            </div>

            <div className="flex flex-col p-4 rounded-md bg-[#111319]/25 border border-slate-800/10 hover:bg-[#111319]/40 transition-all duration-300">
              <span className="text-xs text-slate-400 font-medium">{t.btcbBalance}</span>
              <span className="font-display font-black text-rose-100/90 hover:text-white transition-all duration-300 text-2xl sm:text-3xl mt-1 tracking-tight drop-shadow-[0_0_8px_rgba(244,63,94,0.15)]" id="wallet-btcb-balance">
                {wallet.btcbBalance.toLocaleString('en-US', { minimumFractionDigits: 6 })} <span className="text-xs font-semibold text-slate-500">BTCB</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Vesting Contract Panel (80% allocation) */}
      <div className="md:col-span-2 neu-card p-8 sm:p-10 relative overflow-hidden flex flex-col justify-between border-none">
        <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-rose-500/5 blur-3xl"></div>

        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/20">
            <h3 className="font-display text-lg font-bold text-white flex items-center space-x-2.5 tracking-tight">
              <Lock className="h-5 w-5 text-rose-500" />
              <span>{t.yourVesting}</span>
            </h3>
            {hasAllocated && (
              <span className="rounded bg-rose-500/10 px-3 py-1 font-mono text-[10px] text-rose-400 font-extrabold uppercase tracking-wider">
                {progressPercent.toFixed(1)}% {language === 'en' ? 'Claimed' : 'Diklaim'}
              </span>
            )}
          </div>

          {!hasAllocated ? (
            <div className="my-8 text-center py-10 border border-dashed border-slate-800/50 rounded-md bg-slate-950/20">
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                {t.notDeposited}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-5">
              <div className="neu-card-inset p-4 rounded-md border-none">
                <span className="block text-[9px] font-mono uppercase text-slate-500 font-bold tracking-widest">Total Vested</span>
                <span className="font-display text-2xl sm:text-3xl font-black text-rose-100/90 mt-1.5 block tracking-tight drop-shadow-[0_0_8px_rgba(244,63,94,0.15)]" id="vested-total">
                  {vesting.total.toFixed(2)} <span className="text-xs font-semibold text-slate-500">KDIA</span>
                </span>
              </div>
              <div className="neu-card-inset p-4 rounded-md border-none">
                <span className="block text-[9px] font-mono uppercase text-slate-500 font-bold tracking-widest">{t.vestingClaimed}</span>
                <span className="font-display text-2xl sm:text-3xl font-black text-rose-400 mt-1.5 block tracking-tight drop-shadow-[0_0_12px_rgba(244,63,94,0.25)]" id="vested-claimed">
                  {vesting.claimed.toFixed(2)} <span className="text-xs font-semibold text-rose-500/70">KDIA</span>
                </span>
              </div>
              <div className="neu-card-inset p-4 rounded-md border-none">
                <span className="block text-[9px] font-mono uppercase text-slate-500 font-bold tracking-widest">{t.vestingRemaining}</span>
                <span className="font-display text-2xl sm:text-3xl font-black text-rose-300/80 mt-1.5 block tracking-tight" id="vested-remaining">
                  {remaining.toFixed(2)} <span className="text-xs font-semibold text-slate-500">KDIA</span>
                </span>
              </div>
              <div className="neu-card-inset p-4 rounded-md border-none relative bg-rose-500/[0.01]">
                <span className="block text-[9px] font-mono uppercase text-rose-400 font-bold tracking-widest">{t.pendingClaim}</span>
                <span className="font-display text-2xl sm:text-3xl font-black text-rose-400 mt-1.5 block animate-pulse tracking-tight drop-shadow-[0_0_15px_rgba(244,63,94,0.3)]" id="vested-pending">
                  {pendingVestingAmount.toFixed(4)} <span className="text-xs font-semibold text-rose-500/70">KDIA</span>
                </span>
              </div>
            </div>
          )}

          {/* Progress bar */}
          {hasAllocated && (
            <div className="py-2">
              <div className="h-2.5 w-full rounded bg-slate-950/40 overflow-hidden p-[2px] border border-white/[0.02] shadow-[inset_1px_1px_3px_rgba(0,0,0,0.8)]">
                <div
                  className="h-full rounded bg-gradient-to-r from-rose-600 via-rose-500 to-rose-400 transition-all duration-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          )}

          <p className="text-[11px] leading-relaxed text-slate-400 flex items-start space-x-2 bg-slate-950/10 p-3 rounded-md border border-white/[0.02]">
            <HelpCircle className="h-4.5 w-4.5 text-slate-500 flex-shrink-0 mt-0.5" />
            <span>{t.vestingDesc}</span>
          </p>
        </div>

        {/* Claim Buttons */}
        {hasAllocated && (
          <div className="mt-8 pt-6 border-t border-slate-800/40 flex flex-col sm:flex-row items-center justify-end gap-4">
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
              <button
                onClick={onClaimVesting}
                disabled={pendingVestingAmount <= 0 || claimLoading || !wallet.connected}
                className={`w-full sm:w-auto font-bold text-xs px-6 py-3 transition-all border-none flex items-center justify-center space-x-2 rounded cursor-pointer ${
                  wallet.connected && pendingVestingAmount > 0 && !claimLoading
                    ? 'neu-btn-green text-[#0c0b0a] shadow-md shadow-cyan-500/10 hover:scale-[1.01] active:scale-[0.99]'
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
