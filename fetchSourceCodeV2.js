import { ethers } from 'ethers';

async function tryUrl(url) {
  try {
    console.log(`Trying URL: ${url}`);
    const res = await fetch(url);
    const data = await res.json();
    if (data.status === '1' && data.result && data.result[0]) {
      console.log("SUCCESS for", url);
      const sourceCode = data.result[0].SourceCode;
      const contractName = data.result[0].ContractName;
      console.log("Contract Name:", contractName);
      if (sourceCode) {
        console.log("Source code length:", sourceCode.length);
        if (sourceCode.startsWith('{{') || sourceCode.startsWith('{')) {
          console.log("JSON format, printing start...");
          console.log(sourceCode.substring(0, 1500));
        } else {
          console.log(sourceCode.substring(0, 1500));
        }
        return true;
      }
    } else {
      console.log("Failed:", data);
    }
  } catch (err) {
    console.error("Error for", url, ":", err.message);
  }
  return false;
}

async function main() {
  const address = '0xad883A781E1C63e5d78E88d81B9c602303EF89B8';
  
  // Try 1: with chainid=97 on testnet endpoint
  await tryUrl(`https://api-testnet.bscscan.com/api?chainid=97&module=contract&action=getsourcecode&address=${address}`);
  
  // Try 2: with chainid=97 on main api endpoint (Etherscan V2 style)
  await tryUrl(`https://api.bscscan.com/v2/api?chainid=97&module=contract&action=getsourcecode&address=${address}`);

  // Try 3: with api-testnet /api/v2 style
  await tryUrl(`https://api-testnet.bscscan.com/api/v2?module=contract&action=getsourcecode&address=${address}`);
}

main();
