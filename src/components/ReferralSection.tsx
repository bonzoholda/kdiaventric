import React, { useState } from 'react';
import { Users, Link as LinkIcon, Copy, Check, Gift, Layers, Calendar, DollarSign, Award, ArrowUpRight, History } from 'lucide-react';
import { Language, ReferralLevelInfo, WalletState } from '../types';
import { translations } from '../translations';

interface ReferralSectionProps {
  language: Language;
  wallet: WalletState;
  levels: ReferralLevelInfo[];
  pendingReferralReward: number;
  appUrl: string;
  totalVestingBonus?: number;
  totalMatrixBonus?: number;
  totalSqueezeBonus?: number;
  totalEarnings?: number;
  squeezeHistory?: Array<{ positionId: number | string; downline: string; bonus: number; txHash: string }>;
  matrixContributors?: string[];
  isRefreshing?: boolean;
}

export const ReferralSection: React.FC<ReferralSectionProps> = ({
  language,
  wallet,
  levels,
  pendingReferralReward,
  appUrl,
  totalVestingBonus = 0,
  totalMatrixBonus = 0,
  totalSqueezeBonus = 0,
  totalEarnings = 0,
  isRefreshing = false,
}) => {
  const t = translations[language];
  const [copied, setCopied] = useState(false);

  // Derive the user's specific referral link and sanitize to prevent Stored XSS
  const mockAddress = wallet.connected && typeof wallet.address === 'string'
    ? wallet.address.replace(/[^a-zA-Z0-9xX]/g, '') 
    : '0x0000000000000000000000000000000000000000';
  const referralLink = `${appUrl}?ref=${mockAddress}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalDownlines = levels.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="neu-card p-6 relative overflow-hidden border-none" id="affiliate-hub-panel">
      <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-rose-500/5 blur-3xl"></div>

      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800/60 pb-5 gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Users className="h-5 w-5 text-rose-500" />
            <span>{t.referralTitle}</span>
            {isRefreshing && (
              <span className="flex items-center space-x-1 ml-2 text-[10px] font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded animate-pulse">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping"></span>
                <span>SYNCING...</span>
              </span>
            )}
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            {t.referralSubtitle}
          </p>
        </div>

        {/* Downline count summary */}
        <div className="flex items-center space-x-4 self-start md:self-auto">
          <div className="neu-card-inset px-3 py-1.5 border-none">
            <span className="text-[10px] font-mono uppercase text-slate-500 font-bold">{t.referralCount}</span>
            <span className={`font-mono text-xs font-bold text-rose-400 ml-2 ${isRefreshing ? 'opacity-60 animate-pulse' : ''}`}>
              {totalDownlines} Downlines
            </span>
          </div>
          <div className="neu-card-inset px-3 py-1.5 border-none">
            <span className="text-[10px] font-mono uppercase text-slate-500 font-bold">Total Earnings</span>
            <span className={`font-mono text-xs font-bold text-emerald-400 ml-2 ${isRefreshing ? 'opacity-60 animate-pulse' : ''}`}>
              ${totalEarnings.toFixed(2)} USDT
            </span>
          </div>
        </div>
      </div>

      {/* Row of level summary widgets and pending rewards */}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        
        {/* Level 1 Card */}
        <div
          className="text-left rounded-md p-4 transition-all border border-transparent neu-card-inset"
        >
          <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block">{t.level1}</span>
          <span className={`text-2xl sm:text-3xl font-display font-black text-rose-100/90 hover:text-white transition-all duration-300 block mt-1 tracking-tight drop-shadow-[0_0_8px_rgba(244,63,94,0.15)] ${isRefreshing ? 'opacity-60 animate-pulse' : ''}`} id="ref-level1-count">
            {levels[0]?.count || 0} <span className="text-xs font-semibold text-slate-400">Users</span>
          </span>
        </div>

        {/* Level 2 Card */}
        <div
          className="text-left rounded-md p-4 transition-all border border-transparent neu-card-inset"
        >
          <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block">{t.level2}</span>
          <span className={`text-2xl sm:text-3xl font-display font-black text-rose-100/90 hover:text-white transition-all duration-300 block mt-1 tracking-tight drop-shadow-[0_0_8px_rgba(244,63,94,0.15)] ${isRefreshing ? 'opacity-60 animate-pulse' : ''}`} id="ref-level2-count">
            {levels[1]?.count || 0} <span className="text-xs font-semibold text-slate-400">Users</span>
          </span>
        </div>

        {/* Level 3 Card */}
        <div
          className="text-left rounded-md p-4 transition-all border border-transparent neu-card-inset"
        >
          <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block">{t.level3}</span>
          <span className={`text-2xl sm:text-3xl font-display font-black text-rose-100/90 hover:text-white transition-all duration-300 block mt-1 tracking-tight drop-shadow-[0_0_8px_rgba(244,63,94,0.15)] ${isRefreshing ? 'opacity-60 animate-pulse' : ''}`} id="ref-level3-count">
            {levels[2]?.count || 0} <span className="text-xs font-semibold text-slate-400">Users</span>
          </span>
        </div>

      </div>

      {/* Three Bonus Streams Breakdown */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {/* Vesting Bonus Stream */}
        <div className="neu-card-inset p-4 rounded-md border-none flex flex-col justify-between bg-slate-950/20">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block">1. Bonus Vesting (Linear)</span>
              <span className={`text-xl font-display font-black text-rose-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.2)] block mt-1 tracking-tight ${isRefreshing ? 'opacity-60 animate-pulse' : ''}`} id="ref-stream-vesting">
                ${totalVestingBonus.toFixed(2)} <span className="text-xs font-semibold text-cyan-400">USDT</span>
              </span>
            </div>
            <span className="h-5 w-5 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 font-mono text-[10px] font-bold">L1-3</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
            {language === 'en' ? 'Calculated from LinearRewardDistributed events when downlines trigger linear vesting payouts.' : 'Dihitung dari event LinearRewardDistributed saat downline memicu pembayaran linear vesting.'}
          </p>
        </div>

        {/* Matrix Bonus Stream */}
        <div className="neu-card-inset p-4 rounded-md border-none flex flex-col justify-between bg-slate-950/20">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-mono uppercase text-rose-300 font-bold block">2. Bonus Matrix ($0.50)</span>
              <span className={`text-xl font-display font-black text-rose-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.2)] block mt-1 tracking-tight ${isRefreshing ? 'opacity-60 animate-pulse' : ''}`} id="ref-stream-matrix">
                ${totalMatrixBonus.toFixed(2)} <span className="text-xs font-semibold text-rose-450/70">USDT</span>
              </span>
            </div>
            <span className="h-5 w-5 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-400 font-mono text-[10px] font-bold">$0.5</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
            {language === 'en' ? `Directly tracks DirectMatrixBonusPaid events ($0.50 USDT per position bought by direct referrals).` : `Melacak event DirectMatrixBonusPaid senilai $0.50 USDT per pembelian posisi oleh referral langsung.`}
          </p>
        </div>

        {/* Squeeze Bonus Stream */}
        <div className="neu-card-inset p-4 rounded-md border-none flex flex-col justify-between bg-slate-950/20">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-mono uppercase text-rose-300 font-bold block">3. Bonus Squeeze ($0.10)</span>
              <span className={`text-xl font-display font-black text-rose-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.2)] block mt-1 tracking-tight ${isRefreshing ? 'opacity-60 animate-pulse' : ''}`} id="ref-stream-squeeze">
                ${totalSqueezeBonus.toFixed(2)} <span className="text-xs font-semibold text-rose-450/70">USDT</span>
              </span>
            </div>
            <span className="h-5 w-5 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-400 font-mono text-[10px] font-bold">$0.1</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
            {language === 'en' ? 'Tracks FIFO PositionMaturedLog events with SQUEEZE_INSTANT_PAYOUT cross-referenced to sponsor.' : 'Melacak event FIFO PositionMaturedLog dengan tipe SQUEEZE_INSTANT_PAYOUT yang dirujuk silang ke sponsor.'}
          </p>
        </div>
      </div>

      {/* Referral Link copy-paste module */}
      <div className="mt-6 neu-card-inset p-5 border-none">
        <h3 className="text-sm font-semibold text-white flex items-center space-x-1.5">
          <LinkIcon className="h-4 w-4 text-rose-400" />
          <span>{t.referralLinkCard}</span>
        </h3>
        <p className="text-[11px] text-slate-400 mt-1 leading-normal">
          {t.referralLinkDesc}
        </p>

        <div className="mt-4 flex flex-col sm:flex-row items-stretch gap-3">
          <div className="flex-1 rounded-md bg-[#111319] shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5)] px-4 py-3 font-mono text-xs text-slate-300 overflow-x-auto whitespace-nowrap scrollbar-none select-all flex items-center">
            {referralLink}
          </div>
          
          <button
            onClick={handleCopyLink}
            className="neu-btn text-cyan-400 hover:text-cyan-300 font-bold px-5 py-3 text-xs flex items-center justify-center space-x-1.5 transition-colors border-none cursor-pointer"
            id="copy-referral-link-btn"
          >
            {copied ? (
              <>
                <Check className="h-4.5 w-4.5" />
                <span>{t.copied}</span>
              </>
            ) : (
              <>
                <Copy className="h-4.5 w-4.5" />
                <span>{t.copyLinkBtn}</span>
              </>
            )}
          </button>
        </div>
      </div>


    </div>
  );
};
