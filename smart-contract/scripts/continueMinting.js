import hre from "hardhat";
import fs from "fs";

const TOKEN_ADDRESS = "0x9a0bF6f79dea39D66D0E8F01B1ABf32725C7F86f";

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  
  console.log("Continuing token minting...");
  
  const CeloToken = await hre.ethers.getContractFactory("CeloToken");
  const token = CeloToken.attach(TOKEN_ADDRESS);
  
  const accounts = JSON.parse(fs.readFileSync("generated-accounts.json", "utf8"));
  
  // Start from account 43 (index 42) onwards
  const remainingAccounts = accounts.slice(42);
  
  console.log(`Minting 10 tokens to ${remainingAccounts.length} remaining accounts...\n`);
  
  let successCount = 0;
  let failCount = 0;
  
  for (let i = 0; i < remainingAccounts.length; i++) {
    const account = remainingAccounts[i];
    
    try {
      const tx = await token.mint(account.address, 10, {
        gasLimit: 100000,
        maxFeePerGas: hre.ethers.parseUnits("0.001", "gwei"),
        maxPriorityFeePerGas: hre.ethers.parseUnits("0.001", "gwei")
      });
      await tx.wait();
      
      successCount++;
      console.log(`[${i + 1}/${remainingAccounts.length}] ✓ Minted to ${account.address} (Account #${account.index})`);
    } catch (error) {
      failCount++;
      console.error(`[${i + 1}/${remainingAccounts.length}] ✗ Failed ${account.address}:`, error.message);
    }
    
    await new Promise(resolve => setTimeout(resolve, 150));
  }
  
  console.log(`\n✓ Done! Success: ${successCount}, Failed: ${failCount}`);
  console.log(`Total minted: ${43 + successCount}/101 accounts`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
