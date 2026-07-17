const { ethers } = require('ethers');

async function main() {
  const provider = new ethers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545/');
  const controllerAddress = '0x08e77eAed0e97Ce0cCe08D8Dc05A3875173da402';

  console.log('Querying latest 1000 blocks for events...');
  const latestBlock = await provider.getBlockNumber();
  const fromBlock = latestBlock - 50000; // Search last 50,000 blocks

  console.log(`Latest block: ${latestBlock}, searching from: ${fromBlock}`);

  const filter = {
    address: controllerAddress,
    fromBlock: fromBlock,
    toBlock: 'latest'
  };

  const logs = await provider.getLogs(filter);
  console.log(`Found ${logs.length} logs for controller contract`);

  for (let i = 0; i < Math.min(logs.length, 50); i++) {
    const log = logs[logs.length - 1 - i]; // print recent ones first
    console.log(`\nLog #${i}:`);
    console.log(`TxHash: ${log.transactionHash}`);
    console.log(`Block: ${log.blockNumber}`);
    console.log(`Topics:`, log.topics);
    console.log(`Data:`, log.data);
  }
}

main().catch(console.error);
