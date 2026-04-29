# CryptoGames - Solana Gaming dApp

A decentralized gaming platform built on Solana with Phantom wallet integration, featuring multiple games with configurable house edge (0% available).

## Features

✨ **Games Included:**
- **Dice Game** - Roll and predict the outcome (0-100)
- **Crash Game** - Multiplier increases until it crashes
- **Slots** - Spin the reels for rewards
- **Coin Flip** - 50/50 chance to double your bet

✨ **Core Features:**
- Phantom wallet integration for deposits/withdrawals
- Hybrid on-chain/off-chain architecture
- 0% house edge (configurable)
- Game history and statistics
- Real-time leaderboard
- Live chat system
- Mobile responsive design
- Transaction verification on Solana

## Project Structure

```
├── frontend/              # React-free vanilla HTML/CSS/JS UI
│   ├── index.html        # Main entry point
│   ├── games/            # Individual game pages
│   ├── css/              # Styling
│   └── js/               # Client-side logic
├── backend/              # Node.js Express server
│   ├── server.js         # API server
│   ├── routes/           # API endpoints
│   ├── models/           # Database models
│   └── package.json
├── contracts/            # Solana smart contracts (Rust/Anchor)
│   └── programs/
└── docs/                 # Documentation
```

## Prerequisites

- Node.js (v16+)
- Phantom Wallet browser extension
- Solana devnet SOL (for testing)
- Rust (for smart contract development)

## Installation

### Backend Setup
```bash
cd backend
npm install
npm start
```
Server runs on http://localhost:5000 and serves the frontend from the `frontend` folder.

### Frontend
Open `http://localhost:5000` in your browser after starting the backend server.

### Smart Contracts
```bash
cd contracts
anchor build
anchor test
```

## Configuration

Edit `backend/config.js` to adjust:
- House edge percentage
- Game parameters
- Network (mainnet/devnet/testnet)
- Database settings

## On-Chain Solana Wallet

Each user gets a secure on-chain wallet managed by the smart contract:

- **Wallet Address**: User's Phantom wallet (via public key)
- **Deposits**: Send SOL from Phantom → Game Vault (on-chain)
- **Withdrawals**: Withdraw SOL from Game Vault → Phantom wallet
- **Balance**: Real-time balance tracking on Solana blockchain
- **Security**: Uses PDAs (Program Derived Addresses) for vault security

### Setup

1. **Install Solana CLI**: https://docs.solana.com/cli/install-solana-cli-tools

2. **Generate Master Wallet** (devnet only):
   ```bash
   solana-keygen new --outfile ~/my-solana-wallet.json
   solana config set --url devnet
   ```

3. **Get Devnet SOL** (for testing):
   ```bash
   solana airdrop 2
   ```

4. **Configure Backend**:
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env and add your master wallet secret
   ```

5. **Deploy Smart Contract**:
   ```bash
   cd contracts
   anchor build
   anchor deploy
   ```

## API Endpoints

### Authentication
- `POST /api/auth/connect` - Connect Phantom wallet
- `POST /api/auth/disconnect` - Disconnect wallet

### Wallet Operations
- `POST /api/wallet/balance` - Get on-chain balance
- `POST /api/wallet/deposit` - Send SOL to game vault
- `POST /api/wallet/withdraw` - Withdraw SOL from vault
- `POST /api/wallet/info` - Get wallet account info
- `POST /api/wallet/history` - Get transaction history
- `GET /api/wallet/master-wallet` - Get master wallet address


## Development

### Running in Development Mode
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend (serve static files)
cd frontend
python -m http.server 8000
```

Visit http://localhost:8000

### Testing
```bash
# Backend tests
cd backend
npm test

# Contract tests
cd contracts
anchor test
```

## Solana Integration

### Phantom Wallet Connection
The app uses the Solana web3.js library to interact with Phantom:
```javascript
const provider = window.solflare?.isSolflare ? window.solflare : window.phantom?.solana;
await provider.connect();
```

### Smart Contract Features
- **Deposit**: Send SOL to contract, receive game tokens
- **Withdraw**: Burn game tokens, receive SOL back
- **Game Verification**: Critical game outcomes verified on-chain for fairness

## House Edge Configuration

Default: **0%** (all winnings go to players)

To modify:
```javascript
// backend/config.js
const HOUSE_EDGE = 0.0; // 0% = no house edge
```

## Responsible Gaming

⚠️ **Always include:**
- Betting limits
- Time limits
- Reality checks
- Self-exclusion options

## License

MIT

## Support

For issues, questions, or feature requests, please open an issue on GitHub.

---

**Disclaimer**: This is a gambling platform. Users should understand the risks. Gambling can be addictive. Play responsibly. Some jurisdictions may restrict online gambling.
