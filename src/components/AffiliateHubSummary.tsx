import React from 'react';
import { Users, DollarSign, Award, ArrowUpRight } from 'lucide-react';
import { DebugLogs } from './DebugLogs';

interface AffiliateHubSummaryProps {
  totalVestingBonus: number;
  totalVestingBonusL1: number;
  totalVestingBonusL2: number;
  totalVestingBonusL3: number;
  totalMatrixBonus: number;
  totalSqueezeBonus: number;
  totalEarnings: number;
  level1Count: number;
  level2Count: number;
  level3Count: number;
  logs?: string[];
}

export const AffiliateHubSummary: React.FC<AffiliateHubSummaryProps> = ({
  totalVestingBonus,
  totalVestingBonusL1,
  totalVestingBonusL2,
  totalVestingBonusL3,
  totalMatrixBonus,
  totalSqueezeBonus,
  totalEarnings,
  level1Count,
  level2Count,
  level3Count,
  logs,
}) => {
  return (
    <div className="neu-card p-6 border-none" id="affiliate-hub-summary">
      <h2 className="text-lg font-bold text-white flex items-center space-x-2 mb-6">
        <Users className="h-5 w-5 text-rose-500" />
        <span>Affiliate Hub</span>
      </h2>

      <div className="grid gap-4 md:grid-cols-4 mb-4">
        {[
          { label: 'Level 1', count: level1Count, value: totalVestingBonusL1, color: 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.15)]' },
          { label: 'Level 2', count: level2Count, value: totalVestingBonusL2, color: 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.15)]' },
          { label: 'Level 3', count: level3Count, value: totalVestingBonusL3, color: 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.15)]' },
          { label: 'Total Vesting Bonus', count: null, value: totalVestingBonus, color: 'text-rose-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.2)]' },
        ].map((item, idx) => (
          <div key={idx} className="neu-card-inset p-4 rounded-md">
            <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">{item.label}</span>
            <div className="mt-1 flex flex-col">
              {item.count !== null && (
                <span className="text-sm font-bold text-slate-300 mb-1">{item.count} Referrals</span>
              )}
              <span className={`text-xl font-display font-black ${item.color} tracking-tight`}>
                ${item.value.toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-4">
        {[
          { label: 'Total Matrix Bonus', value: totalMatrixBonus, color: 'text-rose-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.2)]' },
          { label: 'Squeeze Bonus', value: totalSqueezeBonus, color: 'text-rose-300 drop-shadow-[0_0_8px_rgba(244,63,94,0.15)]' },
          { label: 'Total Earnings', value: totalEarnings, color: 'text-emerald-400 font-extrabold drop-shadow-[0_0_12px_rgba(16,185,129,0.3)]' },
        ].map((item, idx) => (
          <div key={idx} className="neu-card-inset p-4 rounded-md">
            <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">{item.label}</span>
            <span className={`text-xl font-display font-black ${item.color} block mt-1 tracking-tight`}>
              ${item.value.toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <DebugLogs logs={logs || []} />
    </div>
  );
};
