import { ethers } from "ethers";
async function main() {
  const provider = new ethers.JsonRpcProvider("https://bsc-testnet-rpc.publicnode.com");
  const contract = new ethers.Contract("0xc11AE0e7DEB88c951a91233C75C1Dc99E8Bf6df8", [
    "function getQueueLength() view returns (uint256)",
    "function queue(uint256) view returns (address owner, uint256 entryTime, bool isProcessed)",
    "function currentPointer() view returns (uint256)",
    "function processPointer() view returns (uint256)",
    "function headIndex() view returns (uint256)",
    "function tailIndex() view returns (uint256)",
    "function currentIndex() view returns (uint256)",
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

  const pointerMethods = [
    "currentPointer", "processPointer", "headIndex", "tailIndex", "currentIndex", "activeIndex"
  ];
  for (let m of pointerMethods) {
    try {
      const res = await contract[m]();
      console.log(m, res.toString());
    } catch (e) {
      // console.log(m, "err");
    }
  }
}
main();
