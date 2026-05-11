import hre from "hardhat";
import fs from "fs";

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  
  console.log("Generating 100 EOA accounts...");
  console.log("Main account:", deployer.address);
  console.log("Main account balance:", hre.ethers.formatEther(await hre.ethers.provider.getBalance(deployer.address)), "CELO");
  
  const accounts = [];
  
  // Generate 100 random wallets
  for (let i = 0; i < 100; i++) {
    const wallet = hre.ethers.Wallet.createRandom();
    accounts.push({
      index: i + 1,
      address: wallet.address,
      privateKey: wallet.privateKey
    });
  }
  
  console.log("\n✓ Generated 100 accounts");
  
  // Save accounts to file
  fs.writeFileSync(
    "generated-accounts.json",
    JSON.stringify(accounts, null, 2)
  );
  console.log("✓ Saved accounts to generated-accounts.json");
  
  // Send 0.01 CELO to each account
  console.log("\nSending 0.01 CELO to each account...");
  const amountToSend = hre.ethers.parseEther("0.01");
  
  for (let i = 0; i < accounts.length; i++) {
    const account = accounts[i];
    
    try {
      const tx = await deployer.sendTransaction({
        to: account.address,
        value: amountToSend,
        gasLimit: 21000
      });
      
      await tx.wait();
      
      console.log(`[${i + 1}/100] Sent 0.01 CELO to ${account.address} - TX: ${tx.hash}`);
    } catch (error) {
      console.error(`[${i + 1}/100] Failed to send to ${account.address}:`, error.message);
    }
  }
  
  console.log("\n✓ Completed sending CELO to all accounts");
  
  const finalBalance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Final main account balance:", hre.ethers.formatEther(finalBalance), "CELO");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
