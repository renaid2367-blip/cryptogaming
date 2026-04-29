const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const config = require('./config');

const walletRoutes = require('./routes/wallet');
const gameRoutes = require('./routes/games');
const dataRoutes = require('./routes/data');
const chatRoutes = require('./routes/chat');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/wallet', walletRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/chat', chatRoutes);

app.use(express.static(path.join(__dirname, '../frontend')));

app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'API endpoint not found' });
    }
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(config.PORT, () => {
    console.log(`Server listening on http://localhost:${config.PORT}`);
});
