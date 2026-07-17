import { ethers } from "ethers";
async function main() {
  const provider = new ethers.JsonRpcProvider("https://bsc-testnet-rpc.publicnode.com");
  const contractAddress = "0xDCFaA231bbB753502Ec6Cc514Ae4d7cAF50c4C17";
  const code = await provider.getCode(contractAddress);
  const buf = Buffer.from(code.slice(2), "hex");
  let selectors = new Set();
  for(let i = 0; i < buf.length; i++) {
    if(buf[i] === 0x63) {
      selectors.add("0x" + buf.slice(i+1, i+5).toString("hex"));
    }
  }
  for(let sel of selectors) {
    console.log(sel);
  }
}
main();
