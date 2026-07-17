const { ethers } = require('ethers');

async function main() {
  const provider = new ethers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545/');
  
  const controllerAddress = '0x32c01bA356014f800eC1d62530ddF87c7f312a4e';
  const microFifoAddress = '0xfaa8Cc388465a5F85F4Ac5CAFE35E83a9921C337';
  const testnetUsdt = '0xd5210074786CfBE75b66FEC5D72Ae79020514afD';
  const mainnetUsdt = '0x55d398326f99059fF775485246999027B3197955';

  console.log('Checking codes...');
  console.log('Code at testnet USDT:', await provider.getCode(testnetUsdt).catch(() => 'error'));
  console.log('Code at mainnet USDT:', await provider.getCode(mainnetUsdt).catch(() => 'error'));
  console.log('Code at MicroFifo:', await provider.getCode(microFifoAddress).catch(() => 'error'));

  console.log('--- Querying MicroFifo ---');
  const fifoAbi = [
    "function nextPositionId() view returns (uint256)",
    "function currentBlockId() view returns (uint256)",
    "function velocityBufferPool() view returns (uint256)",
    "function lastInjectionTimestamp() view returns (uint256)",
    "function positions(uint256) view returns (uint256 id, address owner, bool isDummy, uint256 balance)"
  ];
  const fifo = new ethers.Contract(microFifoAddress, fifoAbi, provider);

  try {
    const nextPos = await fifo.nextPositionId();
    console.log('nextPositionId:', nextPos.toString());
    
    const currBlock = await fifo.currentBlockId();
    console.log('currentBlockId:', currBlock.toString());
    
    const bufferPool = await fifo.velocityBufferPool();
    console.log('velocityBufferPool:', ethers.formatUnits(bufferPool, 18), 'USDT');
    
    const lastInjection = await fifo.lastInjectionTimestamp();
    console.log('lastInjectionTimestamp:', lastInjection.toString());

    const totalPos = Number(nextPos);
    console.log(`Checking first few positions out of ${totalPos}...`);
    for (let i = 1; i <= Math.min(totalPos, 5); i++) {
      try {
        const pos = await fifo.positions(i);
        console.log(`Position #${i}: id=${pos[0]}, owner=${pos[1]}, isDummy=${pos[2]}, balance=${ethers.formatUnits(pos[3], 18)} USDT`);
      } catch (err) {
        console.log(`Failed to fetch position #${i}:`, err.message);
      }
    }
  } catch (e) {
    console.log('MicroFifo query failed:', e.message);
  }
}

main().catch(console.error);
