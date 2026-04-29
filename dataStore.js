const balances = {};
const history = [];
const leaderboard = [];
const chatMessages = [];

const getBalance = (publicKey) => balances[publicKey] || 0;
const setBalance = (publicKey, amount) => {
    balances[publicKey] = amount;
};
const updateBalance = (publicKey, delta) => {
    balances[publicKey] = getBalance(publicKey) + delta;
};

const addHistory = (record) => {
    history.unshift({ ...record, timestamp: new Date() });
};

const updateLeaderboard = (publicKey, amount, win = false) => {
    const existing = leaderboard.find((entry) => entry.publicKey === publicKey);
    const balance = getBalance(publicKey);

    if (existing) {
        existing.balance = balance;
        if (win) existing.wins += 1;
    } else {
        leaderboard.push({ publicKey, balance, wins: win ? 1 : 0 });
    }
    leaderboard.sort((a, b) => b.balance - a.balance);
};

const addChatMessage = (message) => {
    chatMessages.push({ ...message, timestamp: new Date() });
    return chatMessages.slice(-50);
};

module.exports = {
    getBalance,
    updateBalance,
    addHistory,
    updateLeaderboard,
    balances,
    history,
    leaderboard,
    chatMessages,
    addChatMessage,
    setBalance
};
