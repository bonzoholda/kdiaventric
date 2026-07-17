import { ethers } from 'ethers';

const rpcUrl = 'https://bsc-testnet-rpc.publicnode.com';
const provider = new ethers.JsonRpcProvider(rpcUrl);

const microFifoAddress = '0xad883A781E1C63e5d78E88d81B9c602303EF89B8';

async function main() {
  const commonGetters = [
    "function BLOCK_SIZE() view returns (uint256)",
    "function blockSize() view returns (uint256)",
    "function POSITIONS_PER_BLOCK() view returns (uint256)",
    "function positionsPerBlock() view returns (uint256)",
    "function payoutAmount() view returns (uint256)",
    "function totalMatured() view returns (uint256)",
    "function totalPositions() view returns (uint256)",
    "function owner() view returns (address)",
    "function totalClaimed() view returns (uint256)",
    "function claimable() view returns (uint256)",
    "function getPositionsCount() view returns (uint256)",
    "function getActivePositions() view returns (uint256[])",
    "function getMaturedPositions() view returns (uint256[])",
  ];

  for (const sig of commonGetters) {
    try {
      const tempContract = new ethers.Contract(microFifoAddress, [sig], provider);
      const name = sig.split(" ")[1].split("(")[0];
      const result = await tempContract[name]();
      console.log(`Getter ${name} succeeded:`, result.toString());
    } catch (_) {
      // Ignored
    }
  }
}

main();
