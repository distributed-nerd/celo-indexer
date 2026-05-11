import hre from "hardhat";
import fs from "fs";

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  
  console.log("Topping up accounts with more CELO for gas...");
  console.log("Main account balance:", hre.ethers.formatEther(await hre.ethers.provider.getBalance(deployer.address)), "CELO\n");
  
  const accounts = JSON.parse(fs.readFileSync("generated-accounts.json", "utf8"));
  
  // Only top up first 50 accounts
  const accountsToTopUp = accounts.slice(0, 50);
  
  // Send 0.05 CELO to each account (enough for ~2 transactions at current gas prices)
  const amountToSend = hre.ethers.parseEther("0.05");
  
  console.log(`Sending 0.05 CELO to ${accountsToTopUp.length} accounts...\n`);
  
  let successCount = 0;
  
  for (let i = 0; i < accountsToTopUp.length; i++) {
    const account = accountsToTopUp[i];
    
    try {
      const tx = await deployer.sendTransaction({
        to: account.address,
        value: amountToSend,
        gasLimit: 21000
      });
      
      await tx.wait();
      successCount++;
      
      console.log(`[${i + 1}/${accountsToTopUp.length}] ✓ Sent 0.05 CELO to Account #${account.index}`);
    } catch (error) {
      console.error(`[${i + 1}/${accountsToTopUp.length}] ✗ Failed Account #${account.index}:`, error.message);
    }
    
    // Delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log(`\n✓ Completed! Topped up ${successCount}/${accountsToTopUp.length} accounts`);
  
  const finalBalance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Final main account balance:", hre.ethers.formatEther(finalBalance), "CELO");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
