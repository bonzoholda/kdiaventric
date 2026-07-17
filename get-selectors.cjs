const { ethers } = require('ethers');

async function main() {
  const provider = new ethers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545/');
  const controllerAddress = '0x003573a07BC106f64A476DcE8A374331E6e476A1';

  const bytecode = await provider.getCode(controllerAddress);
  if (bytecode === '0x' || bytecode === '0x0') {
    console.log('No bytecode found!');
    return;
  }

  console.log(`Bytecode length: ${bytecode.length} hex chars`);

  // Parse all PUSH4 instructions in EVM bytecode
  // PUSH4 opcode is 0x63, followed by 4 bytes of data.
  const selectors = new Set();
  const bytes = ethers.getBytes(bytecode);
  
  for (let i = 0; i < bytes.length - 4; i++) {
    if (bytes[i] === 0x63) { // PUSH4
      const selector = ethers.hexlify(bytes.slice(i + 1, i + 5));
      selectors.add(selector);
      i += 4; // Skip the PUSH4 data
    }
  }

  console.log('Found function selectors in bytecode:');
  const sorted = Array.from(selectors).sort();
  console.log(sorted);

  // Let's check common selectors for deposit, buy, etc.
  const known = {
    '0x6e553f65': 'deposit(uint256,address)',
    '0x0283cf2c': 'buy(uint256,address)',
    '0x09bc97ee': 'buyMatrix(uint256,address)',
    '0x8dbdbe6d': 'claimVesting()',
    '0x45785d8a': 'claimReferralRewards()',
    '0xb40037a3': 'claimMatrixReward()',
    '0x571ac8b8': 'claimMatrixReward(uint255)',
    '0x82662c16': 'claimMatrixReward(uint256)',
    '0x8cc40743': 'claimVestingLinear()',
    '0xf305d719': 'addLiquidity(...)',
    '0x893d20e8': 'owner()'
  };

  console.log('\nMatching against known selectors:');
  for (const sel of sorted) {
    if (known[sel]) {
      console.log(`${sel}: ${known[sel]}`);
    } else {
      console.log(`${sel}: unknown`);
    }
  }
}

main().catch(console.error);
