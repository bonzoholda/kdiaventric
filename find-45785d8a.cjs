const { ethers } = require('ethers');

const target = '0x45785d8a';

const verbs = ['claim', 'withdraw', 'collect', 'harvest', 'redeem', 'get', 'payout', 'release', 'unstake', 'unlock'];
const nouns = [
  'Vesting', 'Referral', 'Referrals', 'Matrix', 'Reward', 'Rewards', 'Earning', 'Earnings',
  'Bonus', 'Commission', 'Commissions', 'Profit', 'Dividends', 'Share', 'Pool', 'LinearVesting',
  'Linear', 'VestingReward', 'VestingRewards', 'ReferralReward', 'ReferralRewards', 'MatrixReward', 'MatrixRewards'
];
const params = [
  '',
  'address',
  'uint256',
  'address,uint256',
  'uint256,address'
];

function run() {
  console.log(`Searching for signature that hashes to ${target}...`);

  // Try pure verbs
  for (const v of verbs) {
    const sigs = [
      `${v}()`,
      `${v}(address)`,
      `${v}(uint256)`,
      `${v}(address,uint256)`,
      `${v}(uint256,address)`
    ];
    for (const sig of sigs) {
      if (ethers.id(sig).slice(0, 10) === target) {
        console.log(`FOUND! ${sig}`);
        return;
      }
    }
  }

  // Try verb + noun combinations
  for (const v of verbs) {
    for (const n of nouns) {
      const bases = [
        v + n,
        v + n.toLowerCase(),
        v + '_' + n.toLowerCase(),
        v + n + 's',
        v + n.toLowerCase() + 's'
      ];
      for (const base of bases) {
        for (const p of params) {
          const sig = `${base}(${p})`;
          if (ethers.id(sig).slice(0, 10) === target) {
            console.log(`FOUND! ${sig}`);
            return;
          }
        }
      }
    }
  }

  // Try some other MLM terms
  const extras = [
    'claimVesting()', 'claimReferralRewards()', 'claimMatrixRewards()',
    'claimVesting(address)', 'claimReferralRewards(address)', 'claimMatrixRewards(address)',
    'claimLinearVesting()', 'claimLinearVesting(address)',
    'buy(uint256,address)', 'deposit(uint256,address)', 'claimAll()', 'claimAll(address)',
    'claim_all()', 'claim_all(address)', 'claimRewards()', 'claimRewards(address)',
    'claimReward()', 'claimReward(address)', 'claimReward(uint256)',
    'claimMatrixPosition(uint256)', 'claimMatrixPosition(address,uint256)',
    'withdrawReferrals()', 'withdrawReferral()', 'withdrawMatrix()', 'withdrawVesting()',
    'claimVestingLinear()', 'claimVestingLinear(address)',
    'claimReferralRewardsLinear()', 'claimLinearVestingRewards()'
  ];
  for (const sig of extras) {
    if (ethers.id(sig).slice(0, 10) === target) {
      console.log(`FOUND IN EXTRAS! ${sig}`);
      return;
    }
  }

  console.log('No match found in combined patterns.');
}
run();
