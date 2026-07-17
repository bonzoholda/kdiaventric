const { ethers } = require('ethers');

const moreRpcs = [
  'https://rpc.ankr.com/bsc_testnet_chapel',
  'https://bsc-testnet.public.blastapi.io',
  'https://endpoints.omniatech.io/v1/bsc/testnet/public',
  'https://bsc-testnet-rpc.publicnode.com'
];

async function main() {
  const controllerAddress = '0x08e77eAed0e97Ce0cCe08D8Dc05A3875173da402';
  
  for (const url of moreRpcs) {
    console.log(`\nTesting RPC: ${url}...`);
    try {
      const provider = new ethers.JsonRpcProvider(url, undefined, { staticNetwork: true });
      const currentBlock = await provider.getBlockNumber();
      console.log(`  Current block: ${currentBlock}`);
      
      const controllerContract = new ethers.Contract(controllerAddress, [
        "event Deposited(address indexed user, uint256 amount, address indexed referrer, uint256 positionId)"
      ], provider);

      // Try querying 2000 blocks (from block 117698800)
      const logs = await controllerContract.queryFilter(controllerContract.filters.Deposited(), 117698800);
      console.log(`  SUCCESS! Found ${logs.length} logs from block 117698800 to latest.`);
      for (const log of logs) {
        console.log(`    Log: Tx=${log.transactionHash}, block=${log.blockNumber}`);
      }
    } catch (e) {
      console.log(`  Failed: ${e.message.slice(0, 150)}`);
    }
  }
}

main().catch(console.error);
