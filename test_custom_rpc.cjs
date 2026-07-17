const { ethers } = require('ethers');

const rpcs = [
  'https://bsc-testnet.public.blastapi.io',
  'https://rpc.ankr.com/bsc_testnet_chapel',
  'https://bsc-testnet-rpc.publicnode.com',
  'https://endpoints.omniatech.io/v1/bsc/testnet/public',
  'https://public.stackup.sh/api/v1/node/bsc-testnet'
];

async function main() {
  const controllerAddress = '0x08e77eAed0e97Ce0cCe08D8Dc05A3875173da402';
  
  for (const url of rpcs) {
    console.log(`\nTesting RPC: ${url}...`);
    try {
      // Use staticNetwork to bypass extra network detection queries
      const provider = new ethers.JsonRpcProvider(url, undefined, { 
        staticNetwork: ethers.Network.from(97),
        batchMaxCount: 1
      });
      
      const currentBlock = await provider.getBlockNumber();
      console.log(`  Current block: ${currentBlock}`);
      
      const controllerContract = new ethers.Contract(controllerAddress, [
        "event Deposited(address indexed user, uint256 amount, address indexed referrer, uint256 positionId)"
      ], provider);

      // Query from block 117700000 to latest (small range!)
      const logs = await controllerContract.queryFilter(controllerContract.filters.Deposited(), 117700000n);
      console.log(`  SUCCESS! Found ${logs.length} logs.`);
      for (const log of logs) {
        console.log(`    Deposited: User=${log.args.user}, Referrer=${log.args.referrer}, Amount=${ethers.formatUnits(log.args.amount, 18)} USDT, Block=${log.blockNumber}`);
      }
    } catch (e) {
      console.log(`  Failed: ${e.message.slice(0, 200)}`);
    }
  }
}

main().catch(console.error);
