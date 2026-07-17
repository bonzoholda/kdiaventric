const { ethers } = require('ethers');

async function main() {
  const provider = new ethers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545/', undefined, {
    batchMaxCount: 1
  });
  
  const controllerAddress = '0x08e77eAed0e97Ce0cCe08D8Dc05A3875173da402';
  const controllerContract = new ethers.Contract(controllerAddress, [
    "event Deposited(address indexed user, uint256 amount, address indexed referrer, uint256 positionId)"
  ], provider);

  const currentBlock = await provider.getBlockNumber();
  console.log(`Current block: ${currentBlock}`);

  const ranges = [100, 500, 1000, 2000, 5000];

  for (const range of ranges) {
    const fromBlock = currentBlock - range;
    console.log(`\nTesting range of ${range} blocks (from ${fromBlock})...`);
    try {
      const filter = controllerContract.filters.Deposited();
      const logs = await controllerContract.queryFilter(filter, fromBlock);
      console.log(`  Success! Found ${logs.length} logs`);
    } catch (e) {
      console.log(`  Failed: ${e.message.slice(0, 150)}`);
    }
  }
}

main().catch(console.error);
