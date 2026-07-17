import { ethers } from "ethers";
async function main() {
  const provider = new ethers.JsonRpcProvider("https://bsc-testnet-rpc.publicnode.com");
  const contract = new ethers.Contract("0xc11AE0e7DEB88c951a91233C75C1Dc99E8Bf6df8", [
    "function currentPositionId() view returns (uint256)",
    "function currentProcessPointer() view returns (uint256)"
  ], provider);
  
  try {
    const nextId = await contract.currentPositionId();
    console.log("currentPositionId", nextId.toString());
  } catch(e) { console.log(e.message); }

  try {
    const pointer = await contract.currentProcessPointer();
    console.log("currentProcessPointer", pointer.toString());
  } catch(e) { console.log(e.message); }
}
main();
