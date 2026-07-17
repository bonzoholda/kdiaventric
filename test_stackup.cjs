const { ethers } = require('ethers');

async function main() {
  const url = 'https://public.stackup.sh/api/v1/node/bsc-testnet';
  const provider = new ethers.JsonRpcProvider(url, undefined, { staticNetwork: ethers.Network.from(97) });
  const currentBlock = await provider.getBlockNumber();
  console.log(`Current block: ${currentBlock}`);
  
  const controllerAddress = '0x08e77eAed0e97Ce0cCe08D8Dc05A3875173da402';
  const controllerContract = new ethers.Contract(controllerAddress, [
    "event Deposited(address indexed user, uint256 amount, address indexed referrer, uint256 positionId)"
  ], provider);

  const logs = await controllerContract.queryFilter(controllerContract.filters.Deposited(), 117700000n);
  console.log(`Success! Found ${logs.length} logs on Stackup.`);
}

main().catch(console.error);
