import { ethers } from 'ethers';

const rpcUrl = 'https://bsc-testnet-rpc.publicnode.com';
const provider = new ethers.JsonRpcProvider(rpcUrl);

const microFifoAddress = '0xad883A781E1C63e5d78E88d81B9c602303EF89B8';
const userAddress = '0xAF1202D170e329a466518233D0AaE30f8E800CB5';

async function main() {
  try {
    const abi = [
      "function nextPositionId() view returns (uint256)",
      "function positions(uint256) view returns (uint256, address, bool, uint256)",
      "function pendingPayouts(address) view returns (uint256)"
    ];
    const contract = new ethers.Contract(microFifoAddress, abi, provider);

    const nextPos = await contract.nextPositionId();
    console.log("On-chain nextPositionId:", nextPos.toString());

    const pendingPayout = await contract.pendingPayouts(userAddress);
    console.log("On-chain pendingPayout for user:", ethers.formatUnits(pendingPayout, 18), "USDT");

    // Scan all positions from 1 to nextPos - 1 in parallel chunks
    console.log("Scanning positions up to", nextPos.toString());
    const nextPosNum = Number(nextPos);
    const promises = [];
    for (let i = 1; i < nextPosNum; i++) {
      promises.push(
        contract.positions(i).then(pos => {
          const [posId, owner, isMatured, lastVal] = pos;
          return {
            index: i,
            posId: posId.toString(),
            owner,
            isMatured,
            lastVal: lastVal.toString()
          };
        }).catch(() => null)
      );
    }

    const allPositions = await Promise.all(promises);
    const userPositions = allPositions.filter(p => p && p.owner.toLowerCase() === userAddress.toLowerCase());

    console.log(`User owns ${userPositions.length} positions:`);
    console.log(JSON.stringify(userPositions, null, 2));

  } catch (error) {
    console.error("Error:", error);
  }
}

main();
