import React, { useState, useEffect } from 'react';
import { 
  Layers, ArrowRight, Check, Sparkles, ListOrdered, 
  CircleCheck, AlertCircle, Users, Zap, Clock 
} from 'lucide-react';
import { Language, WalletState, QueueUser } from '../types';
import { translations } from '../translations';

interface DepositMatrixProps {
  language: Language;
  wallet: WalletState;
  queue: QueueUser[];
  globalQueueLength: number;
  userQueueIndex: number;
  userPositions: number[];
  setSelectedPositionIndex: (idx: number) => void;
  onDeposit: (amount: number, referrer: string) => void;
  onBuyMatrixOnly: (referrer: string) => void;
  onRegisterAsInfluencer: (referrer: string) => void;
  onRefresh: () => void;
  depositLoading: boolean;
  buyMatrixLoading: boolean;
  registerInfluencerLoading: boolean;
  referrerAddress: string;
  setReferrerAddress: (addr: string) => void;
  isReferrerLocked: boolean;
  microFifoBalance: number;
  positionsDetails: { [key: number]: { owner: string; entryTime: number; isProcessed: boolean } };
  nextProcessPositionPointer: number;
  onSqueeze: (positionId: number) => void;
  squeezeLoading: { [key: number]: boolean };
  onClaimForcedMaturity: () => void;
  claimForcedLoading: boolean;
  isRefreshing?: boolean;
}

export const DepositMatrix: React.FC<DepositMatrixProps> = ({
  language,
  wallet,
  queue,
  globalQueueLength,
  userQueueIndex,
  userPositions,
  setSelectedPositionIndex,
  onDeposit,
  onBuyMatrixOnly,
  onRegisterAsInfluencer,
  onRefresh,
  depositLoading,
  buyMatrixLoading,
  registerInfluencerLoading,
  referrerAddress,
  setReferrerAddress,
  isReferrerLocked,
  microFifoBalance,
  positionsDetails,
  nextProcessPositionPointer,
  onSqueeze,
  squeezeLoading,
  onClaimForcedMaturity,
  claimForcedLoading,
  isRefreshing = false,
}) => {
  const t = translations[language];
  const [depositAmount, setDepositAmount] = useState<string>('50');
  const [localReferrer, setLocalReferrer] = useState<string>('');

  useEffect(() => {
    setLocalReferrer(referrerAddress || '');
  }, [referrerAddress]);

  const selectedPosition = userQueueIndex !== -1 ? userQueueIndex : (userPositions[0] !== undefined ? userPositions[0] : -1);
  const positionDetail = positionsDetails[selectedPosition];
  const isProcessed = positionDetail ? positionDetail.isProcessed : false;
  const positionsBehind = selectedPosition !== -1 ? Math.max(0, globalQueueLength - 1 - selectedPosition) : 0;
  
  const activeEntryTime = positionDetail ? positionDetail.entryTime : 0;
  const activeDaysWaiting = activeEntryTime ? Math.max(0, Math.floor((Date.now() / 1000 - activeEntryTime) / 86400)) : 0;
  const isActiveForcedMature = activeDaysWaiting >= 100;
  const isMatured = positionsBehind >= 100 || isActiveForcedMature;

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount < 10 || amount > 100) return;
    onDeposit(amount, localReferrer || '0x0000000000000000000000000000000000000000');
  };

  const handleBuyMatrixSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onBuyMatrixOnly(localReferrer || '0x0000000000000000000000000000000000000000');
  };

  const handleRegisterInfluencerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRegisterAsInfluencer(localReferrer || '0x0000000000000000000000000000000000000000');
  };

  return (
    <div className="grid gap-8 lg:grid-cols-12 w-full max-w-full overflow-hidden min-w-0" id="deposit-matrix-container">
      
      {/* LEFT COLUMN: Matrix Ticket Terminal & Monoline Queue Tracker */}
      <div className="lg:col-span-6 w-full min-w-0 flex flex-col space-y-6">
        
        {/* Matrix Ticket Terminal ($1 entry) */}
        <div className="neu-card p-6 sm:p-8 border border-emerald-500/20 bg-slate-900/40 backdrop-blur-md rounded-xl space-y-4 relative w-full max-w-full overflow-hidden" id="buy-matrix-only-card">
          <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-emerald-500/5 blur-xl pointer-events-none"></div>
          
          <div className="space-y-1">
            <h2 className="text-md font-extrabold text-white flex items-center space-x-2 tracking-tight font-display">
              <Sparkles className="h-5 w-5 text-emerald-400 animate-pulse" />
              <span className="text-emerald-400">{language === 'en' ? 'Matrix Ticket Terminal ($1)' : 'Terminal Tiket Matriks ($1)'}</span>
            </h2>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {language === 'en' 
                ? 'Purchase $1 USDT Matrix Ticket to enter the high-speed Micro-FIFO monoline queue.' 
                : 'Beli Tiket Matriks senilai $1 USDT untuk masuk ke dalam antrean monoline Micro-FIFO yang cepat.'}
            </p>
          </div>

          <form onSubmit={handleBuyMatrixSubmit} className="space-y-4">
            <div className="bg-slate-950/40 p-4 rounded-lg border border-slate-800/60 space-y-3">
              <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-800/40">
                <span className="text-slate-400">{language === 'en' ? 'Position Cost' : 'Biaya Posisi'}</span>
                <span className="text-emerald-400 font-extrabold text-xs font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">1.00 USDT</span>
              </div>
              
              <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                {language === 'en' 
                  ? 'Matures when 100 positions are entered behind you. Receive KDIA worth $0.50 + 1% bonus per wait day (up to 100% max). Squeeze available for instant payout + 10% bonus!'
                  : 'Matang ketika 100 posisi masuk di belakang Anda. Terima KDIA senilai $0.50 + 1% bonus per hari masa tunggu (maks 100%). Squeeze tersedia untuk klaim instan + bonus 10%!'}
              </p>

              {/* Sponsor commission highlight */}
              <div className="flex justify-between items-center text-[10px] font-mono border-t border-slate-800/30 pt-2 text-amber-400 font-bold bg-amber-500/5 -mx-4 px-4 py-1.5">
                <span>{language === 'en' ? 'Sponsor Bonus (Direct Referral):' : 'Bonus Sponsor (Referral Langsung):'}</span>
                <span>0.50 USDT (Minimal $0.5 USDT)</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={buyMatrixLoading || !wallet.connected}
              className={`w-full py-3.5 px-6 font-display font-black tracking-wider text-xs rounded-lg uppercase shadow-lg border-none transition-all duration-300 ${
                wallet.connected && !buyMatrixLoading
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 hover:from-emerald-400 hover:to-teal-300 shadow-emerald-500/10 cursor-pointer hover:scale-[1.01] active:scale-[0.99]'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
              id="submit-buy-matrix-only-btn"
            >
              <div className="flex items-center justify-center space-x-2">
                <Zap className="h-4 w-4 animate-bounce" />
                <span>
                  {buyMatrixLoading ? t.processing : (language === 'en' ? 'BUY MATRIX TICKET' : 'BELI TIKET MATRIKS')}
                </span>
              </div>
            </button>
            
            {!wallet.connected && (
              <p className="text-center text-[9px] text-amber-500 font-mono uppercase">
                {language === 'en' ? 'Connect Wallet to Purchase' : 'Hubungkan Dompet untuk Membeli'}
              </p>
            )}
          </form>
        </div>

        {/* Monoline Queue Tracker Card */}
        <div className="neu-card p-6 sm:p-8 border border-emerald-500/20 bg-slate-900/40 backdrop-blur-md rounded-xl space-y-6 w-full max-w-full overflow-hidden" id="queue-tracker-panel">
          <div className="flex items-center justify-between border-b border-slate-800/40 pb-4">
            <h2 className="text-md font-bold text-white flex items-center space-x-2.5 tracking-tight font-display">
              <ListOrdered className="h-5 w-5 text-emerald-400" />
              <span>{language === 'en' ? 'Micro-FIFO Queue Monitor' : 'Pemantau Antrean Micro-FIFO'}</span>
              {isRefreshing && (
                <span className="flex items-center space-x-1 text-[8px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded animate-pulse">
                  <span className="h-1 w-1 rounded-full bg-emerald-500"></span>
                  <span>SYNCING...</span>
                </span>
              )}
            </h2>
            
            <button 
              onClick={onRefresh}
              disabled={isRefreshing}
              className={`text-slate-400 hover:text-white transition-colors cursor-pointer p-1.5 rounded-lg bg-slate-950/40 border border-slate-800/60 ${isRefreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <svg className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>

          {userPositions.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-slate-800/60 rounded-lg bg-slate-950/20">
              <Layers className="h-7 w-7 text-slate-600 mx-auto mb-2" />
              <p className="text-[11px] text-slate-500 max-w-xs mx-auto leading-relaxed">
                {language === 'en' 
                  ? 'No active matrix positions found for your wallet. Grab a ticket above to join!' 
                  : 'Tidak ada posisi matriks aktif untuk dompet Anda. Beli tiket di atas untuk bergabung!'}
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Positions Selector */}
              <div className="space-y-2">
                <span className="block text-[9px] font-mono uppercase text-slate-400 font-bold tracking-wider">
                  {language === 'en' ? 'Select Your Active Position:' : 'Pilih Posisi Aktif Anda:'}
                </span>
                <div className="flex flex-wrap gap-2">
                  {Array.from(new Set(userPositions)).map((posId) => {
                    const isSelected = posId === selectedPosition;
                    const detail = positionsDetails[posId];
                    const activeProcessed = detail ? detail.isProcessed : false;
                    const activeBehind = Math.max(0, globalQueueLength - 1 - posId);
                    const isSelMature = activeProcessed || activeBehind >= 100;
                    
                    return (
                      <button
                        key={posId}
                        type="button"
                        onClick={() => setSelectedPositionIndex(posId)}
                        className={`px-3 py-1.5 rounded font-mono text-[10px] transition-all border cursor-pointer flex items-center space-x-1.5 ${
                          isSelected
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-extrabold shadow-md'
                            : isSelMature
                            ? 'bg-slate-800/80 text-emerald-400 border-emerald-500/10 font-bold'
                            : 'bg-slate-950/60 text-slate-400 border-slate-850 hover:text-slate-200'
                        }`}
                      >
                        <span>#{posId}</span>
                        {activeProcessed ? (
                          <span className="text-[8px] text-slate-500">✓ CLAIMED</span>
                        ) : isSelMature ? (
                          <span className="text-[8px] text-emerald-400 animate-pulse font-extrabold">READY</span>
                        ) : (
                          <span className="text-[8px] text-slate-500">({activeBehind}/100)</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Queue Status Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-850">
                  <span className="block text-[8px] font-mono uppercase text-slate-500 font-bold">Total Queue</span>
                  <span className="font-display text-base font-black text-slate-200 mt-1 block">{globalQueueLength}</span>
                </div>
                <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-850">
                  <span className="block text-[8px] font-mono uppercase text-slate-500 font-bold">Your Selection</span>
                  <span className="font-display text-base font-black text-amber-400 mt-1 block">#{selectedPosition === -1 ? 'None' : selectedPosition}</span>
                </div>
                <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-850">
                  <span className="block text-[8px] font-mono uppercase text-slate-500 font-bold">Positions Behind</span>
                  <span className="font-display text-base font-black text-emerald-400 mt-1 block">{selectedPosition === -1 ? '0' : positionsBehind}</span>
                </div>
              </div>

              {/* Progress Bar */}
              {selectedPosition !== -1 && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[9px] font-mono text-slate-400 font-bold uppercase">
                    <span>Maturity Progress</span>
                    <span>{isProcessed ? '100%' : `${Math.min(100, positionsBehind)}%`}</span>
                  </div>
                  <div className="h-2 w-full rounded bg-slate-950/60 p-[1px] border border-slate-800 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                      style={{ width: `${isProcessed ? 100 : Math.min(100, positionsBehind)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Dynamic Action Trigger (Squeeze or Claim) */}
              {selectedPosition !== -1 && !isProcessed && (
                <div className="p-4 rounded-lg bg-slate-950/40 border border-slate-850">
                  {isMatured ? (
                    <div className="space-y-3" id="matured-claim-action-panel">
                      <div className="space-y-0.5">
                        <span className="text-emerald-400 font-black text-xs block font-display">🎉 Position Has Matured!</span>
                        <p className="text-[10px] text-slate-400 leading-relaxed">
                          {language === 'en'
                            ? 'Claim your $0.50 USDT equivalent KDIA plus accumulated daily wait bonuses.'
                            : 'Klaim nilai setara $0.50 USDT KDIA ditambah akumulasi bonus masa tunggu harian Anda.'}
                        </p>
                      </div>
                      <button
                        onClick={onClaimForcedMaturity}
                        disabled={claimForcedLoading || !wallet.connected}
                        className="w-full py-2.5 font-display font-black text-xs uppercase bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 rounded cursor-pointer border-none transition-all hover:scale-[1.01] active:scale-[0.99]"
                        id="claim-matured-position-btn"
                      >
                        {claimForcedLoading ? t.processing : (language === 'en' ? 'CLAIM REWARDS' : 'KLAIM HADIAH')}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3" id="active-squeeze-action-panel">
                      <div className="space-y-0.5">
                        <span className="text-amber-400 font-black text-xs block font-display">🚀 Gunting Antrean (Squeeze Queue)</span>
                        <p className="text-[10px] text-slate-400 leading-relaxed">
                          {language === 'en'
                            ? 'Pay $1.00 USDT to immediately mature your position, earning a 10% Squeezer Bonus, and automatically re-enter the queue.'
                            : 'Bayar $1.00 USDT untuk mematangkan posisi secara instan, mendapatkan 10% Squeezer Bonus, dan otomatis masuk antrean kembali.'}
                        </p>
                      </div>
                      <button
                        onClick={() => onSqueeze(selectedPosition)}
                        disabled={squeezeLoading[selectedPosition] || !wallet.connected}
                        className="w-full py-2.5 font-display font-black text-xs uppercase bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 rounded cursor-pointer border-none transition-all hover:scale-[1.01] active:scale-[0.99]"
                        id="squeeze-matured-position-btn"
                      >
                        {squeezeLoading[selectedPosition] ? t.processing : (language === 'en' ? 'SQUEEZE INSTANTLY' : 'GUNTING SEKARANG')}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Recent Entries */}
              <div className="space-y-2 border-t border-slate-800/40 pt-4">
                <div className="flex justify-between text-[9px] font-mono text-slate-500 font-bold uppercase">
                  <span>Recent entries tracker</span>
                  <span>Front: #{nextProcessPositionPointer}</span>
                </div>
                <div className="w-full overflow-x-auto pb-1">
                  <div className="flex items-center space-x-2 w-max">
                    {queue.slice(-8).map((item, idx) => {
                      const detail = positionsDetails[item.index];
                      const itemProcessed = item.isProcessed || (detail ? detail.isProcessed : false);
                      const isSel = item.index === selectedPosition;
                      const isFront = item.index === nextProcessPositionPointer;
                      
                      return (
                        <div key={idx} className="flex items-center space-x-1.5 flex-shrink-0">
                          <div className={`p-2.5 rounded font-mono text-[9px] flex flex-col items-center min-w-[80px] border ${
                            isSel
                              ? 'bg-emerald-500/10 border-emerald-400/40 text-emerald-300'
                              : isFront
                              ? 'bg-amber-500/10 border-amber-400/30 text-amber-400 animate-pulse'
                              : 'bg-slate-950/40 border-slate-850 text-slate-400'
                          }`}>
                            <span className="font-extrabold">POS #{item.index}</span>
                            <span className="text-[8px] text-slate-500 mt-0.5">{itemProcessed ? 'CLAIMED' : 'WAITING'}</span>
                          </div>
                          {idx < queue.slice(-8).length - 1 && <span className="text-slate-700 text-[10px]">➔</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Sponsor Sync, Vesting Pool & Influencer Settings */}
      <div className="lg:col-span-6 w-full min-w-0 flex flex-col space-y-6">
        
        {/* Referrer / Sponsor Address Card */}
        <div className="neu-card p-6 border border-emerald-500/20 bg-slate-900/40 backdrop-blur-md rounded-xl space-y-3 w-full max-w-full" id="referrer-address-card">
          <label className="block text-[10px] font-mono uppercase text-emerald-400 font-black tracking-wider">
            {language === 'en' ? 'Sponsor / Referrer Address' : 'Alamat Sponsor / Referrer'}
          </label>
          <input
            type="text"
            value={localReferrer}
            onChange={(e) => {
              setLocalReferrer(e.target.value);
              setReferrerAddress(e.target.value);
            }}
            disabled={isReferrerLocked || depositLoading || buyMatrixLoading || registerInfluencerLoading || !wallet.connected}
            className="w-full bg-slate-950/60 border border-slate-800/60 rounded-lg px-4 py-3 font-mono text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50 disabled:text-slate-600 disabled:bg-slate-950/20"
            placeholder={t.referrerPlaceholder}
            id="shared-referrer-input"
          />
          <p className="text-[10px] text-slate-400 leading-snug">
            {language === 'en' 
              ? 'Automatically locked if registered via referral link.' 
              : 'Otomatis terkunci jika mendaftar melalui tautan rujukan.'}
          </p>
        </div>

        {/* Join Vesting Pool ($10 - $100 entry) */}
        <div className="neu-card p-6 sm:p-8 border border-emerald-500/20 bg-slate-900/40 backdrop-blur-md rounded-xl space-y-6 w-full max-w-full overflow-hidden" id="deposit-portal-card">
          <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-emerald-500/5 blur-xl pointer-events-none"></div>
          
          <div className="space-y-1">
            <h2 className="text-md font-extrabold text-white flex items-center space-x-2 tracking-tight font-display">
              <Layers className="h-5 w-5 text-emerald-400" />
              <span className="text-emerald-400">{language === 'en' ? 'Vesting Pool Gateway ($10 - $100)' : 'Gerbang Vesting Pool ($10 - $100)'}</span>
            </h2>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {language === 'en' 
                ? 'Acquire KDIA at premium floor prices with a 20-day daily linear release schedule.' 
                : 'Dapatkan KDIA dengan harga dasar premium melalui skema rilis linear harian selama 20 hari.'}
            </p>
          </div>

          <form onSubmit={handleDepositSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-[9px] font-mono uppercase text-slate-400 font-bold tracking-wider">
                {language === 'en' ? 'Deposit Amount' : 'Jumlah Deposit'} (USDT)
              </label>
              
              <div className="relative">
                <input
                  type="number"
                  min="10"
                  max="100"
                  step="any"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  disabled={depositLoading || !wallet.connected}
                  className="w-full bg-slate-950/60 border border-slate-800/60 rounded-lg px-4 py-3 font-mono text-sm text-slate-200 focus:outline-none focus:border-emerald-500/50"
                  placeholder="50"
                  id="deposit-amount-input"
                />
                <span className="absolute right-4 top-3 font-mono text-xs text-slate-500 font-bold">USDT</span>
              </div>

              {/* Presets */}
              <div className="flex gap-2">
                {['10', '25', '50', '100'].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setDepositAmount(val)}
                    disabled={depositLoading || !wallet.connected}
                    className={`flex-1 py-1.5 rounded text-center font-mono text-[10px] font-bold border transition-all cursor-pointer ${
                      depositAmount === val
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-slate-950/40 text-slate-400 border-slate-850 hover:text-slate-200 hover:border-slate-800'
                    }`}
                  >
                    ${val}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={depositLoading || !wallet.connected}
              className={`w-full py-3.5 px-6 font-display font-black tracking-wider text-xs rounded-lg uppercase shadow-lg border-none transition-all duration-300 ${
                wallet.connected && !depositLoading
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 hover:from-emerald-400 hover:to-teal-300 shadow-emerald-500/10 cursor-pointer hover:scale-[1.01] active:scale-[0.99]'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
              id="submit-deposit-btn"
            >
              <div className="flex items-center justify-center space-x-2">
                <span>{depositLoading ? t.processing : (language === 'en' ? 'DEPOSIT & JOIN POOL' : 'DEPOSIT & GABUNG POOL')}</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </button>
          </form>

          {/* 3-Tier Affiliate Commission breakdown progress bar visualizer */}
          <div className="p-4 rounded-lg bg-slate-950/40 border border-slate-850 space-y-3.5">
            <span className="text-[10px] font-mono uppercase text-emerald-400 font-extrabold tracking-wider block">
              {language === 'en' ? '3-Tier Affiliate Commissions' : 'Komisi Afiliasi 3-Tingkat'}
            </span>
            
            <div className="space-y-3">
              {/* Level 1 */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>Level 1 (Direct sponsor)</span>
                  <span className="font-bold text-emerald-400">5.0% Reward</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style={{ width: '50%' }}></div>
                </div>
              </div>
              {/* Level 2 */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>Level 2</span>
                  <span className="font-bold text-emerald-500">3.0% Reward</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>
              {/* Level 3 */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>Level 3</span>
                  <span className="font-bold text-emerald-600">2.0% Reward</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: '20%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Deposit Distribution details */}
          <div className="border-t border-slate-800/40 pt-4 space-y-2">
            <h4 className="text-[9px] font-mono uppercase text-slate-500 font-bold tracking-wider">
              {t.depositDistribution}
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 font-mono">
              <div className="flex items-center space-x-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
                <span>{t.distLp}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#059669]" />
                <span>{t.distTreasury}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 shadow-[0_0_6px_#047857]" />
                <span>{t.distReferral}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-500 shadow-[0_0_6px_#14b8a6]" />
                <span>{t.distBuyback}</span>
              </div>
              <div className="flex items-center space-x-1.5 col-span-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b]" />
                <span>{t.distMatrix}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Register as Influencer ($0 Cost) */}
        <div className="neu-card p-6 border border-slate-800/60 bg-slate-900/30 backdrop-blur-sm rounded-xl space-y-4 w-full max-w-full overflow-hidden" id="register-influencer-card">
          <div className="space-y-1">
            <h2 className="text-md font-extrabold text-white flex items-center space-x-2 tracking-tight font-display">
              <Users className="h-5 w-5 text-amber-400" />
              <span className="text-amber-400">{t.registerInfluencerCardTitle}</span>
            </h2>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {t.registerInfluencerCardSubtitle}
            </p>
          </div>

          <form onSubmit={handleRegisterInfluencerSubmit} className="space-y-4">
            <div className="bg-slate-950/40 p-4 rounded-lg border border-slate-850 space-y-2">
              <div className="flex items-center space-x-2 text-[10px] text-slate-300 font-mono">
                <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>3-Level Affiliates Enabled (5% / 3% / 2%)</span>
              </div>
              <div className="flex items-center space-x-2 text-[10px] text-slate-300 font-mono">
                <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>$0.50 USDT direct sponsor Matrix commission</span>
              </div>
              <div className="flex items-center space-x-2 text-[10px] text-slate-300 font-mono">
                <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>Zero capital required to begin earning</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={registerInfluencerLoading || !wallet.connected}
              className={`w-full py-3 px-5 font-display font-black tracking-wider text-xs rounded-lg uppercase shadow-lg border-none transition-all duration-300 ${
                wallet.connected && !registerInfluencerLoading
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 hover:from-amber-400 hover:to-yellow-300 shadow-amber-500/10 cursor-pointer hover:scale-[1.01] active:scale-[0.99]'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
              id="submit-register-influencer-btn"
            >
              <span>{registerInfluencerLoading ? t.processing : t.registerInfluencerBtn}</span>
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
