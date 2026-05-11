import hre from "hardhat";
import fs from "fs";

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  
  console.log("Resuming CELO distribution...");
  console.log("Main account:", deployer.address);
  console.log("Main account balance:", hre.ethers.formatEther(await hre.ethers.provider.getBalance(deployer.address)), "CELO");
  
  // Load accounts from file
  const accounts = JSON.parse(fs.readFileSync("generated-accounts.json", "utf8"));
  console.log(`Loaded ${accounts.length} accounts from file`);
  
  // Accounts that need funding (21 failed, 47-100 not sent yet)
  const accountsToFund = [
    accounts[20], // index 21 that failed
    ...accounts.slice(46) // index 47-100
  ];
  
  console.log(`\nSending 0.01 CELO to ${accountsToFund.length} remaining accounts...\n`);
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
      
      console.log(`[${i + 1}/${accountsToFund.length}] ✓ Sent 0.01 CELO to ${account.address} (Account #${account.index})`);
    } catch (error) {
      failCount++;
      console.error(`[${i + 1}/${accountsToFund.length}] ✗ Failed to send to ${account.address} (Account #${account.index}):`, error.message);
    }
    
    // Small delay to avoid rate limiting
    if (i < accountsToFund.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  console.log(`\n✓ Completed!`);
  console.log(`Success: ${successCount}, Failed: ${failCount}`);
  
  const finalBalance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Final main account balance:", hre.ethers.formatEther(finalBalance), "CELO");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
