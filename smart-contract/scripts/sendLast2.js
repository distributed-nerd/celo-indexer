import hre from "hardhat";

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  
  const accounts = [
    { index: 99, address: "0xC14AEa4A9F8e20BDa93edb7E53C390e06eEd73d3" },
    { index: 100, address: "0xB8D94b10A1e9F870503Ab5A4CDAc58A96c426Bc8" }
  ];
  
  const amountToSend = hre.ethers.parseEther("0.01");
  
  for (const account of accounts) {
    const tx = await deployer.sendTransaction({
      to: account.address,
      value: amountToSend,
      gasLimit: 21000
    });
    
    await tx.wait();
    console.log(`✓ Sent 0.01 CELO to Account #${account.index}: ${account.address}`);
  }
  
  console.log("\n✓ All 100 accounts funded!");
  const finalBalance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Final balance:", hre.ethers.formatEther(finalBalance), "CELO");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
