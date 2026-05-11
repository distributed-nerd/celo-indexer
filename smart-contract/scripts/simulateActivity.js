import hre from "hardhat";
import fs from "fs";

const TOKEN_ADDRESS = "0x9a0bF6f79dea39D66D0E8F01B1ABf32725C7F86f";

// Helper to get random element from array
function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Helper to get random amount between min and max
function getRandomAmount(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  console.log("Simulating token contract interactions...\n");
  
  const accounts = JSON.parse(fs.readFileSync("generated-accounts.json", "utf8"));
  const CeloToken = await hre.ethers.getContractFactory("CeloToken");
  const token = CeloToken.attach(TOKEN_ADDRESS);
  
  let txCount = 0;
  const totalTransactions = 200; // Total number of transactions to simulate
  
  console.log(`Creating ${totalTransactions} transactions across 100 accounts...\n`);
  
  for (let i = 0; i < totalTransactions; i++) {
    try {
      const randomAction = Math.random();
      
      // 70% transfers, 20% approvals, 10% burns
      if (randomAction < 0.7) {
        // TRANSFER: Random account sends tokens to another random account
        const sender = getRandom(accounts);
        const receiver = getRandom(accounts.filter(a => a.address !== sender.address));
        const amount = getRandomAmount(1, 5); // Transfer 1-5 tokens
        
        const senderWallet = new hre.ethers.Wallet(sender.privateKey, hre.ethers.provider);
        const tokenWithSigner = token.connect(senderWallet);
        
        const tx = await tokenWithSigner.transfer(receiver.address, hre.ethers.parseEther(amount.toString()), {
          gasLimit: 50000  // Reduced gas limit
        });
        await tx.wait();
        
        txCount++;
        console.log(`[${txCount}/${totalTransactions}] Transfer: Account #${sender.index} → Account #${receiver.index} (${amount} tokens)`);
        
      } else if (randomAction < 0.9) {
        // APPROVE: Random account approves another account to spend tokens
        const owner = getRandom(accounts);
        const spender = getRandom(accounts.filter(a => a.address !== owner.address));
        const amount = getRandomAmount(1, 10);
        
        const ownerWallet = new hre.ethers.Wallet(owner.privateKey, hre.ethers.provider);
        const tokenWithSigner = token.connect(ownerWallet);
        
        const tx = await tokenWithSigner.approve(spender.address, hre.ethers.parseEther(amount.toString()), {
          gasLimit: 50000  // Reduced gas limit
        });
        await tx.wait();
        
        txCount++;
        console.log(`[${txCount}/${totalTransactions}] Approve: Account #${owner.index} approved Account #${spender.index} (${amount} tokens)`);
        
      } else {
        // BURN: Random account burns some tokens
        const burner = getRandom(accounts);
        const amount = getRandomAmount(1, 2); // Burn 1-2 tokens
        
        const burnerWallet = new hre.ethers.Wallet(burner.privateKey, hre.ethers.provider);
        const tokenWithSigner = token.connect(burnerWallet);
        
        const tx = await tokenWithSigner.burn(hre.ethers.parseEther(amount.toString()), {
          gasLimit: 50000  // Reduced gas limit
        });
        await tx.wait();
        
        txCount++;
        console.log(`[${txCount}/${totalTransactions}] Burn: Account #${burner.index} burned ${amount} tokens`);
      }
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error(`Error on transaction ${i + 1}:`, error.message);
    }
  }
  
  console.log(`\n✓ Simulation complete! Created ${txCount} transactions.`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
