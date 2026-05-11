import hre from "hardhat";

const TOKEN_ADDRESS = "0x9a0bF6f79dea39D66D0E8F01B1ABf32725C7F86f";

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  
  const CeloToken = await hre.ethers.getContractFactory("CeloToken");
  const token = CeloToken.attach(TOKEN_ADDRESS);
  
  const account43 = "0x5f8fA16EEca8D3E7A78AFA6873B5cA1A4Ae910DE";
  
  console.log("Minting 10 tokens to Account #43...");
  
  const tx = await token.mint(account43, 10);
  
  await tx.wait();
  
  console.log(`✓ Minted 10 tokens to ${account43}`);
  console.log(`Transaction: ${tx.hash}`);
  
  const balance = await token.balanceOf(account43);
  console.log(`New balance: ${hre.ethers.formatEther(balance)} tokens`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
