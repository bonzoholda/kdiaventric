const { ethers } = require('ethers');

const events = [
  "LinearRewardDistributed(address,address,uint256,uint256)",
  "LinearRewardDistributed(address,uint256,address,uint256)",
  "LinearRewardDistributed(address,uint256,address)",
  "LinearRewardDistributed(address,uint256)",
  "RewardDistributed(address,address,uint256,uint256)",
  "RewardDistributed(address,uint256,address,uint256)",
  "Deposited(address,uint256,address)",
  "Deposited(address,uint256)",
  "Joined(address,uint256,uint256)",
  "Joined(address,uint256,address,uint256)",
  "LinearRewardPaid(address,address,uint256)",
  "LinearRewardPaid(address,uint256,address,uint256)",
  "LinearRewardPaid(address,address,uint256,uint256)",
  "LinearRewardDistributed(address,uint256,address,uint256,uint256)",
  "LinearRewardDistributed(address,address,uint256,uint256,uint256)"
];

for (const e of events) {
  const hash = ethers.id(e);
  console.log(`${e} => ${hash}`);
}
