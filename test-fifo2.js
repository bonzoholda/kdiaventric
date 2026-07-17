import { ethers } from "ethers";
async function main() {
  const provider = new ethers.JsonRpcProvider("https://bsc-testnet-rpc.publicnode.com");
  const code = await provider.getCode("0xc11AE0e7DEB88c951a91233C75C1Dc99E8Bf6df8");
  const buf = Buffer.from(code.slice(2), "hex");
  for(let i = 0; i < buf.length; i++) {
    if(buf[i] === 0x63) {
      console.log("0x" + buf.slice(i+1, i+5).toString("hex"));
    }
  }
}
main();
