const web3 = require('@solana/web3.js');
const crypto = require('crypto');
const config = require('./config');

const connection = new web3.Connection(
    config.SOLANA_RPC,
    'confirmed'
);

class SolanaWalletService {
    constructor() {
        this.userWallets = {}; // Store user wallet info (public key only)
        this.masterWallet = null; // Main wallet for managing funds
        this.initMasterWallet();
    }

    initMasterWallet() {
        // In production, load from secure environment variable
        // For now, we'll create a new one
        if (config.MASTER_WALLET_SECRET) {
            try {
                const secretKey = JSON.parse(config.MASTER_WALLET_SECRET);
                this.masterWallet = web3.Keypair.fromSecretKey(new Uint8Array(secretKey));
            } catch (err) {
                console.warn('Could not load master wallet, creating new one for testing');
                this.masterWallet = web3.Keypair.generate();
            }
        } else {
            this.masterWallet = web3.Keypair.generate();
            console.log('Generated new master wallet:', this.masterWallet.publicKey.toString());
        }
    }

    createUserAccount(publicKey) {
        const pubKeyStr = publicKey.toString();
        
        if (this.userWallets[pubKeyStr]) {
            return this.userWallets[pubKeyStr];
        }

        // Store user's public key (this is connected via Phantom)
        this.userWallets[pubKeyStr] = {
            publicKey: pubKeyStr,
            createdAt: new Date(),
            balance: 0,
            transactions: []
        };

        return this.userWallets[pubKeyStr];
    }

    getUserWallet(publicKey) {
        const pubKeyStr = publicKey.toString();
        
        if (!this.userWallets[pubKeyStr]) {
            this.createUserAccount(publicKey);
        }

        return this.userWallets[pubKeyStr];
    }

    async getBalance(publicKey) {
        try {
            const pubKey = new web3.PublicKey(publicKey);
            const balance = await connection.getBalance(pubKey);
            
            // Update stored balance
            const userWallet = this.getUserWallet(pubKey);
            userWallet.balance = balance / web3.LAMPORTS_PER_SOL;
            
            return balance / web3.LAMPORTS_PER_SOL; // Convert to SOL
        } catch (err) {
            console.error('Error fetching balance:', err);
            return 0;
        }
    }

    async createDepositTransaction(userPublicKey, amount) {
        try {
            const userPubKey = new web3.PublicKey(userPublicKey);
            const masterPubKey = this.masterWallet.publicKey;

            // Create transaction from master wallet to user wallet
            const transaction = new web3.Transaction().add(
                web3.SystemProgram.transfer({
                    fromPubkey: masterPubKey,
                    toPubkey: userPubKey,
                    lamports: amount * web3.LAMPORTS_PER_SOL
                })
            );

            // Get recent blockhash
            const { blockhash } = await connection.getLatestBlockhash();
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = masterPubKey;

            // Sign with master wallet
            transaction.sign(this.masterWallet);

            // Send transaction
            const signature = await web3.sendAndConfirmTransaction(
                connection,
                transaction,
                [this.masterWallet]
            );

            console.log('Deposit transaction confirmed:', signature);

            // Update user wallet
            const userWallet = this.getUserWallet(userPubKey);
            userWallet.balance += amount;
            userWallet.transactions.push({
                type: 'deposit',
                amount,
                signature,
                timestamp: new Date(),
                status: 'confirmed'
            });

            return { success: true, signature, amount };
        } catch (err) {
            console.error('Deposit error:', err.message);
            return { success: false, error: err.message };
        }
    }

    async createWithdrawalTransaction(userPublicKey, amount) {
        try {
            // In a real scenario, user would sign this transaction
            // For now, we simulate it from the user's balance
            const userPubKey = new web3.PublicKey(userPublicKey);
            const userWallet = this.getUserWallet(userPubKey);

            if (userWallet.balance < amount) {
                return { success: false, error: 'Insufficient balance' };
            }

            // Simulate withdrawal (in production, user would sign and send)
            userWallet.balance -= amount;
            const transactionId = crypto.randomBytes(32).toString('hex');

            userWallet.transactions.push({
                type: 'withdrawal',
                amount,
                transactionId,
                timestamp: new Date(),
                status: 'pending'
            });

            return { success: true, transactionId, amount };
        } catch (err) {
            console.error('Withdrawal error:', err.message);
            return { success: false, error: err.message };
        }
    }

    getUserTransactionHistory(publicKey) {
        const userWallet = this.getUserWallet(new web3.PublicKey(publicKey));
        return userWallet.transactions;
    }

    getMasterWalletAddress() {
        return this.masterWallet.publicKey.toString();
    }
}

module.exports = {
    SolanaWalletService,
    connection,
    web3
};
