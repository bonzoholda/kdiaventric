import { ethers } from "ethers";
async function main() {
  const provider = new ethers.JsonRpcProvider("https://bsc-testnet-rpc.publicnode.com");
  const contract = new ethers.Contract("0xc11AE0e7DEB88c951a91233C75C1Dc99E8Bf6df8", [
    "function queue(uint256) view returns (address owner, uint256 entryTime)"
  ], provider);
  
  try {
    const res = await contract.queue(0);
    console.log("queue(0)", res);
  } catch(e) { console.log("queue(0) err", e.message); }
}
main();
