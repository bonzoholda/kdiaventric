const { ethers } = require('ethers');

async function main() {
  const provider = new ethers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545/');
  const controllerAddress = '0x08e77eAed0e97Ce0cCe08D8Dc05A3875173da402';
  
  const controllerContract = new ethers.Contract(controllerAddress, [
    "event Deposited(address indexed user, uint256 amount, address indexed referrer, uint256 positionId)"
  ], provider);

  const currentBlock = await provider.getBlockNumber();
  console.log(`Current block: ${currentBlock}`);

  const ranges = [5000, 10000, 20000, 50000, 100000];

  for (const r of ranges) {
    const fromBlock = currentBlock - r;
    console.log(`\nTesting range of ${r} blocks (from block ${fromBlock} to ${currentBlock})...`);
    try {
      const filter = controllerContract.filters.Deposited();
      const start = Date.now();
      const logs = await controllerContract.queryFilter(filter, fromBlock);
      const duration = Date.now() - start;
      console.log(`Success! Found ${logs.length} logs in ${duration}ms`);
    } catch (e) {
      console.log(`Failed with error: ${e.message}`);
    }
  }
}

main().catch(console.error);
