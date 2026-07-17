import { ethers } from "ethers";
async function main() {
  const provider = new ethers.JsonRpcProvider("https://bsc-testnet-rpc.publicnode.com");
  const contractAddress = "0xDCFaA231bbB753502Ec6Cc514Ae4d7cAF50c4C17";
  
  // Try probing for common methods
  const methods = [
    "userPositions(address)",
    "activePositions(address)",
    "getPositionsByOwner(address)",
    "queue(uint256)",
    "getQueueLength()"
  ];
  
  for(const method of methods) {
    const hash = ethers.keccak256(ethers.toUtf8Bytes(method)).slice(0, 10);
    try {
      await provider.call({
        to: contractAddress,
        data: hash
      });
      console.log(`Method ${method} (${hash}) might exist.`);
    } catch(e) {
      console.log(`Method ${method} (${hash}) failed or doesn't exist.`);
    }
  }
}
main();
