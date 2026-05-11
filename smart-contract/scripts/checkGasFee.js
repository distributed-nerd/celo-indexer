import hre from "hardhat";

async function main() {
  console.log("Checking Celo network gas fees...\n");
  
  // Get latest block
  const block = await hre.ethers.provider.getBlock("latest");
  
  console.log("Latest Block:", block.number);
  console.log("Base Fee Per Gas:", hre.ethers.formatUnits(block.baseFeePerGas, "gwei"), "gwei");
  console.log("Base Fee Per Gas:", hre.ethers.formatEther(block.baseFeePerGas), "CELO");
  
  // Get fee data
  const feeData = await hre.ethers.provider.getFeeData();
  
  console.log("\nCurrent Fee Data:");
  console.log("Max Fee Per Gas:", hre.ethers.formatUnits(feeData.maxFeePerGas, "gwei"), "gwei");
  console.log("Max Priority Fee:", hre.ethers.formatUnits(feeData.maxPriorityFeePerGas, "gwei"), "gwei");
  
  // Calculate cost for a typical ERC20 transfer (uses ~65,000 gas)
  const gasUsed = 65000n;
  const totalCost = feeData.maxFeePerGas * gasUsed;
  
  console.log("\nEstimated cost for ERC20 transfer:");
  console.log("Gas used: ~65,000");
  console.log("Total cost:", hre.ethers.formatEther(totalCost), "CELO");
  
  // Calculate how many transactions 0.01 CELO can afford
  const budget = hre.ethers.parseEther("0.01");
  const txCount = budget / totalCost;
  
  console.log("\nWith 0.01 CELO, you can afford:", Number(txCount).toFixed(2), "transactions");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
