import hre from "hardhat";
import fs from "fs";

const TOKEN_ADDRESS = "0x9a0bF6f79dea39D66D0E8F01B1ABf32725C7F86f";

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomAmount(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  console.log("Simulating token interactions with 50 topped-up accounts...\n");
  
  const allAccounts = JSON.parse(fs.readFileSync("generated-accounts.json", "utf8"));
  
  // Use only first 50 accounts (the ones we topped up)
  const accounts = allAccounts.slice(0, 50);
  
  console.log(`Using accounts #1 to #50 for simulation\n`);
  
  const CeloToken = await hre.ethers.getContractFactory("CeloToken");
  const token = CeloToken.attach(TOKEN_ADDRESS);
  
  let txCount = 0;
  const totalTransactions = 100; // 100 transactions across 50 accounts
  
  console.log(`Creating ${totalTransactions} transactions...\n`);
  
  for (let i = 0; i < totalTransactions; i++) {
    try {
      const randomAction = Math.random();
      
      // 80% transfers, 20% approvals
      if (randomAction < 0.8) {
        // TRANSFER: Random account sends tokens to another random account
        const sender = getRandom(accounts);
        const receiver = getRandom(accounts.filter(a => a.address !== sender.address));
        const amount = getRandomAmount(1, 3); // Transfer 1-3 tokens
        
        const senderWallet = new hre.ethers.Wallet(sender.privateKey, hre.ethers.provider);
        const tokenWithSigner = token.connect(senderWallet);
        
        const tx = await tokenWithSigner.transfer(
          receiver.address, 
          hre.ethers.parseEther(amount.toString())
        );
        await tx.wait();
        
        txCount++;
        console.log(`[${txCount}/${totalTransactions}] Transfer: Account #${sender.index} → Account #${receiver.index} (${amount} tokens) - TX: ${tx.hash.slice(0, 10)}...`);
        
      } else {
        // APPROVE: Random account approves another account to spend tokens
        const owner = getRandom(accounts);
        const spender = getRandom(accounts.filter(a => a.address !== owner.address));
        const amount = getRandomAmount(1, 5);
        
        const ownerWallet = new hre.ethers.Wallet(owner.privateKey, hre.ethers.provider);
        const tokenWithSigner = token.connect(ownerWallet);
        
        const tx = await tokenWithSigner.approve(
          spender.address, 
          hre.ethers.parseEther(amount.toString())
        );
        await tx.wait();
        
        txCount++;
        console.log(`[${txCount}/${totalTransactions}] Approve: Account #${owner.index} approved Account #${spender.index} (${amount} tokens) - TX: ${tx.hash.slice(0, 10)}...`);
      }
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 150));
      
    } catch (error) {
      if (error.message.includes("insufficient funds")) {
        console.log(`[${i + 1}] ✗ Skipped - account out of CELO`);
      } else if (error.message.includes("ERC20InsufficientBalance")) {
        console.log(`[${i + 1}] ✗ Skipped - account out of tokens`);
      } else {
        console.error(`[${i + 1}] Error:`, error.message);
      }
    }
  }
  
  console.log(`\n✓ Simulation complete! Created ${txCount} transactions.`);
  console.log(`\nYou can view these transactions on Celoscan:`);
  console.log(`https://celoscan.io/token/${TOKEN_ADDRESS}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
