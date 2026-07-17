import React, { useState } from 'react';
import { Shield, TrendingDown, ArrowRight, RefreshCw, Info, AlertTriangle } from 'lucide-react';
import { Language, TreasuryStats, WalletState } from '../types';
import { translations } from '../translations';

interface TreasurySectionProps {
  language: Language;
  stats: TreasuryStats;
  wallet: WalletState;
  onRedeem: (kdiaAmount: number) => void;
  redeemLoading: boolean;
  onUpdateMarketPrice: (newPrice: number) => void;
}

export const TreasurySection: React.FC<TreasurySectionProps> = ({
  language,
  stats,
  wallet,
  onRedeem,
  redeemLoading,
  onUpdateMarketPrice,
}) => {
  const t = translations[language];
  
  // Set default redeem amount to 25.00 KDIA (matching user's initial wallet balance of 25.00)
  const [redeemAmount, setRedeemAmount] = useState<string>('25');

  const btcbPriceUsdt = 60000;

  // Cast values to Number explicitly to avoid type coercion issues during evaluation
  const marketPriceNum = Number(stats.marketPrice);
  const floorPriceNum = Number(stats.floorPrice);
  const floorPriceInUsdt = floorPriceNum * btcbPriceUsdt;
  
  // Check if Redeem conditions are active: marketPrice <= 95% of priceFloor
  const activationThresholdInUsdt = floorPriceInUsdt * 0.95;
  const isRedeemActive = marketPriceNum <= activationThresholdInUsdt;

  const handleRedeemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(redeemAmount);
    if (isNaN(amount) || amount <= 0) return;
    onRedeem(amount);
  };

  return (
    <div className="neu-card p-8 sm:p-10 relative overflow-hidden border border-emerald-500/20 bg-slate-900/40 backdrop-blur-md rounded-xl space-y-8 shadow-2xl">
      <div className="absolute top-0 left-0 h-40 w-40 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none"></div>
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800/20 pb-6 gap-4 select-none">
        <div className="space-y-1.5">
          <h2 className="text-xl font-bold text-white flex items-center space-x-2.5 tracking-tight font-display">
            <Shield className="h-5.5 w-5.5 text-emerald-400 animate-pulse" />
            <span className="text-emerald-400">{t.treasuryTitle}</span>
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            {t.treasurySubtitle}
          </p>
        </div>
        
        {/* Floor Backing Badge */}
        <div className="flex items-center space-x-2.5 rounded bg-slate-950/40 border border-emerald-500/10 px-4 py-2 self-start md:self-auto shadow-[inset_1px_1px_3px_rgba(0,0,0,0.8)]">
          <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500 font-bold">{t.floorRatio}</span>
          <span className="font-mono text-xs font-black text-emerald-400 animate-pulse">
            100.0% Backed
          </span>
        </div>
      </div>

      {/* Grid of live stats */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-5 select-none">
        
        {/* Stat 1: BTCB Reserve */}
        <div className="neu-card-inset p-5 border border-slate-800 bg-[#0a0d14]/40 rounded-lg">
          <span className="text-[9px] font-mono uppercase tracking-wider text-slate-500 block font-bold">{t.btcbReserves}</span>
          <span className="text-2xl sm:text-3xl font-display font-black text-slate-100 hover:text-white transition-all duration-300 block mt-2 tracking-tight drop-shadow-[0_0_8px_rgba(16,185,129,0.15)] animate-pulse" id="treasury-btcb-reserve">
            {stats.btcbReserve.toLocaleString('en-US', { minimumFractionDigits: 6 })} <span className="text-xs font-semibold text-slate-500">BTCB</span>
          </span>
          <span className="text-[10px] font-mono text-amber-400 block mt-1 font-black">
            ≈ ${(stats.btcbReserve * btcbPriceUsdt).toLocaleString('en-US', { maximumFractionDigits: 0 })} USDT
          </span>
        </div>

        {/* Stat 2: KDIA Reserve */}
        <div className="neu-card-inset p-5 border border-slate-800 bg-[#0a0d14]/40 rounded-lg">
          <span className="text-[9px] font-mono uppercase tracking-wider text-slate-500 block font-bold">{t.kdiaReserves}</span>
          <span className="text-2xl sm:text-3xl font-display font-black text-emerald-400 block mt-2 tracking-tight drop-shadow-[0_0_12px_rgba(16,185,129,0.25)]" id="treasury-kdia-reserve">
            {stats.kdiaReserve.toLocaleString('en-US', { minimumFractionDigits: 2 })} <span className="text-xs font-semibold text-emerald-500/70">KDIA</span>
          </span>
          <span className="text-[10px] font-mono text-slate-400 block mt-1 font-bold">
            For user vesting claims
          </span>
        </div>

        {/* Stat 3: Circulating KDIA */}
        <div className="neu-card-inset p-5 border border-slate-800 bg-[#0a0d14]/40 rounded-lg">
          <span className="text-[9px] font-mono uppercase tracking-wider text-slate-500 block font-bold">{t.circulatingKdia}</span>
          <span className="text-2xl sm:text-3xl font-display font-black text-slate-100 hover:text-white transition-all duration-300 block mt-2 tracking-tight drop-shadow-[0_0_8px_rgba(16,185,129,0.15)]" id="treasury-circulating-kdia">
            {stats.kdiaCirculating.toLocaleString('en-US', { minimumFractionDigits: 2 })} <span className="text-xs font-semibold text-slate-500">KDIA</span>
          </span>
          <span className="text-[10px] font-mono text-emerald-400 block mt-1 font-bold">
            Excludes DEAD address
          </span>
        </div>

        {/* Stat 4: Price Floor */}
        <div className="neu-card-inset p-5 border border-amber-500/10 bg-amber-500/[0.02] relative rounded-lg">
          <div className="absolute top-3 right-3 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500"></span>
          </div>
          <span className="text-[9px] font-mono uppercase tracking-wider text-amber-400 font-extrabold block">{t.priceFloor}</span>
          <span className="text-2xl sm:text-3xl font-display font-black text-amber-400 block mt-2 tracking-tight drop-shadow-[0_0_12px_rgba(245,158,11,0.25)]" id="treasury-price-floor">
            {floorPriceNum.toFixed(8)} <span className="text-xs font-semibold text-amber-500/70">BTCB</span>
          </span>
          <span className="text-[10px] font-mono text-slate-400 block mt-1 font-semibold">
            ≈ ${floorPriceInUsdt.toFixed(4)} USDT
          </span>
        </div>

      </div>

      {/* Market price testing / Slider controls */}
      <div className="neu-card-inset p-6 border border-slate-800 bg-[#0a0d14]/40 rounded-lg select-none">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="flex-1 w-full space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 tracking-wide">
                {t.marketPriceLabel}
              </label>
              <span className="font-display text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight drop-shadow-[0_0_12px_rgba(16,185,129,0.25)]" id="treasury-market-price">
                ${marketPriceNum.toFixed(4)} <span className="text-xs font-semibold text-emerald-500/70">USDT</span>
              </span>
            </div>
            
            <input
              type="range"
              min={(floorPriceInUsdt * 0.5).toFixed(4)}
              max={(floorPriceInUsdt * 1.5).toFixed(4)}
              step="0.001"
              value={stats.marketPrice}
              disabled={true}
              className="w-full h-2 rounded appearance-none bg-slate-950 shadow-[inset_1px_1px_3px_rgba(0,0,0,0.8)] accent-emerald-500 pointer-events-none opacity-55"
              id="market-price-slider"
            />
            
            <div className="flex justify-between font-mono text-[9px] text-slate-500 font-bold tracking-wider uppercase">
              <span>Live On-Chain Feed</span>
              <span className="text-slate-400">Floor: ${floorPriceInUsdt.toFixed(4)} USDT</span>
              <span>DexScreener Synced</span>
            </div>
          </div>

          {/* Condition status card */}
          <div className="lg:w-96 p-5 border border-emerald-500/10 flex items-start space-x-3 rounded-lg bg-emerald-950/10 w-full">
            {isRedeemActive ? (
              <>
                <TrendingDown className="h-6 w-6 text-amber-500 mt-0.5 flex-shrink-0 animate-bounce" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider font-display">
                    {t.marketStatusActive}
                  </h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    Market price (${marketPriceNum.toFixed(3)}) is below 95% of Price Floor (${activationThresholdInUsdt.toFixed(3)}). Penebusan price-floor diizinkan.
                  </p>
                </div>
              </>
            ) : (
              <>
                <Shield className="h-6 w-6 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-display">
                    {t.marketStatusSafe}
                  </h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    Price-floor protection will auto-activate if market price falls below ${activationThresholdInUsdt.toFixed(3)} USDT.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Redemption form */}
      <div className="border-t border-slate-800/20 pt-6 space-y-4">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-white flex items-center space-x-2 font-display">
            <RefreshCw className="h-4.5 w-4.5 text-emerald-400 animate-spin-slow" />
            <span>{t.redeemTitle}</span>
          </h3>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            {t.redeemSubtitle}
          </p>
        </div>

        <form onSubmit={handleRedeemSubmit} className="flex flex-col sm:flex-row items-end gap-4 max-w-3xl">
          <div className="flex-1 w-full">
            <label className="block text-[10px] font-mono uppercase text-slate-500 mb-2 font-bold tracking-wider">
              {t.redeemAmount}
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                step="any"
                value={redeemAmount}
                onChange={(e) => setRedeemAmount(e.target.value)}
                disabled={!isRedeemActive || redeemLoading || !wallet.connected}
                className="w-full bg-slate-950/60 border border-slate-800/60 rounded-lg px-4 py-3 font-mono text-sm text-slate-200 focus:outline-none focus:border-emerald-500/50 disabled:text-slate-600 disabled:bg-slate-950/20"
                placeholder="25.00"
                id="redeem-amount-input"
              />
              <span className="absolute right-5 top-4 font-mono text-xs text-slate-500 font-bold">
                KDIA
              </span>
            </div>
          </div>

          <div className="w-full sm:w-auto">
            <button
              type="submit"
              disabled={!isRedeemActive || redeemLoading || !wallet.connected}
              className={`w-full sm:w-auto py-3.5 px-6 font-display font-black tracking-wider text-xs rounded-lg uppercase shadow-lg border-none transition-all duration-300 flex items-center justify-center space-x-2 ${
                isRedeemActive && wallet.connected && !redeemLoading
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 hover:from-emerald-400 hover:to-teal-300 shadow-emerald-500/10 cursor-pointer hover:scale-[1.01] active:scale-[0.99]'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
              id="execute-redeem-btn"
            >
              <span>{redeemLoading ? t.processing : t.redeemBtn}</span>
              <ArrowRight className="h-4.5 w-4.5" />
            </button>
          </div>
        </form>

        <div className="flex items-center space-x-2 font-mono text-[10px] text-slate-500 font-bold tracking-wide bg-slate-950/10 p-3 rounded-md border border-slate-850">
          <Info className="h-4.5 w-4.5 text-slate-600 flex-shrink-0" />
          <span>Expected Return: <strong className="text-amber-400 font-extrabold">{(parseFloat(redeemAmount) || 0) * stats.floorPrice} BTCB</strong> at present floor ratio.</span>
        </div>
      </div>

    </div>
  );
};
