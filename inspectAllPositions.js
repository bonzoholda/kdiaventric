import { ethers } from 'ethers';

const rpcUrl = 'https://bsc-testnet-rpc.publicnode.com';
const provider = new ethers.JsonRpcProvider(rpcUrl);

const microFifoAddress = '0xad883A781E1C63e5d78E88d81B9c602303EF89B8';

async function main() {
  try {
    const abi = [
      "function nextPositionId() view returns (uint256)",
      "function positions(uint256) view returns (uint256, address, bool, uint256)",
      "function velocityBufferPool() view returns (uint256)"
    ];
    const contract = new ethers.Contract(microFifoAddress, abi, provider);

    const nextPos = await contract.nextPositionId();
    const buffer = await contract.velocityBufferPool();
    console.log("On-chain nextPositionId:", nextPos.toString());
    console.log("On-chain velocityBufferPool:", ethers.formatUnits(buffer, 18), "USDT");

    const count = Number(nextPos);
    for (let i = 1; i < count; i++) {
      const [posId, owner, isMatured, val] = await contract.positions(i);
      console.log(`Position #${i}: owner=${owner}, isMatured=${isMatured}, val=${val.toString()}`);
    }

  } catch (error) {
    console.error("Error:", error);
  }
}

main();
