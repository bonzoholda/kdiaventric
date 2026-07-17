import { ethers } from "ethers";
async function main() {
  const provider = new ethers.JsonRpcProvider("https://bsc-testnet-rpc.publicnode.com");
  const contract = new ethers.Contract("0x0B54C6cc51B4674C6b712B9E8b6369feAaAc79Fd", [
    "function queue(uint256) view returns (address owner, uint256 entryTime)"
  ], provider);
  
  for(let i=0; i<4; i++) {
    try {
      const q = await contract.queue(i);
      console.log("queue", i, q.owner);
    } catch(e) {}
  }
}
main();
