const { ethers } = require('ethers');

async function main() {
  const provider = new ethers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545/', undefined, {
    batchMaxCount: 1
  });
  const controllerAddress = '0x08e77eAed0e97Ce0cCe08D8Dc05A3875173da402';
  const controllerContract = new ethers.Contract(controllerAddress, [
    "event Deposited(address indexed user, uint256 amount, address indexed referrer, uint256 positionId)",
    "event LinearRewardDistributed(address indexed user, address indexed referrer, uint256 amount)"
  ], provider);

  const currentBlock = await provider.getBlockNumber();
  console.log(`Current block: ${currentBlock}`);

  const startBlock = BigInt(currentBlock) - 10n;
  const endBlock = BigInt(currentBlock);
  console.log(`Querying Deposited events from block ${startBlock} to ${endBlock}...`);
  try {
    const filter = controllerContract.filters.Deposited();
    const logs = await controllerContract.queryFilter(filter, startBlock, endBlock);
    console.log(`Success! Found ${logs.length} Deposited logs.`);
    for (const log of logs) {
      console.log(`  Deposited: User=${log.args.user}, Referrer=${log.args.referrer}, Amount=${ethers.formatUnits(log.args.amount, 18)} USDT, Block=${log.blockNumber}`);
    }
  } catch (e) {
    console.log(`Failed Deposited: ${e.message}`);
  }

  console.log(`Querying LinearRewardDistributed events from block ${startBlock} to ${endBlock}...`);
  try {
    const filter = controllerContract.filters.LinearRewardDistributed();
    const logs = await controllerContract.queryFilter(filter, startBlock, endBlock);
    console.log(`Success! Found ${logs.length} LinearRewardDistributed logs.`);
    for (const log of logs) {
      console.log(`  LinearReward: User=${log.args.user}, Referrer=${log.args.referrer}, Amount=${ethers.formatUnits(log.args.amount, 18)} USDT, Block=${log.blockNumber}`);
    }
  } catch (e) {
    console.log(`Failed LinearRewardDistributed: ${e.message}`);
  }
}

main().catch(console.error);
