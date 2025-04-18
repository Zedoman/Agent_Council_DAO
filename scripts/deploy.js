// // scripts/deploy.js
// import hre from 'hardhat';
// // const hre = require("hardhat");

// async function main() {
//     console.log("Starting deployment on network:", hre.network.name);
  
//     // Get signers
//     const signers = await hre.ethers.getSigners();
//     const deployer = signers[0];
//     console.log("Deployer address:", deployer.address);
//     console.log("Deployer object:", Object.keys(deployer));
  
//     // Get balance using provider
//     const provider = hre.ethers.provider;
//     const balance = await provider.getBalance(deployer.address);
//     console.log("Deployer balance:", hre.ethers.formatEther(balance), "ETH");
  
//     // Agent addresses
//     const agentAddresses = signers.slice(1, 6).map(signer => signer.address);
//     console.log("Agent addresses:", agentAddresses);
  
//     console.log("Deploying AgentCouncilDAO...");
//     const AgentCouncilDAO = await hre.ethers.getContractFactory("AgentCouncilDAO");
//     const dao = await AgentCouncilDAO.deploy(agentAddresses);
//     await dao.deployed();
//     console.log("AgentCouncilDAO deployed to:", dao.address);
  
//     console.log("Deploying UserOperation...");
//     const UserOperation = await hre.ethers.getContractFactory("UserOperation");
//     const userOp = await UserOperation.deploy();
//     await userOp.deployed();
//     console.log("UserOperation deployed to:", userOp.address);
//   }
  
//   main()
//     .then(() => {
//       console.log("Deployment completed successfully");
//       process.exit(0);
//     })
//     .catch((error) => {
//       console.error("Deployment failed with error:", error);
//       process.exit(1);
//     });

import hre from 'hardhat';

async function main() {
  console.log("Starting deployment on network:", hre.network.name);

  // Get signers
  const signers = await hre.ethers.getSigners();
  const deployer = signers[0];
  console.log("Deployer address:", deployer.address);

  // Get balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Deployer balance:", hre.ethers.formatEther(balance), "ETH");

  // Agent addresses (use 5 distinct signer addresses)
  const agentAddresses = signers.slice(0, 5).map(signer => signer.address);
  console.log("Agent addresses:", agentAddresses);

  // Set low gas price (0.1 gwei = 100,000,000 wei)
  const gasPrice = hre.ethers.parseUnits("0.0", "gwei");
  console.log("Gas price set to:", hre.ethers.formatUnits(gasPrice, "gwei"), "gwei");

  console.log("Deploying AgentCouncilDAO...");
  const AgentCouncilDAO = await hre.ethers.getContractFactory("AgentCouncilDAO");
  const dao = await AgentCouncilDAO.deploy(agentAddresses);
  await dao.waitForDeployment(); // Wait for deployment (Ethers.js v6)
  const daoAddress = await dao.getAddress(); // Get deployed address
  console.log("AgentCouncilDAO deployed to:", daoAddress);

  console.log("Deploying UserOperation...");
  const UserOperation = await hre.ethers.getContractFactory("UserOperation");
  const userOp = await UserOperation.deploy();
  await userOp.waitForDeployment(); // Wait for deployment
  const userOpAddress = await userOp.getAddress(); // Get deployed address
  console.log("UserOperation deployed to:", userOpAddress);
}

main()
  .then(() => {
    console.log("Deployment completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Deployment failed with error:", error);
    process.exit(1);
  });