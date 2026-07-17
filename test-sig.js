import { ethers } from "ethers";
console.log("activeIndex()", ethers.keccak256(ethers.toUtf8Bytes("activeIndex()")).slice(0, 10));
console.log("currentProcessPointer()", ethers.keccak256(ethers.toUtf8Bytes("currentProcessPointer()")).slice(0, 10));
console.log("nextProcessPositionPointer()", ethers.keccak256(ethers.toUtf8Bytes("nextProcessPositionPointer()")).slice(0, 10));
