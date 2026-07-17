import { ethers } from "ethers";
async function main() {
  const provider = new ethers.JsonRpcProvider("https://bsc-testnet-rpc.publicnode.com");
  
  const names = [
    "getUserPositions(address)", "userPositions(address)", "getPositionsByOwner(address)", 
    "getActivePositions(address)", "ownerPositions(address)", "activePositions(address)",
    "addressPositions(address)", "positionsOf(address)", "getPositionsOf(address)",
    "addressToPositions(address)"
  ];
  
  for(let n of names) {
    const hash = ethers.keccak256(ethers.toUtf8Bytes(n)).slice(0, 10);
    console.log(n, hash);
  }
}
main();
