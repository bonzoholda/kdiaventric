import { ethers } from 'ethers';

async function main() {
  const address = '0xad883A781E1C63e5d78E88d81B9c602303EF89B8';
  const url = `https://api-testnet.bscscan.com/api?module=contract&action=getsourcecode&address=${address}`;
  
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.status === '1' && data.result && data.result[0]) {
      const sourceCode = data.result[0].SourceCode;
      const contractName = data.result[0].ContractName;
      const abi = data.result[0].ABI;
      console.log("Contract Name:", contractName);
      if (sourceCode) {
        console.log("Source code found!");
        // If it is multi-file JSON
        if (sourceCode.startsWith('{{') || sourceCode.startsWith('{')) {
          console.log("JSON format, printing first 2000 chars of source...");
          console.log(sourceCode.substring(0, 2000));
        } else {
          console.log(sourceCode.substring(0, 3000));
        }
      } else {
        console.log("No source code. ABI:", abi);
      }
    } else {
      console.log("Failed to fetch source code:", data);
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

main();
