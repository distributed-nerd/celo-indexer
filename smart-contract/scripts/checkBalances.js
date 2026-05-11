import hre from "hardhat";
import fs from "fs";

const TOKEN_ADDRESS = "0x9a0bF6f79dea39D66D0E8F01B1ABf32725C7F86f";

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  
  console.log("Checking token balances for all accounts...\n");
  
  const CeloToken = await hre.ethers.getContractFactory("CeloToken");
  const token = CeloToken.attach(TOKEN_ADDRESS);
  
  const accounts = JSON.parse(fs.readFileSync("generated-accounts.json", "utf8"));
  
  // Add master account
  const allAccounts = [
    { index: 0, address: deployer.address, label: "Master" },
    ...accounts.map(acc => ({ ...acc, label: `#${acc.index}` }))
  ];
  
  let withTokens = 0;
  let withoutTokens = 0;
  const accountsWithoutTokens = [];
  
  console.log("Checking 101 accounts (1 master + 100 generated)...\n");
  
  for (let i = 0; i < allAccounts.length; i++) {
    const account = allAccounts[i];
    
    try {
      const balance = await token.balanceOf(account.address);
      const balanceFormatted = hre.ethers.formatEther(balance);
      
      if (balance > 0) {
        withTokens++;
        console.log(`✓ Account ${account.label}: ${balanceFormatted} tokens`);
      } else {
        withoutTokens++;
        accountsWithoutTokens.push(account);
        console.log(`✗ Account ${account.label}: 0 tokens - ${account.address}`);
      }
    } catch (error) {
      console.error(`Error checking ${account.label}:`, error.message);
    }
  }
  
  console.log("\n" + "=".repeat(60));
  console.log(`Summary:`);
  console.log(`Total accounts: ${allAccounts.length}`);
  console.log(`With tokens: ${withTokens}`);
  console.log(`Without tokens: ${withoutTokens}`);
  
  if (accountsWithoutTokens.length > 0) {
    console.log(`\nAccounts still needing tokens (${accountsWithoutTokens.length}):`);
    accountsWithoutTokens.forEach(acc => {
      console.log(`  - Account ${acc.label}: ${acc.address}`);
    });
  } else {
    console.log("\n✓ All accounts have been minted tokens!");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
