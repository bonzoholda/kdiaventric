const { ethers } = require('ethers');

async function main() {
  const provider = new ethers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545/', undefined, {
    batchMaxCount: 1  // Disable batching completely by setting max count to 1!
  });
  
  const controllerAddress = '0x08e77eAed0e97Ce0cCe08D8Dc05A3875173da402';
  const controllerContract = new ethers.Contract(controllerAddress, [
    "event Deposited(address indexed user, uint256 amount, address indexed referrer, uint256 positionId)"
  ], provider);

  const currentBlock = await provider.getBlockNumber();
  console.log(`Current block: ${currentBlock}`);

  const range = 2000; // Search last 2000 blocks (plenty of range!)
  const fromBlock = currentBlock - range;

  console.log(`Querying last ${range} blocks with batchMaxCount: 1...`);
  try {
    const filter = controllerContract.filters.Deposited();
    const start = Date.now();
    const logs = await controllerContract.queryFilter(filter, fromBlock);
    const duration = Date.now() - start;
    console.log(`Success! Found ${logs.length} logs in ${duration}ms!`);
  } catch (e) {
    console.log(`Failed: ${e.message}`);
  }
}

main().catch(console.error);
