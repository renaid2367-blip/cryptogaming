require('dotenv').config();

const HOUSE_EDGE = 0.0;

module.exports = {
    HOUSE_EDGE,
    DEPOSIT_FEE: 0.0,
    WITHDRAW_FEE: 0.0,
    NETWORK: process.env.SOLANA_NETWORK || 'devnet',
    PORT: process.env.PORT || 5000,
    SOLANA_RPC: process.env.SOLANA_RPC || 'https://api.devnet.solana.com',
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || 'your-secret-key-change-in-production',
    MASTER_WALLET_SECRET: process.env.MASTER_WALLET_SECRET || ''
};
