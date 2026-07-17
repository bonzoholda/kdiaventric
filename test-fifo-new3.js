import { ethers } from "ethers";
async function main() {
  const provider = new ethers.JsonRpcProvider("https://bsc-testnet-rpc.publicnode.com");
  const contract = new ethers.Contract("0x0B54C6cc51B4674C6b712B9E8b6369feAaAc79Fd", [
    "function getQueueLength() view returns (uint256)",
    "function queue(uint256) view returns (address owner, uint256 entryTime)"
  ], provider);
  
  try {
    const nextId = await contract.getQueueLength();
    console.log("getQueueLength", nextId.toString());
    for(let i=0; i<nextId; i++) {
      const q = await contract.queue(i);
      console.log("queue("+i+")", q.owner, q.entryTime.toString());
    }
  } catch(e) {}
}
main();
