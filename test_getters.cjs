const { ethers } = require('ethers');

async function main() {
  const provider = new ethers.JsonRpcProvider('https://bsc-testnet-rpc.publicnode.com');
  const addr = '0x41569b825f93B3f23721813C9D10B7fCfcB39Ca2';
  const user = '0xAF1202D170e329a466518233D0AaE30f8E800CB5';

  const getters = [
    'function referralRewards(address) view returns (uint256)',
    'function referralEarnings(address) view returns (uint256)',
    'function rewards(address) view returns (uint256)',
    'function earned(address) view returns (uint256)',
    'function pendingRewards(address) view returns (uint256)',
    'function totalReferralRewards(address) view returns (uint256)',
    'function userReferrals(address) view returns (uint256)',
    'function influencers(address) view returns (bool, uint256)',
    'function rewardClaimed(address) view returns (uint256)',
    'function claimableRewards(address) view returns (uint256)',
    'function userVesting(address) view returns (uint256, uint256, uint256, uint256)',
    'function referrers(address) view returns (address)',
    'function isInfluencer(address) view returns (bool)'
  ];

  for (const sig of getters) {
    try {
      const contract = new ethers.Contract(addr, [sig], provider);
      const name = sig.split(' ')[1].split('(')[0];
      const res = await contract[name](user);
      if (Array.isArray(res)) {
        console.log(`Success: ${name} ->`, res.map(x => x.toString()));
      } else {
        console.log(`Success: ${name} ->`, res.toString());
      }
    } catch (e) {
      console.log(`Failed: ${sig.split(' ')[1].split('(')[0]} -> ${e.message.slice(0, 80)}`);
    }
  }
}

main().catch(console.error);
