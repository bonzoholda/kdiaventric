const { ethers } = require('ethers');

async function main() {
  const provider = new ethers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545/');
  const controllerAddress = '0x08e77eAed0e97Ce0cCe08D8Dc05A3875173da402';

  const abi = [
    "function getQueueLength() view returns (uint256)",
    "function userQueue(uint256) view returns (address, uint256, bool)",
    "function referrers(address) view returns (address)"
  ];

  const contract = new ethers.Contract(controllerAddress, abi, provider);

  console.log('Fetching queue length...');
  const queueLength = await contract.getQueueLength();
  const qLength = Number(queueLength);
  console.log(`Queue Length: ${qLength}`);

  const discoveredAddresses = new Set();
  
  // Also add some known addresses
  discoveredAddresses.add('0x4fce0e3ecf9dc63a53b833a9958924ca7bdc3907'.toLowerCase());
  discoveredAddresses.add('0xaf1202d170e329a466518233d0aae30f8e800cb5'.toLowerCase());

  console.log('Scanning user queue indices...');
  const queuePromises = [];
  for (let i = 0; i < qLength; i++) {
    queuePromises.push(
      contract.userQueue(i)
        .then(([addr, joinedAt, isClaimed]) => {
          console.log(`Queue index ${i}: user=${addr}, joinedAt=${joinedAt}, isClaimed=${isClaimed}`);
          discoveredAddresses.add(addr.toLowerCase());
        })
        .catch(err => {
          console.log(`Failed for index ${i}:`, err.message);
        })
    );
  }
  await Promise.all(queuePromises);

  console.log(`\nDiscovered ${discoveredAddresses.size} unique addresses. Querying referrers...`);
  const referrersMap = {};
  
  const refPromises = Array.from(discoveredAddresses).map(async (addr) => {
    try {
      const ref = await contract.referrers(addr);
      const refLower = ref.toLowerCase();
      if (refLower !== '0x0000000000000000000000000000000000000000') {
        referrersMap[addr] = refLower;
        console.log(`  User ${addr} -> Referrer ${refLower}`);
      } else {
        console.log(`  User ${addr} has no referrer.`);
      }
    } catch (err) {
      console.log(`  Failed to query referrer for ${addr}:`, err.message);
    }
  });
  await Promise.all(refPromises);

  console.log('\n--- Referrers Map ---');
  console.log(JSON.stringify(referrersMap, null, 2));
}

main().catch(console.error);
