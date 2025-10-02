# Eterna Token (ETN) - BNB Smart Chain Starter Project

A complete starter project for deploying and interacting with the Eterna (ETN) ERC-20 token on BNB Smart Chain Testnet. Built by CodeGrin Technologies.

## Project Structure

```
eterna-token-project/
├── contracts/          # Smart contracts
│   └── Eterna.sol     # ERC-20 token contract
├── scripts/           # Deployment scripts
│   └── deploy.ts      # Deployment script for BSC testnet
├── test/              # Contract tests
│   └── Eterna.test.ts # Comprehensive test suite
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── components/ # UI components
│   │   ├── hooks/      # React hooks
│   │   ├── utils/      # Utility functions
│   │   ├── App.tsx     # Main application
│   │   └── config.ts   # Configuration
│   └── package.json
├── hardhat.config.ts  # Hardhat configuration
├── package.json       # Root package.json
└── .env.example       # Environment variables template
```

## Features

### Smart Contract
- ERC-20 compliant token using OpenZeppelin
- 18 decimals precision
- Minting capability (owner only)
- Burning capability
- Comprehensive event emissions
- Security validations

### Frontend
- React + TypeScript + Vite
- MetaMask wallet connection
- Real-time balance updates
- Token transfer functionality
- Transaction history (last 10 transfers)
- Toast notifications
- Form validation
- Responsive design
- BSCScan integration

## Prerequisites

- Node.js v16+ and npm
- MetaMask browser extension
- BNB testnet tokens (get from [BSC Testnet Faucet](https://testnet.bnbchain.org/faucet-smart))

## Quick Start

### 1. Installation

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your values:

```env
BSC_TESTNET_RPC=https://data-seed-prebsc-1-s1.binance.org:8545/
DEPLOYER_PRIVATE_KEY=your_private_key_without_0x_prefix
BSCSCAN_API_KEY=your_bscscan_api_key
INITIAL_SUPPLY=1000000
```

**Important**: Never commit your `.env` file to version control!

### 3. Compile Smart Contracts

```bash
npm run compile
```

This compiles the Solidity contracts and generates TypeScript types.

### 4. Run Tests

```bash
npm run test
```

Expected output: All tests should pass with detailed coverage of:
- Deployment
- Transfers
- Approvals and TransferFrom
- Minting
- Burning
- Balance queries
- Ownership

### 5. Deploy to BSC Testnet

```bash
npm run deploy
```

The deployment script will:
- Display your deployer address and balance
- Deploy the Eterna token contract
- Mint initial supply to deployer
- Display contract address and details
- Provide verification command
- Show BSCScan link

**Save the contract address** - you'll need it for the frontend!

### 6. Configure Frontend

Create `frontend/.env`:

```bash
cp frontend/.env.example frontend/.env
```

Edit `frontend/.env` and add your deployed contract address:

```env
VITE_CONTRACT_ADDRESS=0xYourDeployedContractAddress
VITE_BSC_TESTNET_RPC=https://data-seed-prebsc-1-s1.binance.org:8545/
VITE_CHAIN_ID=97
VITE_EXPLORER_URL=https://testnet.bscscan.com
```

### 7. Run Frontend

```bash
npm run frontend
```

The frontend will start at `http://localhost:5173`

### 8. Connect MetaMask

1. Open MetaMask
2. Add BSC Testnet network (if not already added)
   - Network Name: BSC Testnet
   - RPC URL: https://data-seed-prebsc-1-s1.binance.org:8545/
   - Chain ID: 97
   - Currency Symbol: BNB
   - Block Explorer: https://testnet.bscscan.com
3. Click "Connect Wallet" in the frontend
4. Approve the connection in MetaMask

### 9. Interact with Token

- View your ETN balance
- Send tokens to another address
- View transaction history
- Check transactions on BSCScan

## Available Scripts

### Root Commands

```bash
npm run compile        # Compile smart contracts
npm run test          # Run test suite
npm run deploy        # Deploy to BSC testnet
npm run deploy:local  # Deploy to local Hardhat network
npm run node          # Start local Hardhat node
npm run frontend      # Start frontend development server
npm run frontend:build # Build frontend for production
npm run verify        # Verify contract on BSCScan
```

### Frontend Commands

```bash
cd frontend
npm run dev           # Start development server
npm run build         # Build for production
npm run preview       # Preview production build
npm run lint          # Run ESLint
```

## Contract Verification

After deployment, verify your contract on BSCScan:

```bash
npx hardhat verify --network bscTestnet <CONTRACT_ADDRESS> "1000000"
```

Replace `<CONTRACT_ADDRESS>` with your deployed contract address.

**Note**: You need a BSCScan API key in your `.env` file.

## Testing

The test suite includes comprehensive coverage:

```bash
npm run test
```

Test categories:
- Deployment validation
- Token transfers
- Approval mechanisms
- Minting (owner only)
- Burning capabilities
- Balance queries
- Ownership management
- Error handling

## Troubleshooting

### MetaMask Connection Issues

- Ensure you're on BSC Testnet (Chain ID: 97)
- Check that your account has BNB for gas fees
- Try disconnecting and reconnecting your wallet

### Deployment Fails

- Verify you have BNB in your deployer account
- Check your RPC URL is correct
- Ensure your private key is valid (without 0x prefix)

### Frontend Shows "Contract Not Configured"

- Make sure you've deployed the contract
- Update `frontend/.env` with the correct contract address
- Restart the frontend development server

### Transaction Fails

- Check you have enough BNB for gas
- Verify you have enough ETN tokens
- Ensure recipient address is valid
- Check you're on BSC Testnet

## Security Best Practices

1. Never commit `.env` files
2. Never share your private keys
3. Use testnet for development
4. Test thoroughly before mainnet deployment
5. Consider a professional audit for production

## Network Information

### BSC Testnet
- Chain ID: 97
- RPC URL: https://data-seed-prebsc-1-s1.binance.org:8545/
- Explorer: https://testnet.bscscan.com
- Faucet: https://testnet.bnbchain.org/faucet-smart

### BSC Mainnet (Production)
- Chain ID: 56
- RPC URL: https://bsc-dataseed.binance.org/
- Explorer: https://bscscan.com

## Technology Stack

### Smart Contracts
- Solidity ^0.8.20
- OpenZeppelin Contracts v5.0.1
- Hardhat v2.19.4
- Ethers v6.10.0

### Frontend
- React 19
- TypeScript 5.3
- Vite 7
- Tailwind CSS 3.4
- Ethers.js 6.10

## Resources

- [BNB Smart Chain Documentation](https://docs.bnbchain.org/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [MetaMask Documentation](https://docs.metamask.io/)

## License

MIT

## Support

For issues and questions:
- Check the [Troubleshooting](#troubleshooting) section
- Review test cases in `test/Eterna.test.ts`
- Examine the deployment script in `scripts/deploy.ts`

## Author

CodeGrin Technologies

---

Built with ❤️ for the BNB Smart Chain ecosystem
