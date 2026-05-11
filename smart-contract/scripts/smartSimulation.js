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
  console.log("Smart simulation - checking balances first...\n");
  
  const accounts = JSON.parse(fs.readFileSync("generated-accounts.json", "utf8"));
  const CeloToken = await hre.ethers.getContractFactory("CeloToken");
  const token = CeloToken.attach(TOKEN_ADDRESS);
  
  // Check which accounts have enough CELO (at least 0.005 CELO)
  const minBalance = hre.ethers.parseEther("0.005");
  const eligibleAccounts = [];
  
  console.log("Checking account balances...");
  for (const account of accounts) {
    const balance = await hre.ethers.provider.getBalance(account.address);
    if (balance >= minBalance) {
      eligibleAccounts.push(account);
    }
  }
  
  console.log(`Found ${eligibleAccounts.length} accounts with sufficient CELO\n`);
  
  if (eligibleAccounts.length < 10) {
    console.log("Not enough accounts with CELO. Please run topUpAccounts.js first.");
    return;
  }
  
  let txCount = 0;
  const maxTransactions = Math.min(100, eligibleAccounts.length * 2); // Limit transactions
  
  console.log(`Creating up to ${maxTransactions} transactions...\n`);
  
  for (let i = 0; i < maxTransactions; i++) {
    try {
      const randomAction = Math.random();
      
      if (randomAction < 0.8) {
        // TRANSFER
        const sender = getRandom(eligibleAccounts);
        const receiver = getRandom(accounts.filter(a => a.address !== sender.address));
        const amount = getRandomAmount(1, 3);
        
        const senderWallet = new hre.ethers.Wallet(sender.privateKey, hre.ethers.provider);
        const tokenWithSigner = token.connect(senderWallet);
        
        const tx = await tokenWithSigner.transfer(receiver.address, hre.ethers.parseEther(amount.toString()));
        await tx.wait();
        
        txCount++;
        console.log(`[${txCount}] Transfer: #${sender.index} → #${receiver.index} (${amount} tokens)`);
        
      } else {
        // APPROVE
        const owner = getRandom(eligibleAccounts);
        const spender = getRandom(accounts.filter(a => a.address !== owner.address));
        const amount = getRandomAmount(1, 5);
        
        const ownerWallet = new hre.ethers.Wallet(owner.privateKey, hre.ethers.provider);
        const tokenWithSigner = token.connect(ownerWallet);
        
        const tx = await tokenWithSigner.approve(spender.address, hre.ethers.parseEther(amount.toString()));
        await tx.wait();
        
        txCount++;
        console.log(`[${txCount}] Approve: #${owner.index} approved #${spender.index} (${amount} tokens)`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 200));
      
    } catch (error) {
      if (error.message.includes("insufficient funds")) {
        console.log(`Skipping - account out of CELO`);
      } else {
        console.error(`Error:`, error.message);
      }
    }
  }
  
  console.log(`\n✓ Created ${txCount} transactions successfully!`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
