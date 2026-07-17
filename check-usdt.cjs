const { ethers } = require('ethers');

async function main() {
  const provider = new ethers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545/');
  const userAddress = '0xAF1202D170e329a466518233D0AaE30f8E800CB5';
  const controllerAddress = '0xfEf6De3FA87E9Edc70af962a62857a9d0604d833';
  const usdtAddress = '0xd5210074786CfBE75b66FEC5D72Ae79020514afD';

  const erc20Abi = [
    "function balanceOf(address account) view returns (uint256)",
    "function allowance(address owner, address spender) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)"
  ];

  const usdt = new ethers.Contract(usdtAddress, erc20Abi, provider);

  const sym = await usdt.symbol().catch(() => 'USDT');
  const dec = await usdt.decimals().catch(() => 18);
  const bal = await usdt.balanceOf(userAddress);
  const allow = await usdt.allowance(userAddress, controllerAddress);

  console.log(`Token: ${sym}`);
  console.log(`Decimals: ${dec}`);
  console.log(`User Balance: ${ethers.formatUnits(bal, dec)} ${sym}`);
  console.log(`Allowance to Controller: ${ethers.formatUnits(allow, dec)} ${sym}`);
}

main().catch(console.error);
