import { ethers } from "ethers";
async function main() {
  const provider = new ethers.JsonRpcProvider("https://bsc-testnet-rpc.publicnode.com");
  
  const addrs = ["0x502f59b6", "0x3c73523a", "0xbd9e4fc0", "0x9dfc4a61"];
  for(let a of addrs) {
    try {
      const ptr = await provider.call({
        to: "0x0B54C6cc51B4674C6b712B9E8b6369feAaAc79Fd",
        data: a
      });
      console.log(a, parseInt(ptr, 16));
    } catch(e) {
      console.log(a, e.message);
    }
  }
}
main();
