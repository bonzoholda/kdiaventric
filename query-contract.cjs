const { ethers } = require('ethers');

async function main() {
  const provider = new ethers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545/');
  const controllerAddress = '0xfEf6De3FA87E9Edc70af962a62857a9d0604d833';

  // Try different common methods to find the owner or default referrer
  const abi = [
    "function owner() view returns (address)",
    "function admin() view returns (address)",
    "function defaultReferrer() view returns (address)",
    "function root() view returns (address)",
    "function primaryAdmin() view returns (address)"
  ];

  const contract = new ethers.Contract(controllerAddress, abi, provider);

  console.log('Querying owner...');
  try {
    const owner = await contract.owner();
    console.log('owner:', owner);
  } catch (e) {
    console.log('owner() failed:', e.message);
  }

  console.log('Querying admin...');
  try {
    const admin = await contract.admin();
    console.log('admin:', admin);
  } catch (e) {
    console.log('admin() failed:', e.message);
  }

  console.log('Querying defaultReferrer...');
  try {
    const defaultReferrer = await contract.defaultReferrer();
    console.log('defaultReferrer:', defaultReferrer);
  } catch (e) {
    console.log('defaultReferrer() failed:', e.message);
  }

  console.log('Querying root...');
  try {
    const root = await contract.root();
    console.log('root:', root);
  } catch (e) {
    console.log('root() failed:', e.message);
  }
}

main().catch(console.error);
