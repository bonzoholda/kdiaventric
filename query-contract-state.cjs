const { ethers } = require('ethers');

async function main() {
  const provider = new ethers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545/');
  const controllerAddress = '0xfEf6De3FA87E9Edc70af962a62857a9d0604d833';
  const userAddress = '0xAF1202D170e329a466518233D0AaE30f8E800CB5';

  // We can call functions by their raw 4-byte selector using eth_call
  const selectors = [
    '0x03fd2a45', // common: name()
    '0xaa270f6e', // maybe users(address)
    '0x7d8df2d6', // maybe userInfo(address)
    '0xde9a7e19', // maybe getQueueLength() or user queue
    '0x715018a6'  // maybe another view
  ];

  for (const selector of selectors) {
    console.log(`\n--- Calling selector: ${selector} with user address ---`);
    try {
      // Encode selector + 32-byte address parameter
      const data = selector + ethers.zeroPadValue(userAddress, 32).slice(2);
      const res = await provider.call({
        to: controllerAddress,
        data: data
      });
      console.log('Result (hex):', res);
      try {
        // Try to decode as string, uint256, or address
        const decodedUint = ethers.AbiCoder.defaultAbiCoder().decode(['uint256'], res);
        console.log('As uint256:', decodedUint[0].toString());
      } catch (e) {}
      try {
        const decodedAddr = ethers.AbiCoder.defaultAbiCoder().decode(['address'], res);
        console.log('As address:', decodedAddr[0]);
      } catch (e) {}
    } catch (e) {
      console.log('Failed:', e.message);
    }
  }

  // Let's also call with no parameters
  const noParamSelectors = [
    '0xde9a7e19',
    '0x715018a6',
    '0x3469336d',
    '0x07f081ff'
  ];
  for (const selector of noParamSelectors) {
    console.log(`\n--- Calling selector: ${selector} with no params ---`);
    try {
      const res = await provider.call({
        to: controllerAddress,
        data: selector
      });
      console.log('Result (hex):', res);
      try {
        const decodedUint = ethers.AbiCoder.defaultAbiCoder().decode(['uint256'], res);
        console.log('As uint256:', decodedUint[0].toString());
      } catch (e) {}
    } catch (e) {
      console.log('Failed:', e.message);
    }
  }
}

main().catch(console.error);
