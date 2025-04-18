require('dotenv').config();

module.exports = {
  mongoUri: process.env.MONGO_URI,
  port: process.env.PORT || 5000,
  soneiumRpc: process.env.SONEIUM_RPC_URL,
  // privateKey: process.env.PRIVATE_KEY,
  privateKey:'0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
  contractAddress: process.env.CONTRACT_ADDRESS,
};