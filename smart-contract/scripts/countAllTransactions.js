import hre from "hardhat";

const TOKEN_ADDRESS = "0x9a0bF6f79dea39D66D0E8F01B1ABf32725C7F86f";

async function main() {
  console.log("Counting all transactions on the token contract...\n");
  console.log("Token Address:", TOKEN_ADDRESS);
  
  const CeloToken = await hre.ethers.getContractFactory("CeloToken");
  const token = CeloToken.attach(TOKEN_ADDRESS);
  
  // Get the deployment block (approximate - we deployed recently)
  const currentBlock = await hre.ethers.provider.getBlockNumber();
  const fromBlock = currentBlock - 100; // Look back only 100 blocks (within free tier limit)
  
  console.log(`Scanning from block ${fromBlock} to ${currentBlock}...\n`);
  
  // Get all Transfer events (includes mints and burns)
  const transferFilter = token.filters.Transfer();
  const transferEvents = await token.queryFilter(transferFilter, fromBlock, currentBlock);
  
  // Get all Approval events
  const approvalFilter = token.filters.Approval();
  const approvalEvents = await token.queryFilter(approvalFilter, fromBlock, currentBlock);
  
  // Categorize transfers
  let mints = 0;
  let burns = 0;
  let transfers = 0;
  
  for (const event of transferEvents) {
    const from = event.args[0];
    const to = event.args[1];
    
    if (from === "0x0000000000000000000000000000000000000000") {
      mints++;
    } else if (to === "0x0000000000000000000000000000000000000000") {
      burns++;
    } else {
      transfers++;
    }
  }
  
  console.log("=".repeat(60));
  console.log("Transaction Summary:");
  console.log("=".repeat(60));
  console.log(`Mints:          ${mints} transactions`);
  console.log(`Burns:          ${burns} transactions`);
  console.log(`Transfers:      ${transfers} transactions`);
  console.log(`Approvals:      ${approvalEvents.length} transactions`);
  console.log("-".repeat(60));
  console.log(`Total Events:   ${transferEvents.length + approvalEvents.length} events`);
  console.log(`Total Transfer Events: ${transferEvents.length} (mints + burns + transfers)`);
  console.log("=".repeat(60));
  
  // Get token stats
  const totalSupply = await token.totalSupply();
  console.log(`\nCurrent Total Supply: ${hre.ethers.formatEther(totalSupply)} tokens`);
  
  console.log(`\nView all transactions on Celoscan:`);
  console.log(`https://celoscan.io/token/${TOKEN_ADDRESS}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
