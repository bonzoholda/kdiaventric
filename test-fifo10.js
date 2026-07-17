import { ethers } from "ethers";
async function main() {
  const provider = new ethers.JsonRpcProvider("https://bsc-testnet-rpc.publicnode.com");
  const unk = ["0x53acab2e","0x554f5e9f","0x04d778d1","0x1a07a8e2","0xd7aa72cd","0xdcb6217a","0xcb4ae758","0x605f701e","0x45785d8a","0x14dd161f","0xf22ba38c","0x573d5f5f","0x82612624","0x43000822"];
  
  for(let sel of unk) {
    try {
      const res = await provider.call({
        to: "0xc11AE0e7DEB88c951a91233C75C1Dc99E8Bf6df8",
        data: sel
      });
      if(res !== "0x") console.log(sel, res);
    } catch(e) {}
  }
}
main();
