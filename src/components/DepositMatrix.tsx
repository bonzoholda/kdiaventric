import React, { useState, useEffect } from 'react';
import { 
  Layers, ArrowRight, Check, Sparkles, Trophy, ListOrdered, 
  CircleCheck, AlertCircle, Coins, Users, Zap, Clock, ShieldAlert 
} from 'lucide-react';
import { Language, WalletState, QueueUser } from '../types';
import { translations } from '../translations';

interface DepositMatrixProps {
  language: Language;
  wallet: WalletState;
  queue: QueueUser[];
  globalQueueLength: number; // Next Position ID - 1
  userQueueIndex: number; // Selected active position ID
  userPositions: number[]; // All active position IDs of the user
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

  // Sync referrerAddress to local input if updated from parent
  useEffect(() => {
    setLocalReferrer(referrerAddress || '');
  }, [referrerAddress]);
  const selectedPosition = userQueueIndex !== -1 ? userQueueIndex : (userPositions[0] !== undefined ? userPositions[0] : -1);
  const positionDetail = positionsDetails[selectedPosition];
  const isProcessed = positionDetail ? positionDetail.isProcessed : false;
  const positionsBehind = selectedPosition !== -1 ? Math.max(0, globalQueueLength - 1 - selectedPosition) : 0;
  const isMatureLinear = positionsBehind >= 100;
  const blockId = selectedPosition !== -1 ? Math.floor(selectedPosition / 5) : -1;
  const blockStartId = selectedPosition !== -1 ? blockId * 5 : -1;
  const blockEndId = selectedPosition !== -1 ? blockStartId + 4 : -1;
  
  // How many positions are filled in the selected position's block so far?
  const nextPosId = globalQueueLength; // Queue length is the next index to be inserted
  const blockProgressCount = selectedPosition !== -1 
    ? Math.max(0, Math.min(5, nextPosId - blockStartId)) 
    : 0;
  const isBlockMatured = blockProgressCount === 5;
  const blockProgressPercent = (blockProgressCount / 5) * 100;

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
    <div className="grid gap-6 lg:grid-cols-12 w-full max-w-full overflow-hidden min-w-0" id="deposit-matrix-container">
      
      {/* LEFT SIDE: Transaction Forms */}
      <div className="lg:col-span-5 w-full min-w-0 flex flex-col space-y-6">
        
        {/* Referrer Address Sync Panel (Shared across actions) */}
        <div className="neu-card p-4 sm:p-6 border-none relative overflow-hidden bg-slate-900/40 w-full max-w-full" id="referrer-address-card">
          <label className="block text-[10px] font-mono uppercase text-rose-400 font-black tracking-wider mb-2">
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
            className="neu-input w-full max-w-full px-4 py-3 font-mono text-xs text-white disabled:text-slate-600 border-none min-w-0"
            placeholder={t.referrerPlaceholder}
            id="shared-referrer-input"
          />
          <p className="mt-2 text-[10px] text-slate-500 leading-snug">
            {language === 'en' 
              ? 'Required for bonuses. Automatically populated if you used a sponsor link.' 
              : 'Wajib diisi untuk bonus. Otomatis terisi jika menggunakan tautan sponsor.'}
          </p>
        </div>

        {/* Form 1: Join Vesting Pool */}
        <div className="neu-card p-4 sm:p-6 md:p-8 relative flex flex-col justify-between border-none space-y-6 w-full max-w-full overflow-hidden" id="deposit-portal-card">
          <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-emerald-500/[0.03] blur-2xl"></div>
          <div>
            <h2 className="text-md font-extrabold text-white flex items-center space-x-2.5 tracking-tight font-display text-emerald-400">
              <Layers className="h-4.5 w-4.5 text-emerald-400 animate-pulse" />
              <span>{language === 'en' ? 'Join Vesting Pool' : 'Gabung Vesting Pool'}</span>
            </h2>
            
            {/* Benefits list requested by user */}
            <div className="mt-4 p-4 rounded-lg bg-emerald-950/20 border border-emerald-500/10 space-y-2 text-xs">
              <p className="text-slate-300 font-bold mb-1">
                {language === 'en' 
                  ? 'Choose your deposit ($10 - $100) and unlock these benefits:' 
                  : 'Pilih depositmu ($10 - $100) dan dapatkan manfaat ini:'}
              </p>
              <ul className="space-y-1.5 text-slate-300 list-none pl-0">
                <li className="flex items-start space-x-2">
                  <Check className="h-3.5 w-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>
                    {language === 'en' 
                      ? 'Claim KDIA token, vesting over 20 days.' 
                      : 'Claim KDIA token, vesting selama 20 hari.'}
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <Check className="h-3.5 w-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>
                    {language === 'en' 
                      ? 'Get 3-level referral earnings.' 
                      : 'Dapatkan 3-level referral earnings.'}
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <Check className="h-3.5 w-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>
                    {language === 'en' 
                      ? 'Matrix position activation bonus.' 
                      : 'Bonus Aktivasi posisi Matrix.'}
                  </span>
                </li>
              </ul>
            </div>
    
            <form onSubmit={handleDepositSubmit} className="mt-5 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[9px] font-mono uppercase text-slate-500 font-bold tracking-wider">
                  {language === 'en' ? 'Deposit Amount' : 'Jumlah Deposit'} (10 - 100 USDT)
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
                    className="neu-input w-full px-4 py-3 font-mono text-sm text-white disabled:text-slate-600 border-none"
                    placeholder="50"
                    id="deposit-amount-input"
                  />
                  <span className="absolute right-4 top-3 font-mono text-xs text-slate-500 font-bold">
                    USDT
                  </span>
                </div>
                <div className="flex gap-1.5">
                  {['10', '25', '50', '100'].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setDepositAmount(val)}
                      disabled={depositLoading || !wallet.connected}
                      className={`flex-1 py-1.5 text-center font-mono text-[10px] transition-all border-none cursor-pointer rounded ${
                        depositAmount === val
                          ? 'neu-btn-active text-emerald-400 font-bold shadow-lg shadow-emerald-500/5'
                          : 'neu-btn text-slate-400 hover:text-emerald-300'
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
                className={`w-full flex items-center justify-center space-x-2 py-3.5 text-xs font-black tracking-wider transition-all border-none cursor-pointer rounded-lg uppercase shadow-xl ${
                  wallet.connected && !depositLoading
                    ? 'neu-btn-green text-[#0c0b0a] shadow-lg shadow-cyan-500/20 hover:scale-[1.01] active:scale-[0.99]'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
                id="submit-deposit-btn"
              >
                <span>{depositLoading ? t.processing : (language === 'en' ? 'DEPOSIT & JOIN POOL' : 'DEPOSIT & GABUNG POOL')}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
  
          {/* Deposit breakdown visualizer */}
          <div className="border-t border-slate-800/20 pt-4">
            <h4 className="text-[9px] font-mono uppercase text-slate-500 font-bold mb-2.5 tracking-wider">
              {t.depositDistribution}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
              <div className="flex items-start space-x-2 bg-slate-950/15 p-2.5 rounded min-w-0">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400 flex-shrink-0 shadow-[0_0_6px_#10b981]"></span>
                <span className="text-slate-400 leading-relaxed break-words">{t.distLp}</span>
              </div>
              <div className="flex items-start space-x-2 bg-slate-950/15 p-2.5 rounded min-w-0">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500 flex-shrink-0 shadow-[0_0_6px_#059669]"></span>
                <span className="text-slate-400 leading-relaxed break-words">{t.distTreasury}</span>
              </div>
              <div className="flex items-start space-x-2 bg-slate-950/15 p-2.5 rounded min-w-0">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-600 flex-shrink-0 shadow-[0_0_6px_#047857]"></span>
                <span className="text-slate-400 leading-relaxed break-words">{t.distReferral} (Instant Affiliate payouts!)</span>
              </div>
              <div className="flex items-start space-x-2 bg-slate-950/15 p-2.5 rounded min-w-0">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-teal-500 flex-shrink-0 shadow-[0_0_6px_#14b8a6]"></span>
                <span className="text-slate-400 leading-relaxed break-words">{t.distBuyback}</span>
              </div>
              <div className="flex items-start space-x-2 bg-slate-950/15 p-2.5 rounded min-w-0 sm:col-span-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-rose-500 flex-shrink-0 shadow-[0_0_6px_#f43f5e]"></span>
                <span className="text-slate-400 leading-relaxed break-words">{t.distMatrix}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form 2: Buy Matrix Only ($1 USDT) */}
        <div className="neu-card p-4 sm:p-6 md:p-8 border-none space-y-4 bg-gradient-to-br from-amber-950/20 via-slate-900/40 to-emerald-950/20 border border-amber-500/15 relative w-full max-w-full overflow-hidden" id="buy-matrix-only-card">
          <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-amber-500/[0.03] blur-2xl"></div>
          <div>
            <h2 className="text-md font-extrabold text-white flex items-center space-x-2 tracking-tight font-display text-amber-400">
              <Sparkles className="h-4.5 w-4.5 text-amber-400 animate-pulse" />
              <span>{language === 'en' ? 'Get KDIA token through Matrix' : 'Dapatkan Token KDIA Lewat Matriks'}</span>
            </h2>
            <p className="mt-1 text-[11px] text-slate-400 leading-relaxed">
              {language === 'en' 
                ? 'Join the high-speed Micro-FIFO Matrix queue to earn premium KDIA tokens directly on BSC Testnet.' 
                : 'Masuk ke antrean cepat Matriks Micro-FIFO untuk menghasilkan token KDIA premium langsung di BSC Testnet.'}
            </p>
          </div>

          <form onSubmit={handleBuyMatrixSubmit} className="space-y-4">
            <div className="bg-slate-950/40 p-4 rounded-lg border border-amber-500/10 space-y-3">
              <div className="flex justify-between items-center text-xs border-b border-slate-800/40 pb-2">
                <span className="text-slate-400 font-medium">{language === 'en' ? 'Position Cost' : 'Biaya Posisi'}</span>
                <span className="text-amber-400 font-extrabold text-xs font-mono bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">1.00 USDT</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                {language === 'en' 
                  ? 'You can claim KDIA tokens after your position reaches maturity (if there are 100 queue positions behind you), or if the waiting period has reached 100 days. Plus, you get a 1% bonus per day of waiting time if your position has not yet matured.'
                  : 'Kau dapat meng-klaim KDIA token setelah posisimu mencapai maturity (jika terdapat 100 antrean di belakangmu), atau jika masa tunggu telah mencapai 100 hari. Bonus 1% per hari masa tunggu jika posisimu belum matured.'}
              </p>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-[10px] font-mono text-slate-500 border-t border-slate-800/30 pt-2 gap-1">
                <span>{language === 'en' ? 'Referrer Sponsor Commission:' : 'Komisi Sponsor Referal:'}</span>
                <span className="text-emerald-500 font-bold">0.50 USDT</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={buyMatrixLoading || !wallet.connected}
              className={`w-full flex flex-col items-center justify-center py-4 px-6 text-sm font-black tracking-wider transition-all border-none cursor-pointer rounded-lg uppercase shadow-xl ${
                wallet.connected && !buyMatrixLoading
                  ? 'neu-btn-accent text-[#0c0b0a] shadow-lg shadow-cyan-500/20 hover:scale-[1.01] active:scale-[0.99]'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
              id="submit-buy-matrix-only-btn"
            >
              <div className="flex items-center space-x-2">
                <Zap className="h-4.5 w-4.5 text-yellow-300 animate-bounce fill-yellow-300" />
                <span className="font-extrabold tracking-tight">
                  {buyMatrixLoading ? t.processing : (language === 'en' ? 'Pay $1 and get your Matrix position' : 'Bayar $1 & Ambil Posisi Matriksmu')}
                </span>
              </div>
              {!wallet.connected && (
                <span className="text-[9px] text-rose-400 font-mono mt-1 font-normal uppercase">
                  {language === 'en' ? 'Connect Wallet to Purchase' : 'Hubungkan Dompet untuk Membeli'}
                </span>
              )}
            </button>
          </form>
        </div>

        {/* Form 3: Register as Influencer ($0 Cost) */}
        <div className="neu-card p-4 sm:p-6 md:p-8 border-none space-y-4 bg-slate-900/30 border border-slate-850 w-full max-w-full overflow-hidden" id="register-influencer-card">
          <div>
            <h2 className="text-md font-bold text-white flex items-center space-x-2 tracking-tight font-display">
              <Users className="h-4.5 w-4.5 text-blue-400" />
              <span>{t.registerInfluencerCardTitle}</span>
            </h2>
            <p className="mt-1 text-[11px] text-slate-400 leading-relaxed">
              {t.registerInfluencerCardSubtitle}
            </p>
          </div>

          <form onSubmit={handleRegisterInfluencerSubmit} className="space-y-4">
            <div className="bg-slate-950/20 p-3 rounded border border-white/[0.01] space-y-1.5 w-full max-w-full">
              <div className="flex items-start space-x-2 text-[10px] text-slate-400 font-mono">
                <Check className="h-3.5 w-3.5 text-blue-400 shrink-0 mt-0.5" />
                <span>3-Level Affiliates Enabled (5% / 3% / 2%)</span>
              </div>
              <div className="flex items-start space-x-2 text-[10px] text-slate-400 font-mono">
                <Check className="h-3.5 w-3.5 text-blue-400 shrink-0 mt-0.5" />
                <span>$0.50 USDT Direct sponsor matrix bonuses</span>
              </div>
              <div className="flex items-start space-x-2 text-[10px] text-slate-400 font-mono">
                <Check className="h-3.5 w-3.5 text-blue-400 shrink-0 mt-0.5" />
                <span>No initial USDT investment required</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={registerInfluencerLoading || !wallet.connected}
              className={`w-full flex items-center justify-center space-x-2 py-3 text-xs font-bold transition-all border-none cursor-pointer rounded ${
                wallet.connected && !registerInfluencerLoading
                  ? 'neu-btn-blue text-[#0c0b0a] shadow-lg shadow-cyan-500/20 hover:scale-[1.01] active:scale-[0.99]'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
              id="submit-register-influencer-btn"
            >
              <Users className="h-4 w-4" />
              <span>{registerInfluencerLoading ? t.processing : t.registerInfluencerBtn}</span>
            </button>
          </form>
        </div>

      </div>

      {/* RIGHT SIDE: Micro-FIFO Queue Visualizer and Active Block Tracker */}
      <div className="lg:col-span-7 w-full min-w-0 flex flex-col space-y-6">
        
        {/* Monoline Queue Tracker Card */}
        <div className="neu-card p-4 sm:p-6 md:p-8 flex flex-col justify-between border-none space-y-6 w-full max-w-full overflow-hidden" id="queue-tracker-panel">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800/20 pb-4">
              <h2 className="text-md font-bold text-white flex items-center space-x-2 tracking-tight font-display">
                <Layers className="h-4.5 w-4.5 text-rose-500" />
                <span>Micro-FIFO Monoline Matrix</span>
                {isRefreshing && (
                  <span className="flex items-center space-x-1 ml-2 text-[10px] font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded animate-pulse">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping"></span>
                    <span>SYNCING...</span>
                  </span>
                )}
              </h2>
              
              <div className="flex items-center space-x-2">
                <button 
                  onClick={onRefresh}
                  disabled={isRefreshing}
                  className={`text-slate-500 hover:text-white transition-colors cursor-pointer p-1 ${isRefreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span className="sr-only">Refresh</span>
                  <svg className={`h-4 w-4 ${isRefreshing ? 'animate-spin text-rose-500' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
                
                {selectedPosition !== -1 ? (
                  <span className="rounded bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 font-mono text-[10px] text-rose-400 font-extrabold uppercase tracking-wider">
                    Position: #{selectedPosition}
                  </span>
                ) : (
                  <span className="rounded bg-[#111319] border border-white/5 px-2 py-0.5 font-mono text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                    {language === 'en' ? 'No Positions' : 'Tidak Ada Posisi'}
                  </span>
                )}
              </div>
            </div>

            <p className="mt-3 text-[11px] text-slate-400 leading-relaxed">
              {language === 'en' 
                ? 'The Micro-FIFO Matrix uses a linear monoline queue. Entrance ticket is $1 USDT (sponsor receives $0.5 USDT bonus instantly). A position matures once 100 positions are entered behind it. When claiming a matured position, you receive KDIA tokens worth $0.50 + 1% bonus per day of wait time. If the wait time reaches 100 days (maximum), it is "forced matured" allowing you to claim $0.50 + 100% bonus (total $1.00 value in KDIA). Matured tickets are burned upon claim (no automatic re-entry).' 
                : 'Matriks Micro-FIFO menggunakan antrean linear monoline. Tiket masuk sebesar $1 USDT (sponsor langsung menerima bonus $0.5 USDT). Posisi matang setelah ada 100 antrean baru di belakangnya. Saat mengklaim posisi matang, Anda menerima token KDIA senilai $0.50 + 1% per hari masa tunggu. Jika masa tunggu mencapai 100 hari (maksimum), posisi menjadi "paksa matang" (forced matured) di mana Anda berhak mengklaim $0.50 + 100% bonus (total senilai $1.00 dalam token KDIA). Tiket yang matang akan hangus setelah diklaim (tidak ada re-entry otomatis).'}
            </p>

            {userPositions.length === 0 ? (
              <div className="my-6 text-center py-10 border border-dashed border-slate-850 rounded bg-slate-950/20">
                <ListOrdered className="h-7 w-7 text-slate-600 mx-auto mb-2" />
                <p className="text-[11px] text-slate-500 max-w-sm mx-auto leading-relaxed">
                  {language === 'en' 
                    ? 'You do not own any active matrix positions yet. Make a deposit or use the "Buy Matrix Only" option to join the Micro-FIFO!' 
                    : 'Anda belum memiliki posisi matriks aktif. Lakukan deposit atau gunakan "Beli Matriks Saja" untuk bergabung di Micro-FIFO!'}
                </p>
              </div>
            ) : (
              <div className="mt-5 space-y-5">
                
                {/* Positions Selector */}
                <div className="space-y-1.5 bg-slate-950/20 p-3.5 rounded border border-slate-850 w-full max-w-full overflow-hidden">
                  <span className="block text-[9px] font-mono uppercase text-slate-500 font-bold tracking-wider">
                    {language === 'en' ? 'Your Active Positions (Select one)' : 'Posisi Aktif Anda (Pilih salah satu)'}
                  </span>
                  <div className="flex flex-wrap gap-1.5 pt-1 max-w-full">
                    {Array.from(new Set(userPositions)).map((posId) => {
                      const isSelected = posId === selectedPosition;
                      const detail = positionsDetails[posId];
                      const activeProcessed = detail ? detail.isProcessed : false;
                      const activeBehind = Math.max(0, globalQueueLength - 1 - posId);
                      
                      const activeEntryTime = detail ? detail.entryTime : 0;
                      const activeDaysWaiting = activeEntryTime ? Math.max(0, Math.floor((Date.now() / 1000 - activeEntryTime) / 86400)) : 0;
                      const isActiveForcedMature = activeDaysWaiting >= 100;
                      const isMature = activeProcessed || activeBehind >= 100 || isActiveForcedMature;
                      
                      return (
                        <button
                          key={posId}
                          type="button"
                          onClick={() => setSelectedPositionIndex(posId)}
                          className={`px-2.5 py-1.5 rounded font-mono text-[10px] transition-all border-none cursor-pointer flex items-center space-x-1.5 ${
                            isSelected
                              ? 'bg-rose-500/15 text-rose-400 font-extrabold ring-1 ring-rose-500/30'
                              : isMature
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold'
                              : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                          } ${isRefreshing ? 'opacity-60 animate-pulse' : ''}`}
                        >
                          <span>#{posId}</span>
                          {activeProcessed ? (
                            <span className="text-[8px] text-emerald-400 font-bold">✓ CLAIMED</span>
                          ) : isMature ? (
                            <span className="text-[8px] text-emerald-400 font-bold">🎉 Matang</span>
                          ) : (
                            <span className="text-[8px] text-slate-500">({activeBehind}/100)</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Queue status details */}
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-full">
                  <div className="neu-card-inset p-3 border-none rounded min-w-0">
                    <span className="block text-[8px] font-mono uppercase text-slate-500 font-bold tracking-wider truncate">{t.queueTotal}</span>
                    <span className={`font-display text-lg sm:text-xl font-black text-rose-100/90 hover:text-white transition-all duration-300 mt-1 block drop-shadow-[0_0_8px_rgba(244,63,94,0.15)] ${isRefreshing ? 'opacity-60 animate-pulse' : ''}`} id="matrix-queue-total">
                      {globalQueueLength}
                    </span>
                  </div>
                  
                  <div className="neu-card-inset p-3 border-none rounded bg-slate-950/20 min-w-0">
                    <span className="block text-[8px] font-mono uppercase text-rose-400 font-bold tracking-wider truncate">
                      {language === 'en' ? 'Position Status' : 'Status Posisi'}
                    </span>
                    <span className={`font-display text-xs sm:text-sm font-black mt-1.5 block uppercase truncate ${
                      isProcessed 
                        ? 'text-slate-500' 
                        : (positionsBehind >= 100 || (positionDetail && Math.max(0, Math.floor((Date.now() / 1000 - positionDetail.entryTime) / 86400)) >= 100))
                        ? 'text-emerald-400 animate-pulse drop-shadow-[0_0_8px_rgba(16,185,129,0.25)]' 
                        : 'text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.25)]'
                    } ${isRefreshing ? 'opacity-60 animate-pulse' : ''}`} id="matrix-position-status">
                      {selectedPosition === -1 
                        ? (language === 'en' ? 'No Position' : 'Tidak Ada') 
                        : isProcessed 
                        ? (language === 'en' ? 'Claimed ✓' : 'Selesai ✓') 
                        : (positionsBehind >= 100 || (positionDetail && Math.max(0, Math.floor((Date.now() / 1000 - positionDetail.entryTime) / 86400)) >= 100))
                        ? (language === 'en' ? 'Matured 🎉' : 'Matang 🎉')
                        : (language === 'en' ? 'Active Queue' : 'Antre Aktif')}
                    </span>
                  </div>

                  <div className="col-span-1 xs:col-span-2 sm:col-span-1 neu-card-inset p-3 border-none rounded bg-emerald-950/5 min-w-0">
                    <span className="block text-[8px] font-mono uppercase text-emerald-400 font-bold tracking-wider truncate">
                      {language === 'en' ? 'Positions Behind' : 'Antrean Di Belakang'}
                    </span>
                    <span className={`font-display text-lg sm:text-xl font-black text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.2)] mt-1 block ${isRefreshing ? 'opacity-60 animate-pulse' : ''}`} id="matrix-positions-behind">
                      {selectedPosition === -1 ? '0' : positionsBehind}
                    </span>
                  </div>
                </div>

                {/* Progress Bar for selected position */}
                {selectedPosition !== -1 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 uppercase tracking-wider font-bold">
                      <span>{language === 'en' ? 'Maturity Progress (100 positions behind)' : 'Progres Kematangan (100 antrean di belakang)'}</span>
                      <span className="text-slate-200">
                        {isProcessed ? '100 / 100' : `${Math.min(100, positionsBehind)} / 100`}
                      </span>
                    </div>
                    <div className="h-2.5 w-full rounded bg-slate-950/40 p-[1.5px] border border-white/[0.02] shadow-[inset_1px_1px_3px_rgba(0,0,0,0.8)] overflow-hidden relative">
                      <div
                        className="h-full rounded bg-gradient-to-r from-rose-600 via-rose-500 to-emerald-400 transition-all duration-500 shadow-[0_0_6px_rgba(244,63,94,0.3)]"
                        style={{ width: `${isProcessed ? 100 : Math.min(100, (positionsBehind / 100) * 100)}%` }}
                      ></div>
                    </div>
                    
                    {isProcessed ? (
                      <p className="text-[10px] text-emerald-400 flex items-center space-x-1 font-bold bg-emerald-950/10 p-2 rounded border border-emerald-500/10">
                        <CircleCheck className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                        <span>{language === 'en' ? 'Position is fully processed! KDIA rewards claimed and ticket burned.' : 'Posisi sudah diproses sepenuhnya! Hadiah KDIA diklaim dan tiket dihanguskan.'}</span>
                      </p>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-[10px] text-slate-500 flex items-center space-x-1 bg-slate-950/10 p-2 rounded">
                          <AlertCircle className="h-3.5 w-3.5 text-slate-600 flex-shrink-0" />
                          <span>
                            {language === 'en' 
                              ? `Needs ${Math.max(0, 100 - positionsBehind)} more positions entered behind to reach linear maturity.` 
                              : `Butuh ${Math.max(0, 100 - positionsBehind)} posisi lagi masuk di belakang untuk mencapai kematangan linear.`}
                          </span>
                        </p>

                        {/* Live Backing & Payout Calculator */}
                        {positionDetail && (
                          <div className="bg-[#111319]/40 border border-white/[0.02] rounded p-3.5 space-y-2.5 text-xs font-mono">
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">
                              {language === 'en' ? 'Position Live Metrics & Rewards' : 'Metrik Langsung & Reward Posisi'}
                            </span>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
                              <div className="bg-slate-950/20 p-2 rounded min-w-0">
                                <span className="text-slate-500 block">{language === 'en' ? 'Queue Joined' : 'Waktu Masuk'}</span>
                                <span className="text-slate-300 font-bold mt-1 block truncate">
                                  {new Date(positionDetail.entryTime * 1000).toLocaleString(language === 'en' ? 'en-US' : 'id-ID')}
                                </span>
                              </div>
                              
                              <div className="bg-slate-950/20 p-2 rounded min-w-0">
                                <span className="text-slate-500 block">{language === 'en' ? 'Time Waiting' : 'Masa Tunggu'}</span>
                                <span className="text-rose-400 font-bold mt-1 block truncate">
                                  {Math.max(0, Math.floor((Date.now() / 1000 - positionDetail.entryTime) / 86400))} Days
                                  {Math.floor((Date.now() / 1000 - positionDetail.entryTime) / 86400) >= 100 && (
                                    <span className="text-emerald-400 text-[8px] ml-1 uppercase font-black tracking-wider block">
                                      (Forced Mature!)
                                    </span>
                                  )}
                                </span>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] pt-0.5">
                              <div className="bg-[#111319]/80 border border-white/[0.01] p-2 rounded min-w-0">
                                <span className="text-slate-500 block text-[9px] truncate">{language === 'en' ? 'Standard Claim Payout' : 'Klaim Hadiah Standar'}</span>
                                <span className="text-emerald-400 font-bold mt-1 block text-xs truncate">
                                  {(() => {
                                    const entry = positionDetail.entryTime;
                                    const days = Math.min(100, Math.max(0, Math.floor((Date.now() / 1000 - entry) / 86400)));
                                    const bonusPercent = days;
                                    const val = 0.5 * (1 + bonusPercent / 100);
                                    return `$${val.toFixed(3)} KDIA (${bonusPercent}% bonus)`;
                                  })()}
                                </span>
                              </div>
                              
                              <div className="bg-[#111319]/80 border border-white/[0.01] p-2 rounded min-w-0">
                                <span className="text-slate-500 block text-[9px] truncate">{language === 'en' ? 'Squeeze Payout (10% Sg)' : 'Hadiah Gunting (+10% Bonus)'}</span>
                                <span className="text-amber-400 font-bold mt-1 block text-xs truncate">
                                  {(() => {
                                    const entry = positionDetail.entryTime;
                                    const days = Math.min(100, Math.max(0, Math.floor((Date.now() / 1000 - entry) / 86400)));
                                    const bonusPercent = days;
                                    const val = 0.5 * (1.1 + bonusPercent / 100);
                                    return `$${val.toFixed(3)} KDIA (${bonusPercent + 10}% bonus)`;
                                  })()}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Position action trigger: Squeeze or Claim Matured Position */}
                {selectedPosition !== -1 && !isProcessed && (() => {
                  const entryTimeVal = positionDetail ? positionDetail.entryTime : 0;
                  const daysWaiting = entryTimeVal ? Math.max(0, Math.floor((Date.now() / 1000 - entryTimeVal) / 86400)) : 0;
                  const isForcedMatureTime = daysWaiting >= 100;
                  const isMatured = positionsBehind >= 100 || isForcedMatureTime;

                  if (isMatured) {
                    return (
                      <div className="bg-emerald-950/20 border border-emerald-500/10 rounded p-4 flex flex-col sm:flex-row items-center justify-between gap-3" id="matured-claim-action-panel">
                        <div className="space-y-1 text-center sm:text-left">
                          <span className="text-emerald-400 font-black text-xs block font-display">
                            {language === 'en' ? '🎉 Position Has Matured!' : '🎉 Posisi Sudah Matang!'}
                          </span>
                          <p className="text-[10px] text-slate-400 max-w-md leading-relaxed">
                            {language === 'en'
                              ? 'This position is mature. Claim your KDIA rewards (including waiting time bonuses) and burn this ticket.'
                              : 'Posisi ini sudah matang. Klaim hadiah token KDIA Anda (termasuk bonus masa tunggu) dan hanguskan tiket ini.'}
                          </p>
                        </div>
                        <button
                          onClick={onClaimForcedMaturity}
                          disabled={claimForcedLoading || !wallet.connected}
                          className={`w-full sm:w-auto font-black text-xs py-2.5 px-5 shadow-md border-none cursor-pointer flex items-center justify-center space-x-1.5 transition-all rounded ${
                            wallet.connected && !claimForcedLoading
                              ? 'neu-btn-green text-[#0c0b0a] shadow-md shadow-cyan-500/10 hover:scale-[1.01] active:scale-[0.99]'
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          }`}
                          id="claim-matured-position-btn"
                        >
                          {claimForcedLoading ? (
                            <span className="animate-spin mr-1 h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full" />
                          ) : (
                            <Clock className="h-3.5 w-3.5 text-current" />
                          )}
                          <span>{language === 'en' ? 'CLAIM MATURED POSITION' : 'KLAIM POSISI MATANG'}</span>
                        </button>
                      </div>
                    );
                  } else {
                    return (
                      <div className="bg-cyan-950/10 border border-cyan-500/10 rounded p-4 flex flex-col sm:flex-row items-center justify-between gap-3" id="active-squeeze-action-panel">
                        <div className="space-y-1 text-center sm:text-left">
                          <span className="text-cyan-400 font-black text-xs block font-display">
                            {language === 'en' ? '🚀 Gunting Antrean (Squeeze Queue) Available!' : '🚀 Fitur Gunting Antrean Tersedia!'}
                          </span>
                          <p className="text-[10px] text-slate-400 max-w-md leading-relaxed">
                            {language === 'en'
                              ? 'Pay $1.00 USDT to immediately mature your position, receiving KDIA worth $0.50 + 1% per waiting day + 10% squeeze bonus, and get a new active ticket re-entering at the end of the queue.'
                              : 'Bayar $1.00 USDT untuk mematangkan posisi secara instan, menerima token KDIA senilai $0.50 + 1% per hari masa tunggu + 10% bonus squeeze, dan tiket aktif yang baru akan memperoleh tempat di akhir antrean.'}
                          </p>
                        </div>
                        <button
                          onClick={() => onSqueeze(selectedPosition)}
                          disabled={squeezeLoading[selectedPosition] || !wallet.connected}
                          className={`w-full sm:w-auto font-black text-xs py-2.5 px-4 shadow-md border-none cursor-pointer flex items-center justify-center space-x-1.5 transition-all rounded ${
                            wallet.connected && !squeezeLoading[selectedPosition]
                              ? 'neu-btn-accent text-[#0c0b0a] shadow-md shadow-cyan-500/10 hover:scale-[1.01] active:scale-[0.99]'
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          }`}
                          id="squeeze-matured-position-btn"
                        >
                          {squeezeLoading[selectedPosition] ? (
                            <span className="animate-spin mr-1 h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full" />
                          ) : (
                            <Zap className="h-3.5 w-3.5 text-current" />
                          )}
                          <span>{language === 'en' ? 'SQUEEZE NOW' : 'GUNTING SEKARANG'}</span>
                        </button>
                      </div>
                    );
                  }
                })()}

                {/* Monoline Global Queue Tracker Visualizer */}
                <div className="border-t border-slate-800/20 pt-4 max-w-full overflow-hidden space-y-2.5">
                  <h4 className="text-[9px] font-mono uppercase text-slate-500 font-bold tracking-wider flex items-center justify-between">
                    <span>{language === 'en' ? 'Recent Queue Entries' : 'Entrean Terbaru'}</span>
                    <span className="text-[8px] text-slate-600 lowercase font-medium">front process pointer: #{nextProcessPositionPointer}</span>
                  </h4>
                  <div className="w-full max-w-full overflow-x-auto pb-2 scrollbar-thin">
                    <div className="flex items-center space-x-2 w-max">
                      {queue.slice(-10).map((item, idx) => {
                        const detail = positionsDetails[item.index];
                        const ownerAddr = detail ? detail.owner : item.address;
                        const isYou = ownerAddr && wallet.address ? ownerAddr.toLowerCase() === wallet.address.toLowerCase() : userPositions.includes(item.index);
                        const isSel = item.index === selectedPosition;
                        const isFront = item.index === nextProcessPositionPointer;
                        const itemProcessed = item.isProcessed || (detail ? detail.isProcessed : false);
                        
                        return (
                          <div key={idx} className="flex items-center space-x-2 flex-shrink-0">
                            <div className={`p-3 flex flex-col items-center justify-center min-w-28 border-none rounded ${
                              isSel
                                ? 'bg-rose-950/30 ring-1 ring-rose-500/40 shadow-md'
                                : isYou
                                ? 'bg-rose-950/10 border border-rose-500/10'
                                : isFront
                                ? 'bg-amber-950/20 border border-amber-500/20 animate-pulse'
                                : 'bg-[#111319]/30 border border-white/[0.01]'
                            }`}>
                              <span className={`text-[8px] font-mono font-black uppercase tracking-wider ${
                                isSel ? 'text-rose-400' : isFront ? 'text-amber-400' : isYou ? 'text-rose-500/80' : 'text-slate-500'
                              }`}>
                                {isSel ? 'SELECTED' : isFront ? 'FRONT ➔' : isYou ? 'YOU' : `POS #${item.index}`}
                              </span>
                              <span className="text-[10px] font-mono font-bold text-slate-200 mt-1">
                                {itemProcessed ? 'CLAIMED ✓' : 'Queueing'}
                              </span>
                            </div>
                            {idx < queue.slice(-10).length - 1 && (
                              <span className="text-slate-800 font-mono text-xs font-black">→</span>
                            )}
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

      </div>

    </div>
  );
};
