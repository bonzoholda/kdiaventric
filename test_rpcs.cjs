const { ethers } = require('ethers');

const rpcs = [
  'https://data-seed-prebsc-1-s1.binance.org:8545/',
  'https://bsc-testnet.publicnode.com',
  'https://endpoints.omniatech.io/v1/bsc/testnet/public',
  'https://bsc-testnet.blockpi.network/v1/rpc/public',
  'https://1rpc.io/bsc/testnet',
  'https://bsc-testnet.drpc.org'
];

async function testRpc(url) {
  console.log(`\nTesting RPC: ${url}...`);
  try {
    // Set staticNetwork: true and short timeout to prevent hanging
    const provider = new ethers.JsonRpcProvider(url, undefined, { 
      staticNetwork: ethers.Network.from(97) // BSC Testnet is chain ID 97
    });
    
    // Add a 3-second timeout for the getBlockNumber call
    const blockNumberPromise = provider.getBlockNumber();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout after 3s')), 3000)
    );
    
    const currentBlock = await Promise.race([blockNumberPromise, timeoutPromise]);
    console.log(`  Current block: ${currentBlock}`);
    
    const controllerAddress = '0x08e77eAed0e97Ce0cCe08D8Dc05A3875173da402';
    const controllerContract = new ethers.Contract(controllerAddress, [
      "event Deposited(address indexed user, uint256 amount, address indexed referrer, uint256 positionId)"
    ], provider);

    const filter = controllerContract.filters.Deposited();
    // Query last 100 blocks
    const logsPromise = controllerContract.queryFilter(filter, currentBlock - 100);
    const logs = await Promise.race([logsPromise, timeoutPromise]);
    console.log(`  Success! Found ${logs.length} logs in last 100 blocks`);
    return true;
  } catch (e) {
    console.log(`  Failed: ${e.message.slice(0, 150)}`);
    return false;
  }
}

async function main() {
  for (const url of rpcs) {
    await testRpc(url);
  }
}

main().catch(console.error);
