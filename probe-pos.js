import { ethers } from "ethers";
async function main() {
  const provider = new ethers.JsonRpcProvider("https://bsc-testnet-rpc.publicnode.com");
  const contractAddress = "0xDCFaA231bbB753502Ec6Cc514Ae4d7cAF50c4C17";
  const contract = new ethers.Contract(contractAddress, ["function positions(uint256) view returns (address, uint256, bool)"], provider);
  
  try {
    const res = await contract.positions(0);
    console.log("Position 0:", res);
  } catch(e) {
    console.log("Error querying positions(0) with 3 args:", e.message);
    const contract2 = new ethers.Contract(contractAddress, ["function positions(uint256) view returns (address, uint256)"], provider);
    const res = await contract2.positions(0);
    console.log("Position 0 (2 args):", res);
  }
}
main();
