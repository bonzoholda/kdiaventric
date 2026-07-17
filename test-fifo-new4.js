import { ethers } from "ethers";
async function main() {
  const provider = new ethers.JsonRpcProvider("https://bsc-testnet-rpc.publicnode.com");
  const wallet = new ethers.Wallet("0x" + "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2", provider);
  
  // Wait, I need a funded wallet to interact... But I don't have private keys for testnet here.
  // We can just rely on the user testing it.
}
