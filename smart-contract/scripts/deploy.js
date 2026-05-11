import hre from "hardhat";

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());

  // Deploy CeloToken
  const CeloToken = await hre.ethers.getContractFactory("CeloToken");
  const celoToken = await CeloToken.deploy(
    "Celo Token",      // name
    "CELO",            // symbol
    1000000,           // initial supply (1 million tokens)
    18                 // decimals
  );

  await celoToken.waitForDeployment();

  console.log("CeloToken deployed to:", await celoToken.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
