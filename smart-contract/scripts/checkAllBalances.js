/**
 * checkAllBalances.js
 * Run: npx hardhat run scripts/checkAllBalances.js --network celo
 *
 * Prints the native CELO balance and CeloToken balance for every account
 * in generated-accounts.json, then summarises how many have funds.
 */

import hre from "hardhat";
import fs from "fs";

const { ethers } = hre;

const TOKEN_ADDRESS = "0x9a0bF6f79dea39D66D0E8F01B1ABf32725C7F86f";
const TOKEN_ABI = [
  "function balanceOf(address) view returns (uint256)",
];

async function main() {
  const provider = ethers.provider;
  const token    = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, provider);
  const accounts = JSON.parse(fs.readFileSync("generated-accounts.json", "utf8"));

  console.log(`Checking ${accounts.length} accounts on Celo mainnet…\n`);
  console.log(
    `  ${"#".padEnd(5)} ${"Address".padEnd(44)} ${"Native CELO".padEnd(18)} Token CELO`
  );
  console.log("  " + "─".repeat(85));

  let fundedNative = 0;
  let fundedToken  = 0;

  for (const acc of accounts) {
    const native = await provider.getBalance(acc.address);
    const token_ = await token.balanceOf(acc.address);

    const hasNative = native > 0n;
    const hasToken  = token_ > 0n;
    if (hasNative) fundedNative++;
    if (hasToken)  fundedToken++;

    // Only print accounts that have something
    if (hasNative || hasToken) {
      const nativeFmt = parseFloat(ethers.formatEther(native)).toFixed(6);
      const tokenFmt  = parseFloat(ethers.formatEther(token_)).toFixed(6);
      console.log(
        `  ${String(acc.index).padEnd(5)} ${acc.address}  ${nativeFmt.padEnd(18)} ${tokenFmt}`
      );
    }
  }

  console.log("\n" + "─".repeat(90));
  console.log(`  Accounts with native CELO : ${fundedNative} / ${accounts.length}`);
  console.log(`  Accounts with token CELO  : ${fundedToken} / ${accounts.length}`);
  console.log(`  Accounts with nothing     : ${accounts.length - Math.max(fundedNative, fundedToken)} / ${accounts.length}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => { console.error(err); process.exit(1); });
