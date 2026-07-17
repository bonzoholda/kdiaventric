import { ethers } from "ethers";
async function main() {
  const provider = new ethers.JsonRpcProvider("https://bsc-testnet-rpc.publicnode.com");
  
  const v1 = await provider.call({
    to: "0xc11AE0e7DEB88c951a91233C75C1Dc99E8Bf6df8",
    data: "0xb8f77005"
  });
  console.log("getQueueLength()", v1);
}
main();
