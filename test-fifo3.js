import { ethers } from "ethers";
async function main() {
  const provider = new ethers.JsonRpcProvider("https://bsc-testnet-rpc.publicnode.com");
  const code = await provider.getCode("0xc11AE0e7DEB88c951a91233C75C1Dc99E8Bf6df8");
  const buf = Buffer.from(code.slice(2), "hex");
  let selectors = new Set();
  for(let i = 0; i < buf.length; i++) {
    if(buf[i] === 0x63) {
      selectors.add("0x" + buf.slice(i+1, i+5).toString("hex"));
    }
  }
  for(let sel of selectors) {
    try {
      const res = await fetch("https://www.4byte.directory/api/v1/signatures/?hex_signature=" + sel);
      if(res.ok) {
        const data = await res.json();
        if(data.results && data.results.length > 0) {
          console.log(sel, data.results[0].text_signature);
        } else {
          console.log(sel, "Unknown");
        }
      }
    } catch(e) {}
  }
}
main();
