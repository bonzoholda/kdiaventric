const { ethers } = require('ethers');

async function main() {
  const rpcoUrl = 'https://data-seed-prebsc-1-s1.binance.org:8545/';
  const provider = new ethers.JsonRpcProvider(rpcoUrl);
  const blockNumber = 117698855;

  const block = await provider.getBlock(blockNumber, true);
  if (!block) {
    console.log(`Block ${blockNumber} not found.`);
    return;
  }

  for (const txHash of block.transactions) {
    const receipt = await provider.getTransactionReceipt(txHash);
    const controllerLogs = receipt.logs.filter(log => log.address.toLowerCase() === '0x08e77eaed0e97ce0cce08d8dc05a3875173da402');
    
    if (controllerLogs.length > 0) {
      console.log(`\n==================================================`);
      console.log(`Tx: ${txHash}`);
      console.log(`From: ${receipt.from}`);
      console.log(`To: ${receipt.to}`);
      console.log(`==================================================`);
      
      for (let i = 0; i < controllerLogs.length; i++) {
        const log = controllerLogs[i];
        console.log(`\nLog #${i}:`);
        console.log(`  Topics:`, log.topics);
        console.log(`  Data:`, log.data);
      }
    }
  }
}

main().catch(console.error);
