const hre = require("hardhat");

async function main() {
  const Voting = await hre.ethers.getContractFactory("Voting");
  const voting = await Voting.deploy();
  await voting.waitForDeployment(); // ✅ remplace .deployed() pour ethers v6

  console.log("Voting deployed at:", await voting.getAddress()); // ✅ .address devient une promesse
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
