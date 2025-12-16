/**
 * Deploy NeuralBrain Smart Contract
 * Deploys to Polygon testnet (Mumbai) by default
 */

const hre = require("hardhat");

async function main() {
  console.log("🧠 Deploying NeuralBrain Contract...\n");

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log(`📍 Deploying from: ${deployer.address}`);

  // Get balance
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log(`💰 Account balance: ${ethers.formatEther(balance)} MATIC\n`);

  // Deploy contract
  console.log("⏳ Deploying NeuralBrain contract...");
  const NeuralBrain = await ethers.getContractFactory("NeuralBrain");
  const neuralBrain = await NeuralBrain.deploy();

  await neuralBrain.waitForDeployment();
  const contractAddress = await neuralBrain.getAddress();

  console.log(`✅ NeuralBrain deployed to: ${contractAddress}\n`);

  // Display contract info
  console.log("📋 Contract Information:");
  console.log(`   Address: ${contractAddress}`);
  console.log(`   Network: ${hre.network.name}`);
  console.log(`   Chain ID: ${(await ethers.provider.getNetwork()).chainId}`);

  // Get deployment transaction
  const deploymentTx = neuralBrain.deploymentTransaction();
  if (deploymentTx) {
    console.log(`   TX Hash: ${deploymentTx.hash}`);
  }

  // Save deployment info
  const deployment = {
    contract: "NeuralBrain",
    address: contractAddress,
    deployer: deployer.address,
    network: hre.network.name,
    timestamp: new Date().toISOString(),
  };

  const fs = require("fs");
  const filePath = `./deploy/NeuralBrain_${hre.network.name}_${Date.now()}.json`;
  fs.writeFileSync(filePath, JSON.stringify(deployment, null, 2));
  console.log(`\n💾 Deployment saved to: ${filePath}`);

  // Verify contract
  console.log("\n🔍 Verifying contract deployment...");

  try {
    const tx = neuralBrain.deploymentTransaction();
    const receipt = await tx.wait();
    console.log(`✅ Contract deployed in block: ${receipt.blockNumber}`);
  } catch (err) {
    console.log(`⚠️  Verification failed: ${err.message}`);
  }

  // Test basic functionality
  console.log("\n🧪 Testing basic functionality...");

  try {
    // Get initial state
    const nextRoundId = await neuralBrain.nextRoundId();
    console.log(`   ✓ nextRoundId: ${nextRoundId}`);

    const consensusThreshold = await neuralBrain.consensusThreshold();
    console.log(`   ✓ consensusThreshold: ${ethers.formatEther(consensusThreshold)}`);

    const admin = await neuralBrain.admin();
    console.log(`   ✓ admin: ${admin}`);

    console.log("\n✅ All tests passed!");
  } catch (err) {
    console.error(`❌ Test failed: ${err.message}`);
  }

  console.log("\n" + "=".repeat(60));
  console.log("🎉 Deployment Complete!");
  console.log("=".repeat(60));
  console.log("\nNext steps:");
  console.log(`1. Save this address: ${contractAddress}`);
  console.log(`2. Add to .env: BRAIN_CONTRACT_ADDRESS=${contractAddress}`);
  console.log(`3. Export ABI from artifacts/contracts/NeuralBrain.sol/NeuralBrain.json`);
  console.log(`4. Add to .env: BRAIN_CONTRACT_ABI=<paste ABI>`);
  console.log(`\nVerify on Polygonscan:`);
  if (hre.network.name === "polygon_mumbai") {
    console.log(
      `https://mumbai.polygonscan.com/address/${contractAddress}`
    );
  } else {
    console.log(
      `https://polygonscan.com/address/${contractAddress}`
    );
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
