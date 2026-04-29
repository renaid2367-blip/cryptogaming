# CryptoGames On-Chain Wallet Setup Guide

## Overview
This guide walks through setting up the Solana on-chain wallet feature for CryptoGames.

## Prerequisites
- Node.js v16+
- Solana CLI
- Phantom wallet (browser extension)
- Devnet SOL

## Step 1: Install Solana CLI

**Windows (via Chocolatey):**
```powershell
choco install solana
```

**macOS/Linux:**
```bash
sh -c "$(curl -sSfL https://release.solana.com/v1.14.0/install)"
```

**Verify installation:**
```bash
solana --version
```

## Step 2: Create Master Wallet (Devnet Testing)

```bash
# Generate a new keypair
solana-keygen new --outfile ~/my-solana-keypair.json

# Set to devnet
solana config set --url devnet

# Check your public key
solana address
```

## Step 3: Get Devnet SOL

```bash
# Request 2 SOL (can request multiple times, 24hr cooldown)
solana airdrop 2

# Check balance
solana balance
```

## Step 4: Configure Environment

```bash
cd backend
cp .env.example .env
```

Edit `.env` and add your master wallet:

```bash
SOLANA_NETWORK=devnet
SOLANA_RPC=https://api.devnet.solana.com

# Get your keypair from the file and convert to JSON
cat ~/my-solana-keypair.json
# Copy the entire JSON array into MASTER_WALLET_SECRET
MASTER_WALLET_SECRET=[1,2,3,...,255]
```

## Step 5: Deploy Smart Contract

```bash
cd contracts
anchor build
anchor deploy --provider.cluster devnet
```

Update the program ID in `contracts/programs/cryptogames/src/lib.rs` with the deployment address.

## Step 6: Install Backend Dependencies

```bash
cd backend
npm install
```

## Step 7: Run the Application

```bash
# Terminal 1 - Backend
cd backend
npm start

# Browser
Open http://localhost:5000
```

## How User Wallets Work

### Wallet Creation (First Time Connect)
1. User clicks "Connect Wallet"
2. Phantom extension shows approval popup
3. User signs transaction
4. Backend creates user account entry
5. User wallet address is stored locally

### Deposit Flow
1. User enters deposit amount
2. Backend creates deposit transaction
3. Master wallet (vault) transfers SOL to user's Phantom wallet
4. Transaction confirmed on-chain
5. User's balance updates

### Withdraw Flow
1. User enters withdrawal amount
2. Backend checks available balance
3. Creates withdrawal transaction
4. User's funds minus amount
5. SOL returned to original Phantom wallet

## Security Considerations

### Current Implementation (Devnet)
- Master wallet handles deposits/withdrawals
- User balances tracked in smart contract
- PDAs used for vault isolation

### Production Implementation Should Include
- Hardware wallet for master key (Ledger/Trezor)
- Multisig for treasury operations
- Separate settlement chain
- Rate limiting on withdrawals
- KYC verification
- Bug bounty program
- Audited smart contracts

## Testing the Feature

1. **Connect Wallet**:
   ```
   Click "Connect Wallet" → Approve in Phantom
   ```

2. **Deposit**:
   ```
   Enter 0.1 SOL → Click Deposit
   Watch transaction confirm
   ```

3. **Withdraw**:
   ```
   Enter 0.05 SOL → Click Withdraw
   Check your Phantom wallet balance
   ```

4. **View History**:
   ```
   Dashboard shows all transactions
   Click on transaction for details
   ```

## Troubleshooting

### "Phantom wallet not found"
- Install Phantom from https://phantom.app
- Refresh the page
- Try different browser

### "Insufficient balance"
- Request more devnet SOL: `solana airdrop 2`
- Wait for previous airdrop cooldown

### Master wallet not working
- Check `.env` file has correct JSON
- Verify wallet has SOL: `solana balance`
- Check RPC endpoint is working: `solana cluster-version`

### Transaction fails
- Check recent blockhash is valid
- Verify account has SOL for fees
- Check Solana network status

## Useful Commands

```bash
# Check wallet info
solana wallet-key

# View transaction
solana confirm <TRANSACTION_SIGNATURE>

# View program info
solana program show <PROGRAM_ID>

# Check account balance
solana balance <ACCOUNT_ADDRESS>

# Get account info
solana account <ACCOUNT_ADDRESS>
```

## Resources

- Solana Documentation: https://docs.solana.com/
- Anchor Book: https://book.anchor-lang.com/
- Phantom Wallet: https://phantom.app/
- web3.js API: https://solana-labs.github.io/solana-web3.js/
- Devnet Faucet: https://solfaucet.com/

## Next Steps

1. Implement account recovery (seed phrase)
2. Add transaction confirmation notifications
3. Create leaderboard integration
4. Add game payout logic
5. Implement fee structure
6. Add rate limiting
7. Create admin dashboard
8. Set up monitoring/alerts
