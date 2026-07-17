import { ethers } from "ethers";
const names = [
  "processPointer()", "currentPointer()", "pointer()", "headIndex()", "currentIndex()",
  "activePointer()", "frontPointer()", "queuePointer()", "nextProcessPointer()",
  "tailIndex()", "nextPositionId()", "nextPosition()", "currentPositionId()",
  "queueIndex()", "activeIndex()", "head()", "tail()", "currentId()",
  "nextId()", "nextProcessPositionPointer()", "processIndex()",
  "currentProcessPositionPointer()", "currentIndexPointer()"
];
for(let n of names) {
  const hash = ethers.keccak256(ethers.toUtf8Bytes(n)).slice(0, 10);
  if (hash === "0x502f59b6" || hash === "0x8198d77a") {
    console.log("Found:", n, "->", hash);
  }
}
