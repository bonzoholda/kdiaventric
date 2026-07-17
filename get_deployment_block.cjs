const { ethers } = require('ethers');

async function main() {
  const provider = new ethers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545/');
  const address = '0x08e77eAed0e97Ce0cCe08D8Dc05A3875173da402';

  let low = 0;
  let high = await provider.getBlockNumber();
  let deploymentBlock = high;

  console.log(`Finding deployment block for ${address}...`);
  console.log(`Latest block: ${high}`);

  while (low <= high) {
    let mid = Math.floor((low + high) / 2);
    const code = await provider.getCode(address, mid).catch(() => '0x');
    if (code !== '0x' && code !== '0x0' && code !== '') {
      deploymentBlock = mid;
      high = mid - 1; // Try to find an even earlier block
    } else {
      low = mid + 1;
    }
  }

  console.log(`Contract deployed at block: ${deploymentBlock}`);
}

main().catch(console.error);
