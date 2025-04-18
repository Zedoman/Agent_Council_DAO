require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {},
    soneium: {
        
      url: process.env.SONEIUM_RPC_URL || "https://rpc.minato.soneium.org/",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    // accounts: [
    //     "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", // Account 0
    //     "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d", // Account 1
    //     "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a", // Account 2
    //     "0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6", // Account 3
    //     "0x47e179ec197488593b187f80a00eb0da3f4b7d3d4cd7b9541d2f2b6ef11e3fd9", // Account 4
    //   ],
      chainId: 1946,
      timeout: 60000,
    },
  },
};