const { ethers } = require('ethers');

async function main() {
  const rpcoUrl = 'https://data-seed-prebsc-1-s1.binance.org:8545/';
  const provider = new ethers.JsonRpcProvider(rpcoUrl);
  const blockNumber = 117698855;

  console.log(`Fetching block ${blockNumber} transactions...`);
  const block = await provider.getBlock(blockNumber, true);
  if (!block) {
    console.log(`Block ${blockNumber} not found.`);
    return;
  }

  console.log(`Block has ${block.transactions.length} transactions`);
  for (const txHash of block.transactions) {
    const tx = await provider.getTransaction(txHash);
    if (!tx) continue;
    console.log(`\nTx Hash: ${tx.hash}`);
    console.log(`From: ${tx.from}`);
    console.log(`To: ${tx.to}`);
    console.log(`Value: ${ethers.formatEther(tx.value)} BNB`);
    console.log(`Input: ${(tx.data || '').slice(0, 138)}`);
    
    // Check if it interacted with our contract or is the deposit
    const receipt = await provider.getTransactionReceipt(tx.hash);
    console.log(`Status: ${receipt.status === 1 ? 'Success' : 'Failed'}`);
    console.log(`Logs emitted: ${receipt.logs.length}`);
    for (const log of receipt.logs) {
      console.log(`  Log emitter: ${log.address}`);
      console.log(`  Topics:`, log.topics);
      console.log(`  Data:`, log.data);
    }
  }
}

main().catch(console.error);
