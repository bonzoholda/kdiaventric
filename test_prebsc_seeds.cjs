const { ethers } = require('ethers');

const prebscUrls = [
  'https://data-seed-prebsc-1-s1.binance.org:8545/',
  'https://data-seed-prebsc-2-s1.binance.org:8545/',
  'https://data-seed-prebsc-1-s2.binance.org:8545/',
  'https://data-seed-prebsc-2-s2.binance.org:8545/'
];

async function main() {
  const controllerAddress = '0x08e77eAed0e97Ce0cCe08D8Dc05A3875173da402';
  
  for (const url of prebscUrls) {
    console.log(`\nTesting prebsc RPC: ${url}...`);
    try {
      const provider = new ethers.JsonRpcProvider(url, undefined, { 
        staticNetwork: ethers.Network.from(97),
        batchMaxCount: 1
      });
      const currentBlock = await provider.getBlockNumber();
      console.log(`  Current block: ${currentBlock}`);
      
      const controllerContract = new ethers.Contract(controllerAddress, [
        "event Deposited(address indexed user, uint256 amount, address indexed referrer, uint256 positionId)"
      ], provider);

      // Try querying 10 blocks (extremely narrow range)
      const logs = await controllerContract.queryFilter(controllerContract.filters.Deposited(), BigInt(currentBlock - 10));
      console.log(`  SUCCESS! Found ${logs.length} logs.`);
    } catch (e) {
      console.log(`  Failed: ${e.message.slice(0, 150)}`);
    }
  }
}

main().catch(console.error);
