import hre from "hardhat";
import fs from "fs";

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  
  console.log("Final CELO distribution...");
  console.log("Main account:", deployer.address);
  console.log("Main account balance:", hre.ethers.formatEther(await hre.ethers.provider.getBalance(deployer.address)), "CELO");
  
  // Load accounts from file
  const accounts = JSON.parse(fs.readFileSync("generated-accounts.json", "utf8"));
  
  // Remaining accounts: 71-100 (indices 70-99)
  const accountsToFund = accounts.slice(70);
  
  console.log(`\nSending 0.01 CELO to final ${accountsToFund.length} accounts...\n`);
  const amountToSend = hre.ethers.parseEther("0.01");
  
  let successCount = 0;
  let failCount = 0;
  
  for (let i = 0; i < accountsToFund.length; i++) {
    const account = accountsToFund[i];
    
    try {
      const tx = await deployer.sendTransaction({
        to: account.address,
        value: amountToSend,
        gasLimit: 21000
      });
      
      await tx.wait();
      successCount++;
      
      console.log(`[${i + 1}/${accountsToFund.length}] ✓ Sent to ${account.address} (Account #${account.index})`);
    } catch (error) {
      failCount++;
      console.error(`[${i + 1}/${accountsToFund.length}] ✗ Failed ${account.address} (Account #${account.index}):`, error.message);
    }
    
    // Delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  console.log(`\n✓ All done!`);
  console.log(`Success: ${successCount}, Failed: ${failCount}`);
  console.log(`Total accounts funded: ${46 + 25 + successCount}/100`);
  
  const finalBalance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Final balance:", hre.ethers.formatEther(finalBalance), "CELO");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
