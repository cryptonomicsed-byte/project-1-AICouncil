# Phase 2: Smart Contract Deployment

Deploy NeuralBrain.sol to Polygon Mumbai testnet.

## Prerequisites

- Node.js 16+
- MATIC tokens on Mumbai testnet (get from [faucet](https://faucet.polygon.technology/))
- Private key (NOT the seed phrase)

## Step 1: Setup Hardhat Project

```bash
cd contracts
npm install
```

This installs:
- `hardhat` – Smart contract development framework
- `ethers.js` – Blockchain interaction
- `dotenv` – Environment variables

## Step 2: Create .env File

```bash
cp .env.example .env
```

Edit `.env`:

```bash
# Required
PRIVATE_KEY=0x...your_private_key...
MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com

# Optional (for verification)
POLYGONSCAN_API_KEY=your_key_here
```

**Getting Private Key:**
1. Open your wallet (MetaMask, etc.)
2. Settings → Account Details → Export Private Key
3. Copy WITHOUT the 0x prefix
4. Paste in .env as: `PRIVATE_KEY=0x<your_key>`

**Getting Mumbai MATIC:**
1. Go to https://faucet.polygon.technology/
2. Select Mumbai network
3. Enter your address
4. Request tokens (you'll get 0.5 MATIC)

## Step 3: Compile Contract

```bash
npm run compile
```

Expected output:
```
✓ Compiled 1 Solidity file successfully
```

This generates:
- `artifacts/contracts/NeuralBrain.sol/NeuralBrain.json` (ABI + bytecode)

## Step 4: Deploy to Mumbai Testnet

```bash
npm run deploy:mumbai
```

Expected output:
```
🧠 Deploying NeuralBrain Contract...

📍 Deploying from: 0x1234...
💰 Account balance: 0.5 MATIC

⏳ Deploying NeuralBrain contract...
✅ NeuralBrain deployed to: 0xabcd...

📋 Contract Information:
   Address: 0xabcd...
   Network: polygon_mumbai
   Chain ID: 80001
   TX Hash: 0x5678...

💾 Deployment saved to: ./deploy/NeuralBrain_polygon_mumbai_xxx.json

🧪 Testing basic functionality...
   ✓ nextRoundId: 1
   ✓ consensusThreshold: 0.5
   ✓ admin: 0x1234...

✅ All tests passed!

🎉 Deployment Complete!
```

## Step 5: Save Deployment Info

Copy the **Contract Address** from output. You'll need it for the next phases.

Example:
```
Contract Address: 0xaBcD1234...
```

## Step 6: Extract Contract ABI

The ABI is needed for the Python integration.

```bash
cat artifacts/contracts/NeuralBrain.sol/NeuralBrain.json | grep -A 500 '"abi"' | head -n 100
```

Or open:
```
artifacts/contracts/NeuralBrain.sol/NeuralBrain.json
```

Look for the `"abi"` field (large JSON array).

## Step 7: Update Configuration

Add to your `.env` (in project root):

```bash
# Smart Contract
BRAIN_CONTRACT_ADDRESS=0xaBcD1234...
BRAIN_CONTRACT_ABI=[...paste full ABI array...]
BLOCKCHAIN_CHAIN=polygon
POLYGON_RPC_URL=https://rpc-mumbai.maticvigil.com
```

## Step 8: Verify on Mumbai Explorer

Open in browser:
```
https://mumbai.polygonscan.com/address/0xaBcD1234...
```

You should see:
- Contract name: NeuralBrain
- Contract source code
- Transactions
- Read/Write functions

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `Private key not found` | Check .env file has PRIVATE_KEY set |
| `Insufficient funds` | Get MATIC from Mumbai faucet |
| `RPC connection failed` | Check MUMBAI_RPC_URL in .env |
| `Contract compilation failed` | Run `npm run compile` first |

## Next: Phase 3

Once deployment succeeds, move to Phase 3 to integrate with council service.

You'll need:
- ✅ Contract Address
- ✅ Contract ABI
- ✅ Network (polygon_mumbai)
