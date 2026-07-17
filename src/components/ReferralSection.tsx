import React, { useState } from 'react';
import { Users, Link as LinkIcon, Copy, Check, Gift, Layers, Coins } from 'lucide-react';
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
    <div className="neu-card p-6 sm:p-8 relative overflow-hidden border border-emerald-500/20 bg-slate-900/40 backdrop-blur-md rounded-xl select-none" id="affiliate-hub-panel">
      <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none"></div>

      {/* Header & Main Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800/40 pb-5 gap-4">
        <div className="space-y-1">
          <h2 className="text-md font-extrabold text-white flex items-center space-x-2.5 tracking-tight font-display">
            <Users className="h-5 w-5 text-emerald-400 animate-pulse" />
            <span className="text-emerald-400">{t.referralTitle}</span>
            {isRefreshing && (
              <span className="flex items-center space-x-1 text-[8px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded animate-pulse">
                <span className="h-1 w-1 rounded-full bg-emerald-500"></span>
                <span>SYNCING...</span>
              </span>
            )}
          </h2>
          <p className="text-[11px] text-slate-400 max-w-xl">
            {t.referralSubtitle}
          </p>
        </div>

        {/* Downlines Summary */}
        <div className="flex items-center space-x-4 self-start md:self-auto font-mono text-[10px]">
          <div className="bg-slate-950/40 px-3.5 py-2 rounded-lg border border-slate-850">
            <span className="text-slate-500 font-bold uppercase">{t.referralCount}</span>
            <span className={`text-emerald-400 ml-2 font-black ${isRefreshing ? 'opacity-60 animate-pulse' : ''}`}>
              {totalDownlines} Downlines
            </span>
          </div>
          <div className="bg-slate-950/40 px-3.5 py-2 rounded-lg border border-slate-850">
            <span className="text-slate-500 font-bold uppercase">Total Earnings</span>
            <span className={`text-amber-400 ml-2 font-black ${isRefreshing ? 'opacity-60 animate-pulse' : ''}`}>
              ${totalEarnings.toLocaleString('en-US', { minimumFractionDigits: 2 })} USDT
            </span>
          </div>
        </div>
      </div>

      {/* 3-Levels breakdown cards */}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {/* Level 1 Card */}
        <div className="bg-slate-950/40 p-4 rounded-lg border border-slate-850 relative">
          <span className="text-[9px] font-mono uppercase text-emerald-400 font-extrabold tracking-wider block">{t.level1}</span>
          <span className={`text-xl sm:text-2xl font-display font-black text-slate-200 mt-1 block ${isRefreshing ? 'opacity-60 animate-pulse' : ''}`} id="ref-level1-count">
            {levels[0]?.count || 0} <span className="text-xs font-semibold text-slate-500">Users</span>
          </span>
        </div>

        {/* Level 2 Card */}
        <div className="bg-slate-950/40 p-4 rounded-lg border border-slate-850 relative">
          <span className="text-[9px] font-mono uppercase text-emerald-400 font-extrabold tracking-wider block">{t.level2}</span>
          <span className={`text-xl sm:text-2xl font-display font-black text-slate-200 mt-1 block ${isRefreshing ? 'opacity-60 animate-pulse' : ''}`} id="ref-level2-count">
            {levels[1]?.count || 0} <span className="text-xs font-semibold text-slate-500">Users</span>
          </span>
        </div>

        {/* Level 3 Card */}
        <div className="bg-slate-950/40 p-4 rounded-lg border border-slate-850 relative">
          <span className="text-[9px] font-mono uppercase text-emerald-400 font-extrabold tracking-wider block">{t.level3}</span>
          <span className={`text-xl sm:text-2xl font-display font-black text-slate-200 mt-1 block ${isRefreshing ? 'opacity-60 animate-pulse' : ''}`} id="ref-level3-count">
            {levels[2]?.count || 0} <span className="text-xs font-semibold text-slate-500">Users</span>
          </span>
        </div>
      </div>

      {/* Bonus Streams breakdown */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {/* Bonus Vesting */}
        <div className="bg-slate-950/40 p-4 rounded-lg border border-slate-850 flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-0.5">
              <span className="text-[9px] font-mono uppercase text-emerald-400 font-extrabold block">1. Linear Vesting Bonus</span>
              <span className={`text-lg font-display font-black text-emerald-400 block ${isRefreshing ? 'opacity-60 animate-pulse' : ''}`} id="ref-stream-vesting">
                ${totalVestingBonus.toLocaleString('en-US', { minimumFractionDigits: 2 })} <span className="text-[10px] font-semibold text-slate-500">USDT</span>
              </span>
            </div>
            <span className="h-5 w-5 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-mono text-[9px] font-extrabold border border-emerald-500/20">L1-3</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
            {language === 'en' 
              ? 'Calculated from LinearRewardDistributed events when downlines trigger linear vesting payouts.' 
              : 'Dihitung dari event LinearRewardDistributed saat downline memicu pembayaran linear vesting.'}
          </p>
        </div>

        {/* Bonus Matrix */}
        <div className="bg-slate-950/40 p-4 rounded-lg border border-slate-850 flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-0.5">
              <span className="text-[9px] font-mono uppercase text-emerald-400 font-extrabold block">2. Matrix Bonus ($0.50)</span>
              <span className={`text-lg font-display font-black text-emerald-400 block ${isRefreshing ? 'opacity-60 animate-pulse' : ''}`} id="ref-stream-matrix">
                ${totalMatrixBonus.toLocaleString('en-US', { minimumFractionDigits: 2 })} <span className="text-[10px] font-semibold text-slate-500">USDT</span>
              </span>
            </div>
            <span className="h-5 w-5 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-mono text-[9px] font-extrabold border border-emerald-500/20">$0.5</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
            {language === 'en' 
              ? 'Directly tracks DirectMatrixBonusPaid events ($0.50 USDT per position bought by direct referrals).' 
              : 'Melacak event DirectMatrixBonusPaid senilai $0.50 USDT per pembelian posisi oleh referral langsung.'}
          </p>
        </div>

        {/* Bonus Squeeze */}
        <div className="bg-slate-950/40 p-4 rounded-lg border border-slate-850 flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-0.5">
              <span className="text-[9px] font-mono uppercase text-emerald-400 font-extrabold block">3. Squeezer Bonus ($0.10)</span>
              <span className={`text-lg font-display font-black text-emerald-400 block ${isRefreshing ? 'opacity-60 animate-pulse' : ''}`} id="ref-stream-squeeze">
                ${totalSqueezeBonus.toLocaleString('en-US', { minimumFractionDigits: 2 })} <span className="text-[10px] font-semibold text-slate-500">USDT</span>
              </span>
            </div>
            <span className="h-5 w-5 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-mono text-[9px] font-extrabold border border-emerald-500/20">$0.1</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
            {language === 'en' 
              ? 'Tracks FIFO PositionMaturedLog events with SQUEEZE_INSTANT_PAYOUT cross-referenced to sponsor.' 
              : 'Melacak event FIFO PositionMaturedLog dengan tipe SQUEEZE_INSTANT_PAYOUT yang dirujuk silang ke sponsor.'}
          </p>
        </div>
      </div>

      {/* Copyable referral Link segment */}
      <div className="mt-6 p-5 rounded-lg bg-slate-950/40 border border-slate-850 space-y-4">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center space-x-1.5">
            <LinkIcon className="h-4 w-4 text-emerald-400" />
            <span>{t.referralLinkCard}</span>
          </h3>
          <p className="text-[11px] text-slate-400 leading-normal">
            {t.referralLinkDesc}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch gap-3">
          <div className="flex-1 rounded-lg bg-[#0a0c14] border border-slate-800 px-4 py-3 font-mono text-xs text-slate-300 overflow-x-auto whitespace-nowrap scrollbar-none select-all flex items-center">
            {referralLink}
          </div>
          
          <button
            onClick={handleCopyLink}
            className="px-5 py-3 font-display font-black tracking-wider text-xs rounded-lg border-none cursor-pointer transition-all duration-300 flex items-center justify-center space-x-1.5 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 hover:from-emerald-400 hover:to-teal-300 shadow-lg shadow-emerald-500/10 hover:scale-[1.01] active:scale-[0.99]"
            id="copy-referral-link-btn"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                <span>{t.copied}</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>{t.copyLinkBtn}</span>
              </>
            )}
          </button>
        </div>
      </div>

    </div>
  );
};
