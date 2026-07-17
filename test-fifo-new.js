import { ethers } from "ethers";
async function main() {
  const provider = new ethers.JsonRpcProvider("https://bsc-testnet-rpc.publicnode.com");
  const contract = new ethers.Contract("0x0B54C6cc51B4674C6b712B9E8b6369feAaAc79Fd", [
    "function getQueueLength() view returns (uint256)",
    "function queue(uint256) view returns (address owner, uint256 entryTime)",
    "function activeIndex() view returns (uint256)"
  ], provider);
  
  try {
    const nextId = await contract.getQueueLength();
    console.log("getQueueLength", nextId.toString());
  } catch(e) { console.log("getQueueLength err", e.message); }

  try {
    const res = await contract.queue(0);
    console.log("queue(0)", res);
  } catch(e) { console.log("queue(0) err", e.message); }

}
main();
