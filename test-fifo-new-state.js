import { ethers } from "ethers";
async function main() {
  const provider = new ethers.JsonRpcProvider("https://bsc-testnet-rpc.publicnode.com");
  const contract = new ethers.Contract("0x0B54C6cc51B4674C6b712B9E8b6369feAaAc79Fd", [
    "function getQueueLength() view returns (uint256)"
  ], provider);
  
  try {
    const len = await contract.getQueueLength();
    console.log("getQueueLength", len.toString());
  } catch(e) {}
  
  try {
    const ptr = await provider.call({
      to: "0x0B54C6cc51B4674C6b712B9E8b6369feAaAc79Fd",
      data: "0x502f59b6" // Maybe nextProcessPointerNum
    });
    console.log("pointer", parseInt(ptr, 16));
  } catch(e) {}
}
main();
