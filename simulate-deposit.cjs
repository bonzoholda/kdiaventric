const { ethers } = require('ethers');

async function main() {
  const provider = new ethers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545/');
  const controllerAddress = '0x003573a07BC106f64A476DcE8A374331E6e476A1';
  const userAddress = '0x4FcE0E3ecF9Dc63A53B833A9958924CA7BDc3907';

  // Let's create a signer with user's address just for simulating (impersonation/staticCall)
  // Actually, staticCall can accept the "from" address
  const abi = [
    "function deposit(uint256 amount, address referrer) external",
    "function buyMatrix(uint256 amount, address referrer) external",
    "function buy(uint256 amount, address referrer) external",
    "function owner() view returns (address)"
  ];

  const contract = new ethers.Contract(controllerAddress, abi, provider);

  const amount = ethers.parseUnits('50', 18); // 50 USDT
  const referrers = [
    '0x0000000000000000000000000000000000000000',
    '0xAF1202D170e329a466518233D0AaE30f8E800CB5', // Self-referral
    '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4'  // Sandbox default
  ];

  for (const ref of referrers) {
    console.log(`\n--- Simulating deposit with referrer: ${ref} ---`);
    try {
      // In ethers v6, we can specify overrides like `from` in populateTransaction or staticCall
      const tx = await contract.deposit.populateTransaction(amount, ref);
      tx.from = userAddress;

      // Execute gas estimation
      const estGas = await provider.estimateGas(tx);
      console.log('Estimated Gas:', estGas.toString());

      // Execute eth_call
      const result = await provider.call(tx);
      console.log('Call result (hex):', result);
    } catch (e) {
      console.log('Error reason:', e.reason);
      console.log('Error message:', e.message);
      if (e.data) {
        console.log('Error data:', e.data);
      }
    }
  }
}

main().catch(console.error);
