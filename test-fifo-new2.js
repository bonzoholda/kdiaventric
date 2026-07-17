import { ethers } from "ethers";
async function main() {
  const provider = new ethers.JsonRpcProvider("https://bsc-testnet-rpc.publicnode.com");
  
  // Try 0x502f59b6
  try {
    const ptr = await provider.call({
      to: "0x0B54C6cc51B4674C6b712B9E8b6369feAaAc79Fd",
      data: "0x502f59b6"
    });
    console.log("0x502f59b6", ptr);
  } catch(e) {}
}
main();
