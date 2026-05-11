/**
 * simulateOnchain.js
 *
 * Runs simulated on-chain transactions using ALL accounts from
 * generated-accounts.json that have ≥ 0.02 native CELO for gas.
 *
 * Run:  npx hardhat run scripts/simulateOnchain.js --network celo
 *
 * Transaction mix (configurable at top):
 *   60% transfers between random accounts
 *   20% approve + transferFrom pairs
 *   10% burns
 *   10% owner mints to random accounts
 */

import hre from "hardhat";
import fs from "fs";

const { ethers } = hre;

// ── Config ────────────────────────────────────────────────────────────────────
const TOKEN_ADDRESS    = "0x9a0bF6f79dea39D66D0E8F01B1ABf32725C7F86f";
const MIN_CELO_FOR_GAS = ethers.parseEther("0.02"); // all 100 accounts qualify
const TOTAL_TXS        = 50;                         // number of transactions to run

const TOKEN_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  "function burn(uint256 amount)",
  "function mint(address to, uint256 amount)",
  "function owner() view returns (address)",
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt   = (wei) => parseFloat(ethers.formatEther(wei)).toFixed(4);
const parse = (n)   => ethers.parseEther(n.toString());

const rand       = (arr)      => arr[Math.floor(Math.random() * arr.length)];
const randInt    = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const fmtCost    = (receipt)  => {
  const price = receipt.gasPrice ?? 0n;
  return `${ethers.formatEther(receipt.gasUsed * price)} CELO  (gas: ${receipt.gasUsed.toLocaleString()})`;
};

async function printSummary(label, token, wallets) {
  console.log(`\n═══════════════════════════════════════════════════════════`);
  console.log(` ${label}`);
  console.log(`═══════════════════════════════════════════════════════════`);
  const supply = await token.totalSupply();
  console.log(`  Total token supply: ${fmt(supply)} CELO`);
  // Print first 10 + last 5 to keep output manageable
  const sample = [...wallets.slice(0, 10), ...wallets.slice(-5)];
  console.log(`\n  Sample balances:`);
  for (const { name, wallet } of sample) {
    const bal = await token.balanceOf(wallet.address);
    console.log(`    ${name.padEnd(12)} ${wallet.address}  →  ${fmt(bal)} CELO`);
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  CeloToken On-Chain Simulation  —  All Accounts  —  Celo Mainnet");
  console.log("  Contract : " + TOKEN_ADDRESS);
  console.log(`  Transactions to run: ${TOTAL_TXS}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  const provider = ethers.provider;

  // ── 1. Load & filter accounts ─────────────────────────────────────────────
  const allAccounts = JSON.parse(fs.readFileSync("generated-accounts.json", "utf8"));
  console.log(`→ Scanning ${allAccounts.length} accounts for native CELO (≥ 0.02)…`);

  const eligible = [];
  for (const acc of allAccounts) {
    const bal = await provider.getBalance(acc.address);
    if (bal >= MIN_CELO_FOR_GAS) {
      eligible.push({
        index:   acc.index,
        name:    `Account #${acc.index}`,
        wallet:  new ethers.Wallet(acc.privateKey, provider),
        nativeBal: bal,
      });
    }
  }
  console.log(`  ✓ ${eligible.length} eligible accounts found\n`);

  // ── 2. Owner wallet ───────────────────────────────────────────────────────
  const ownerPrivKey = process.env.PRIVATE_KEY;
  if (!ownerPrivKey) throw new Error("PRIVATE_KEY not set in .env");
  const ownerWallet = new ethers.Wallet(ownerPrivKey, provider);
  const ownerNative = await provider.getBalance(ownerWallet.address);
  console.log(`  Owner: ${ownerWallet.address}  (${fmt(ownerNative)} CELO)`);

  // ── 3. Attach to CeloToken ────────────────────────────────────────────────
  const token  = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, ownerWallet);
  const name_  = await token.name();
  const symbol = await token.symbol();
  console.log(`  Token: ${name_} (${symbol})  at ${TOKEN_ADDRESS}`);

  const ownerEntry = { name: "Owner", wallet: ownerWallet };
  await printSummary("State BEFORE simulation", token, eligible);

  // ── 4. Run transactions ───────────────────────────────────────────────────
  console.log(`\n→ Executing ${TOTAL_TXS} transactions…\n`);
  const DIVIDER = "  " + "─".repeat(78);
  let txIndex   = 0;
  let totalFees = 0n;
  let errors    = 0;

  const exec = async (label, txPromise) => {
    try {
      const tx      = await txPromise;
      const receipt = await tx.wait();
      const price   = receipt.gasPrice ?? 0n;
      totalFees    += receipt.gasUsed * price;
      console.log(`  [TX ${String(++txIndex).padStart(2)}/${TOTAL_TXS}] ${label}`);
      console.log(`           hash: ${tx.hash}  fee: ${fmtCost(receipt)}`);
      console.log(DIVIDER);
    } catch (err) {
      errors++;
      console.log(`  [TX ERR] ${label}`);
      console.log(`           ${err.message.split("\n")[0]}`);
      console.log(DIVIDER);
    }
  };

  let completedTxs = 0;
  while (completedTxs < TOTAL_TXS) {
    const roll = Math.random();

    if (roll < 0.60) {
      // ── Transfer between two random accounts ─────────────────────────────
      const sender   = rand(eligible);
      const receiver = rand(eligible.filter(a => a.index !== sender.index));
      const senderBal = await token.balanceOf(sender.wallet.address);
      if (senderBal < parse(1)) { completedTxs++; continue; }
      const amount = randInt(1, Math.min(5, parseInt(ethers.formatEther(senderBal))));
      await exec(
        `Transfer  : ${sender.name} → ${receiver.name}  | ${amount} CELO`,
        token.connect(sender.wallet).transfer(receiver.wallet.address, parse(amount))
      );

    } else if (roll < 0.80) {
      // ── Approve + TransferFrom ────────────────────────────────────────────
      const approver  = rand(eligible);
      const spender   = rand(eligible.filter(a => a.index !== approver.index));
      const receiver  = rand(eligible.filter(a => a.index !== approver.index && a.index !== spender.index));
      const approverBal = await token.balanceOf(approver.wallet.address);
      if (approverBal < parse(2)) { completedTxs++; continue; }
      const amount = randInt(1, Math.min(3, parseInt(ethers.formatEther(approverBal))));

      // approve
      await exec(
        `Approve   : ${approver.name} → ${spender.name}  | ${amount} CELO`,
        token.connect(approver.wallet).approve(spender.wallet.address, parse(amount))
      );
      completedTxs++;
      if (completedTxs >= TOTAL_TXS) break;

      // transferFrom
      await exec(
        `TransferFrom: ${spender.name} pulls ${amount} CELO  ${approver.name} → ${receiver.name}`,
        token.connect(spender.wallet).transferFrom(
          approver.wallet.address, receiver.wallet.address, parse(amount)
        )
      );

    } else if (roll < 0.90) {
      // ── Burn ──────────────────────────────────────────────────────────────
      const burner    = rand(eligible);
      const burnerBal = await token.balanceOf(burner.wallet.address);
      if (burnerBal < parse(1)) { completedTxs++; continue; }
      const amount = 1;
      await exec(
        `Burn      : ${burner.name} burns  | ${amount} CELO`,
        token.connect(burner.wallet).burn(parse(amount))
      );

    } else {
      // ── Owner mint ────────────────────────────────────────────────────────
      const receiver = rand(eligible);
      const amount   = randInt(1, 5);
      await exec(
        `Mint      : Owner → ${receiver.name}  | ${amount} CELO`,
        token.mint(receiver.wallet.address, amount)
      );
    }

    completedTxs++;
  }

  // ── 5. Final state ────────────────────────────────────────────────────────
  await printSummary("State AFTER simulation", token, eligible);

  const totalSupply = await token.totalSupply();
  console.log(`\n  Total token supply : ${fmt(totalSupply)} CELO`);
  console.log(`  Transactions run   : ${txIndex} succeeded, ${errors} failed`);
  console.log(`  Total gas fees paid: ${ethers.formatEther(totalFees)} CELO`);
  console.log(`\n✓ Simulation complete.\n`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => { console.error(err); process.exit(1); });
