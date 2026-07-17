const { ethers } = require('ethers');

async function main() {
  const provider = new ethers.JsonRpcProvider('https://bsc-testnet-rpc.publicnode.com');
  const controllerAddress = '0x08e77eAed0e97Ce0cCe08D8Dc05A3875173da402';
  const blockNumber = 117698855;

  console.log(`Querying block ${blockNumber} for events...`);

  const filter = {
    address: controllerAddress,
    fromBlock: blockNumber,
    toBlock: blockNumber
  };

  const logs = await provider.getLogs(filter);
  console.log(`Found ${logs.length} logs in block ${blockNumber}`);

  for (let i = 0; i < logs.length; i++) {
    const log = logs[i];
    console.log(`\nLog #${i}:`);
    console.log(`TxHash: ${log.transactionHash}`);
    console.log(`Topics:`, log.topics);
    console.log(`Data:`, log.data);
    
    // Fetch transaction details to see details of the tx
    try {
      const tx = await provider.getTransactionReceipt(log.transactionHash);
      console.log(`All logs in Tx ${log.transactionHash}:`);
      for (let j = 0; j < tx.logs.length; j++) {
        const txLog = tx.logs[j];
        console.log(`  TxLog #${j} address: ${txLog.address}`);
        console.log(`  Topics:`, txLog.topics);
        console.log(`  Data:`, txLog.data);
      }
    } catch (e) {
      console.error(e);
    }
  }
}

main().catch(console.error);
