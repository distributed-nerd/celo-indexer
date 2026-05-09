import hre from "hardhat";
import fs from "fs";

const TOKEN_ADDRESS = "0x9a0bF6f79dea39D66D0E8F01B1ABf32725C7F86f";
// Target gas cost per transaction
const TARGET_GAS_COST = hre.ethers.parseEther("0.04"); // 0.04 CELO per tx

// Get random element from array
function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Generate random amount between min and max
function getRandomAmount(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  console.log("Starting interactions for all 100 accounts...\n");
  console.log("Target gas cost per transaction: 0.04 CELO\n");
  
  // Load all generated accounts
  // Load all generated accounts
  const accounts = JSON.parse(fs.readFileSync("generated-accounts.json", "utf8"));
  // Get contract factory and attach to deployed instance
  // Get contract factory and attach to deployed instance
  const CeloToken = await hre.ethers.getContractFactory("CeloToken");
  const token = CeloToken.attach(TOKEN_ADDRESS);
  
  // Fetch current network fee data
  // Get current gas price
  // Fetch current network fee data
  const feeData = await hre.ethers.provider.getFeeData();
  const gasPrice = feeData.gasPrice;
  
  // Calculate optimal gas limit for target cost
  // Calculate gas limit to achieve ~0.04 CELO cost
  // gasLimit = targetCost / gasPrice
  // Calculate optimal gas limit for target cost
  // Formula: gasLimit = targetCost / gasPrice
  const calculatedGasLimit = TARGET_GAS_COST / gasPrice;
  const gasLimit = BigInt(Math.floor(Number(calculatedGasLimit)));
  
  console.log(`Current gas price: ${hre.ethers.formatUnits(gasPrice, "gwei")} Gwei`);
  console.log(`Calculated gas limit: ${gasLimit.toString()}`);
  console.log(`Expected cost per tx: ~${hre.ethers.formatEther(gasPrice * gasLimit)} CELO\n`);
  
  // Initialize counters for tracking results
  // Initialize counters for tracking results
  let successCount = 0;
  let failCount = 0;
  const totalAccounts = accounts.length;
  
  // Process each account sequentially
  // Process each account sequentially
  // Each account performs one transaction
  for (let i = 0; i < totalAccounts; i++) {
    const account = accounts[i];
    
    try {
      // Validate account has sufficient balance
      // Validate account has sufficient balance
      // Check account balance
      const balance = await hre.ethers.provider.getBalance(account.address);
      const tokenBalance = await token.balanceOf(account.address);
      
      // Skip if insufficient CELO for gas
      // Skip if insufficient CELO for gas
      if (balance < TARGET_GAS_COST) {
        console.log(`[${i + 1}/${totalAccounts}] Account #${account.index} - Insufficient CELO (has ${hre.ethers.formatEther(balance)})`);
        failCount++;
        continue;
      }
      
      const wallet = new hre.ethers.Wallet(account.privateKey, hre.ethers.provider);
      const tokenWithSigner = token.connect(wallet);
      
      // Decide action based on token balance
      const randomAction = Math.random();
      
      if (tokenBalance > 0n && randomAction < 0.7) {
        // TRANSFER: Send tokens to another random account
        const receiver = getRandom(accounts.filter(a => a.address !== account.address));
        const maxTransfer = Number(hre.ethers.formatEther(tokenBalance));
        const amount = Math.min(getRandomAmount(1, 5), Math.floor(maxTransfer));
        
        if (amount > 0) {
          const tx = await tokenWithSigner.transfer(
            receiver.address,
            hre.ethers.parseEther(amount.toString()),
            {
              gasLimit: gasLimit,
              gasPrice: gasPrice
            }
          );
          const receipt = await tx.wait();
          const actualCost = receipt.gasUsed * receipt.gasPrice;
          
          successCount++;
          console.log(`[${successCount}/${totalAccounts}] Account #${account.index} → #${receiver.index}: ${amount} tokens | Gas: ${hre.ethers.formatEther(actualCost)} CELO`);
        } else {
          failCount++;
          console.log(`[${i + 1}/${totalAccounts}] Account #${account.index} - No tokens to transfer`);
        }
        
      } else if (randomAction < 0.9) {
        // APPROVE: Approve another account
        const spender = getRandom(accounts.filter(a => a.address !== account.address));
        const amount = getRandomAmount(5, 20);
        
        const tx = await tokenWithSigner.approve(
          spender.address,
          hre.ethers.parseEther(amount.toString()),
          {
            gasLimit: gasLimit,
            gasPrice: gasPrice
          }
        );
        const receipt = await tx.wait();
        const actualCost = receipt.gasUsed * receipt.gasPrice;
        
        successCount++;
        console.log(`[${successCount}/${totalAccounts}] Account #${account.index} approved #${spender.index}: ${amount} tokens | Gas: ${hre.ethers.formatEther(actualCost)} CELO`);
        
      } else {
        // CHECK BALANCE: Just query (no gas cost, but shows activity)
        const allowance = await token.allowance(account.address, accounts[0].address);
        console.log(`[${i + 1}/${totalAccounts}] Account #${account.index} - Balance check: ${hre.ethers.formatEther(tokenBalance)} tokens`);
        successCount++;
      }
      
      // Small delay to avoid overwhelming the network
      await new Promise(resolve => setTimeout(resolve, 150));
      
    } catch (error) {
      failCount++;
      console.error(`[${i + 1}/${totalAccounts}] Account #${account.index} - Error: ${error.message.substring(0, 100)}`);
    }
  }
  
  console.log(`\n${"=".repeat(60)}`);
  console.log(`✓ Interaction complete!`);
  console.log(`  Successful: ${successCount}/${totalAccounts}`);
  console.log(`  Failed: ${failCount}/${totalAccounts}`);
  console.log(`${"=".repeat(60)}\n`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
