import { ethers } from "ethers";
async function main() {
  const provider = new ethers.JsonRpcProvider("https://bsc-testnet-rpc.publicnode.com");
  
  // Call 0x8198d77a (returns 2)
  const len = await provider.call({
    to: "0xc11AE0e7DEB88c951a91233C75C1Dc99E8Bf6df8",
    data: "0x8198d77a"
  });
  console.log("0x8198d77a", parseInt(len, 16));

  // Call 0x502f59b6 (returns 0)
  const ptr = await provider.call({
    to: "0xc11AE0e7DEB88c951a91233C75C1Dc99E8Bf6df8",
    data: "0x502f59b6"
  });
  console.log("0x502f59b6", parseInt(ptr, 16));

  // Call queue(0)
  const q0 = await provider.call({
    to: "0xc11AE0e7DEB88c951a91233C75C1Dc99E8Bf6df8",
    data: "0xddf0b009" + "0000000000000000000000000000000000000000000000000000000000000000"
  });
  console.log("queue(0)", q0);
  
  const q1 = await provider.call({
    to: "0xc11AE0e7DEB88c951a91233C75C1Dc99E8Bf6df8",
    data: "0xddf0b009" + "0000000000000000000000000000000000000000000000000000000000000001"
  });
  console.log("queue(1)", q1);
}
main();
