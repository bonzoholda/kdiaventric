import { ethers } from "ethers";
async function main() {
  const selectors = [
    "0x863e76db", "0xa0845074", "0xa98ad46c", "0xb5a01c4e", "0xc0060d09", "0x899346c7",
    "0x91f161e2", "0x99fbab88", "0x3dc6eabf", "0x4a0b09f1", "0x554f5e9f", "0x80972c83",
    "0x04d778d1", "0x0912d6d0", "0x1a95f15f", "0x3c73523a", "0x91906129", "0x23b872dd",
    "0xffffffff", "0xd7aa72cd", "0x4a3b68cc", "0x59297dbf", "0xa9059cbb", "0xdcb6217a",
    "0xcb4ae758", "0x92919061", "0x7d8df2d6", "0x605f701e", "0x90613135", "0x90612fd3",
    "0x14dd161f", "0xf22ba38c", "0x45785d8a", "0x43000822"
  ];

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
