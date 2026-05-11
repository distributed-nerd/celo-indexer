import hre from "hardhat";
import fs from "fs";

const TOKEN_ADDRESS = "0x9a0bF6f79dea39D66D0E8F01B1ABf32725C7F86f";

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  
  console.log("Minting ERC20 tokens...");
  console.log("Master account:", deployer.address);
  console.log("Token contract:", TOKEN_ADDRESS);
  
  // Load the token contract
  const CeloToken = await hre.ethers.getContractFactory("CeloToken");
  const token = CeloToken.attach(TOKEN_ADDRESS);
  
  // Load generated accounts
  const accounts = JSON.parse(fs.readFileSync("generated-accounts.json", "utf8"));
  
  // Add master account to the list
  const allAccounts = [
    { index: 0, address: deployer.address },
    ...accounts
  ];
  
  console.log(`\nMinting 10 tokens to ${allAccounts.length} accounts (1 master + 100 generated)...\n`);
  
  let successCount = 0;
  let failCount = 0;
  
  for (let i = 0; i < allAccounts.length; i++) {
    const account = allAccounts[i];
    
    try {
      const tx = await token.mint(account.address, 10);
      await tx.wait();
      
      successCount++;
      console.log(`[${i + 1}/${allAccounts.length}] ✓ Minted 10 tokens to ${account.address} (Account #${account.index === 0 ? 'Master' : account.index})`);
    } catch (error) {
      failCount++;
      console.error(`[${i + 1}/${allAccounts.length}] ✗ Failed to mint to ${account.address}:`, error.message);
    }
    
    // Small delay to avoid rate limiting
    if (i < allAccounts.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 150));
    }
  }
  
  console.log(`\n✓ Minting completed!`);
  console.log(`Success: ${successCount}, Failed: ${failCount}`);
  
  // Check master account token balance
  const masterBalance = await token.balanceOf(deployer.address);
  console.log(`\nMaster account token balance: ${hre.ethers.formatEther(masterBalance)} CELO tokens`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
