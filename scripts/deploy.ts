import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  Eterna Token (ETN) Deployment Script");
  console.log("  CodeGrin Technologies");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  const initialSupply = process.env.INITIAL_SUPPLY || "1000000";
  const [deployer] = await ethers.getSigners();

  const network = await ethers.provider.getNetwork();
  const balance = await ethers.provider.getBalance(deployer.address);

  console.log("📋 Deployment Configuration:");
  console.log("─────────────────────────────────────────────────────────────");
  console.log(`  Network:          ${network.name} (Chain ID: ${network.chainId})`);
  console.log(`  Deployer:         ${deployer.address}`);
  console.log(`  Balance:          ${ethers.formatEther(balance)} BNB`);
  console.log(`  Initial Supply:   ${initialSupply} ETN`);
  console.log("─────────────────────────────────────────────────────────────\n");

  if (balance === 0n) {
    console.error("❌ Error: Deployer account has zero balance!");
    console.error("   Please fund your account with BNB before deploying.\n");

    if (network.chainId === 97n) {
      console.log("💡 Get BSC Testnet BNB from:");
      console.log("   https://testnet.bnbchain.org/faucet-smart\n");
    }

    process.exit(1);
  }

  console.log("🚀 Deploying Eterna Token Contract...\n");

  const EternaFactory = await ethers.getContractFactory("Eterna");
  const eterna = await EternaFactory.deploy(initialSupply);

  await eterna.waitForDeployment();
  const eternaAddress = await eterna.getAddress();

  console.log("✅ Deployment Successful!\n");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  Contract Information");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`  Contract Address: ${eternaAddress}`);
  console.log(`  Token Name:       ${await eterna.name()}`);
  console.log(`  Token Symbol:     ${await eterna.symbol()}`);
  console.log(`  Decimals:         ${await eterna.decimals()}`);
  console.log(`  Total Supply:     ${ethers.formatEther(await eterna.totalSupply())} ETN`);
  console.log(`  Owner:            ${await eterna.owner()}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  let explorerUrl = "";
  let explorerName = "";

  if (network.chainId === 97n) {
    explorerUrl = `https://testnet.bscscan.com/address/${eternaAddress}`;
    explorerName = "BSCScan Testnet";
  } else if (network.chainId === 56n) {
    explorerUrl = `https://bscscan.com/address/${eternaAddress}`;
    explorerName = "BSCScan";
  } else if (network.chainId === 1337n || network.chainId === 31337n) {
    explorerUrl = "Local Network (No Explorer)";
    explorerName = "Hardhat";
  }

  if (explorerUrl && explorerName !== "Hardhat") {
    console.log("🔗 Explorer Links:");
    console.log("─────────────────────────────────────────────────────────────");
    console.log(`  ${explorerName}: ${explorerUrl}\n`);
  }

  if (network.chainId === 97n || network.chainId === 56n) {
    console.log("📝 Contract Verification:");
    console.log("─────────────────────────────────────────────────────────────");
    console.log("  To verify your contract on BSCScan, run:\n");
    console.log(`  npx hardhat verify --network ${network.name} ${eternaAddress} "${initialSupply}"\n`);

    if (!process.env.BSCSCAN_API_KEY) {
      console.log("  ⚠️  Note: Set BSCSCAN_API_KEY in .env for verification");
      console.log("  Get API key from: https://bscscan.com/myapikey\n");
    }
  }

  console.log("⚙️  Frontend Configuration:");
  console.log("─────────────────────────────────────────────────────────────");
  console.log("  Update frontend/.env with:\n");
  console.log(`  VITE_CONTRACT_ADDRESS=${eternaAddress}\n`);

  console.log("🎉 Deployment Complete!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  console.log("💡 Next Steps:");
  console.log("  1. Update frontend/.env with the contract address above");
  console.log("  2. Run: npm run frontend");
  console.log("  3. Connect MetaMask to BSC Testnet");
  console.log("  4. Start interacting with your token!\n");

  return {
    contractAddress: eternaAddress,
    network: network.name,
    chainId: network.chainId,
  };
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment Failed:");
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.error(error);
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    process.exit(1);
  });
