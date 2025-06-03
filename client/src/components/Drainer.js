import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Wallet, Import, ExternalLink, Menu, X, Moon, Sun, AlertTriangle } from 'lucide-react';
import ServicesSection from './Resolve';


// Mock Link component for demo - replace with actual React Router Link
const Link = ({ to, children, className, ...props }) => (
  <a href={to} className={className} {...props}>
    {children}
  </a>
);

// Animation timing constants
const PRELOADER_DURATION = 2500;
const ANIMATION_DELAY = 200;

export default function LunchPoolHero() {
  // State management
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Refs for animation elements
  const particleContainerRef = useRef(null);
  const heroRef = useRef(null);
  
  // Cursor follower effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
      
      // Add particle effect at cursor position
      if (particleContainerRef.current) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${e.clientX}px`;
        particle.style.top = `${e.clientY}px`;
        particle.style.backgroundColor = Math.random() > 0.5 ? 'var(--neon-blue)' : 'var(--electric-purple)';
        
        particleContainerRef.current.appendChild(particle);
        
        // Remove particle after animation completes
        setTimeout(() => {
          if (particleContainerRef.current && particle) {
            particleContainerRef.current.removeChild(particle);
          }
        }, 1000);
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  // Preloader effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, PRELOADER_DURATION);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Toggle functions
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  
  // Component classes based on states
  const themeClass = isDarkMode ? 'dark-theme' : 'light-theme';
  const loadingClass = loading ? 'loading' : '';
  
  return (
    <div className={`lunch-pool-app ${themeClass}`}>
      {/* Preloader */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="preloader">
            <div className="cube">
              <div className="cube-face cube-face-front"></div>
              <div className="cube-face cube-face-back"></div>
              <div className="cube-face cube-face-right"></div>
              <div className="cube-face cube-face-left"></div>
              <div className="cube-face cube-face-top"></div>
              <div className="cube-face cube-face-bottom"></div>
            </div>
            <div className="mt-8 text-center">
              <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                LUNCH POOL
              </p>
              <p className="text-sm text-gray-400 mt-2">Initializing Blockchain Systems...</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Particle container for cursor effects */}
      <div ref={particleContainerRef} className="particle-container fixed inset-0 pointer-events-none z-10"></div>
      
      {/* Gradient background overlay */}
      <div className="fixed inset-0 bg-gradient-radial from-transparent via-indigo-900/20 to-black/80 pointer-events-none"></div>
      
      {/* Header with logo and navigation */}
      <header className="relative z-20 px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="logo-container">
          <div className="logo pulse-animation">LUNCH POOL</div>
          <div className="logo-blur"></div>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {/* Theme Toggle */}
          <button 
            onClick={toggleDarkMode} 
            className="theme-toggle p-2 rounded-full hover:bg-white/10"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          {/* Connect Wallet Button */}
          <Link to="/connect">
            <button className="wallet-connect-btn flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all">
              <Wallet size={16} />
              <span>Connect Wallet</span>
            </button>
          </Link>
        </nav>
        
        {/* Mobile Menu Button */}
        <button onClick={toggleMobileMenu} className="block md:hidden text-white">
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>
      
      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu fixed inset-0 z-40 bg-black/95 backdrop-blur-lg pt-20">
          <nav className="flex flex-col p-6 space-y-6">
            <div className="flex justify-between items-center py-4 border-b border-white/10">
              <button onClick={toggleDarkMode} className="flex items-center space-x-2 text-white">
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
            </div>
            
            <Link to="/connect" onClick={() => setMobileMenuOpen(false)}>
              <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 py-3 rounded-lg font-medium text-white">
                Connect Wallet
              </button>
            </Link>
          </nav>
        </div>
      )}
      
      {/* Main Hero Section */}
      <main ref={heroRef} className={`hero-container relative z-20 min-h-screen flex items-center ${loadingClass}`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-7xl mx-auto px-6 py-12">
          {/* Hero Content */}
          <div className="hero-content fade-in" style={{ animationDelay: `${ANIMATION_DELAY}ms` }}>
            <div className="glowing-tag inline-block px-3 py-1 rounded-full bg-blue-900/30 border border-blue-500/50 text-blue-400 text-xs font-semibold mb-8">
              NEXT-GEN BLOCKCHAIN UTILITY
            </div>
            
            <h1 className="hero-title text-4xl md:text-6xl font-bold mb-6">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                🔒 Blockchain Issues?
              </span>
              <span className="block text-white">Fixed. Fast.</span>
            </h1>
            
            <p className="hero-subtitle text-xl text-gray-300 mb-8">
              Your Trusted Tool for Seamless Crypto Recovery & Resolution
            </p>
            
            <p className="hero-description text-gray-400 mb-8 max-w-lg">
              Whether you're dealing with stuck transactions, wallet glitches, or smart contract errors — we make blockchain problems disappear, securely and efficiently.
            </p>
            
            <div className="hero-cta-group flex flex-wrap gap-4 mb-12">
              <Link to="/connect">
                <button className="primary-cta relative overflow-hidden px-8 py-4 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 font-medium text-white hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg shadow-purple-700/30 group">
                  Connect Wallet
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="coin-orbit">
                      <div className="coin coin-btc"></div>
                      <div className="coin coin-eth"></div>
                      <div className="coin coin-bnb"></div>
                      <div className="coin coin-usdt"></div>
                    </div>
                  </div>
                </button>
              </Link>
              
              <Link to="/connect">
                <button className="secondary-cta px-8 py-4 rounded-lg border border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all font-medium flex items-center gap-2">
                  <Import size={18} />
                  Import Wallet
                </button>
              </Link>
            </div>
            
            <div className="hero-tagline">
              <p className="text-sm font-medium text-gray-400 mb-2">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 font-bold">
                  Crypto Rectification. Simplified. Trusted. Instant.
                </span>
              </p>
              <p className="text-xs text-gray-500">
                Join thousands who rely on us to get their crypto back on track — without the tech headache.
              </p>
            </div>
            
            <div className="hero-stats flex items-center space-x-8 mt-12">
              <div className="stat">
                <div className="text-2xl font-bold text-white">50K+</div>
                <div className="text-xs text-gray-400">Issues Resolved</div>
              </div>
              <div className="stat">
                <div className="text-2xl font-bold text-white">99.8%</div>
                <div className="text-xs text-gray-400">Success Rate</div>
              </div>
              <div className="stat">
                <div className="text-2xl font-bold text-white">24/7</div>
                <div className="text-xs text-gray-400">Support</div>
              </div>
            </div>
          </div>
          
          {/* Hero Visual / 3D Element */}
          <div className="hero-visual relative flex justify-center items-center fade-in" style={{ animationDelay: `${ANIMATION_DELAY * 2}ms` }}>
            <div className="blockchain-visual">
              <div className="blockchain-sphere"></div>
              <div className="blockchain-grid"></div>
              <div className="floating-elements">
                <div className="floating-node node-1"></div>
                <div className="floating-node node-2"></div>
                <div className="floating-node node-3"></div>
                <div className="floating-node node-4"></div>
                <div className="floating-node node-5"></div>
                <div className="floating-connection connection-1"></div>
                <div className="floating-connection connection-2"></div>
                <div className="floating-connection connection-3"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* How It Works Section */}
      <section className="relative z-20 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="glowing-tag inline-block px-3 py-1 rounded-full bg-purple-900/30 border border-purple-500/50 text-purple-400 text-xs font-semibold mb-6">
              HOW IT WORKS
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              Simple Steps - How to Fix Web3 Related Issues
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our streamlined process ensures your blockchain issues are resolved quickly and securely
            </p>
          </div>
          
          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {/* Step 1 */}
            <div className="step-card group relative overflow-hidden rounded-xl bg-gradient-to-b from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-sm p-6 hover:border-blue-500/50 transition-all duration-300">
              <div className="step-number absolute -top-2 -right-2 w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold">
                01
              </div>
              <div className="step-icon w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <AlertTriangle size={24} className="text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Select Issue to Fix</h3>
              <p className="text-gray-400 text-sm">
                Choose from common blockchain problems like stuck transactions, wallet errors, or smart contract issues.
              </p>
              <div className="step-glow absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-blue-500/10 to-purple-600/10"></div>
            </div>
            
            {/* Step 2 */}
            <div className="step-card group relative overflow-hidden rounded-xl bg-gradient-to-b from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-sm p-6 hover:border-purple-500/50 transition-all duration-300">
              <div className="step-number absolute -top-2 -right-2 w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center text-sm font-bold">
                02
              </div>
              <div className="step-icon w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Wallet size={24} className="text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Connect Your Wallet</h3>
              <p className="text-gray-400 text-sm">
                Securely link your crypto wallet using our automatic detection or choose manual connection.
              </p>
              <div className="step-glow absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-purple-500/10 to-pink-600/10"></div>
            </div>
            
            {/* Step 3 */}
            <div className="step-card group relative overflow-hidden rounded-xl bg-gradient-to-b from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-sm p-6 hover:border-teal-500/50 transition-all duration-300">
              <div className="step-number absolute -top-2 -right-2 w-12 h-12 rounded-full bg-gradient-to-r from-teal-500 to-cyan-600 flex items-center justify-center text-sm font-bold">
                03
              </div>
              <div className="step-icon w-12 h-12 rounded-lg bg-teal-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ExternalLink size={24} className="text-teal-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Approve Connection</h3>
              <p className="text-gray-400 text-sm">
                Confirm the secure connection in your wallet to authorize the rectification process.
              </p>
              <div className="step-glow absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-teal-500/10 to-cyan-600/10"></div>
            </div>
            
            {/* Step 4 */}
            <div className="step-card group relative overflow-hidden rounded-xl bg-gradient-to-b from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-sm p-6 hover:border-green-500/50 transition-all duration-300">
              <div className="step-number absolute -top-2 -right-2 w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center text-sm font-bold">
                04
              </div>
              <div className="step-icon w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <div className="w-6 h-6 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Wait while Issue gets Fixed</h3>
              <p className="text-gray-400 text-sm">
                Our advanced algorithms work behind the scenes to resolve your blockchain issue automatically.
              </p>
              <div className="step-glow absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-green-500/10 to-emerald-600/10"></div>
            </div>
          </div>
          
          {/* Manual Connection Section */}
          <div className="manual-connection-section max-w-4xl mx-auto">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-sm p-8 md:p-12">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-500/10 to-pink-600/10 rounded-full blur-2xl"></div>
              
              <div className="relative z-10">
                <h3 className="text-2xl md:text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                  Manual Connection
                </h3>
                
                <p className="text-gray-300 leading-relaxed mb-8 text-base md:text-lg">
                  <em>
                    "You can choose to Connect Manually. While our automatic connection tools are designed for seamless integration, some situations call for a little extra control. That's where 'Connect Manually' comes in. This option gives you the power to hand-pick your wallet and tailor the connection process to your specific needs. Whether you prefer the familiarity of a direct address or the security of a QR code scan, 'Connect Manually' offers the flexibility you crave. So, take a deep breath, dive into the details, and connect your wallet just the way you like it."
                  </em>
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <Link to="/connect">
                    <button className="manual-connect-btn group relative overflow-hidden px-8 py-4 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 font-medium text-white hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg shadow-purple-700/30 w-full sm:w-auto">
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <Wallet size={18} />
                        Connect Manually
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </button>
                  </Link>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Advanced users preferred</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    <ServicesSection/>

  
{/* Footer */}
<footer className="relative z-20 bg-gradient-to-b from-transparent to-black/50 border-t border-white/10 mt-20">
  <div className="max-w-7xl mx-auto px-6 py-16">
    {/* Main Footer Content */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
      {/* Brand Section */}
      <div className="lg:col-span-2">
        <div className="footer-logo-container mb-6">
          <div className="footer-logo text-3xl font-bold">LUNCH POOL</div>
          <div className="footer-logo-blur"></div>
        </div>
        <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
          Your trusted partner for seamless crypto recovery and blockchain issue resolution. 
          We make Web3 problems disappear with cutting-edge security and instant solutions.
        </p>
        <div className="footer-stats flex items-center space-x-6">
          <div className="stat-item">
            <div className="text-lg font-bold text-blue-400">50K+</div>
            <div className="text-xs text-gray-500">Issues Resolved</div>
          </div>
          <div className="stat-item">
            <div className="text-lg font-bold text-purple-400">99.8%</div>
            <div className="text-xs text-gray-500">Success Rate</div>
          </div>
          <div className="stat-item">
            <div className="text-lg font-bold text-teal-400">24/7</div>
            <div className="text-xs text-gray-500">Support</div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h3 className="text-lg font-semibold mb-6 text-white">Quick Links</h3>
        <ul className="space-y-3">
          <li>
            <Link to="/connect" className="footer-link text-gray-400 hover:text-blue-400 transition-colors">
              Connect Wallet
            </Link>
          </li>
          <li>
            <Link to="/manual-connect" className="footer-link text-gray-400 hover:text-purple-400 transition-colors">
              Manual Connection
            </Link>
          </li>
          <li>
            <Link to="/support" className="footer-link text-gray-400 hover:text-teal-400 transition-colors">
              Support Center
            </Link>
          </li>
          <li>
            <Link to="/security" className="footer-link text-gray-400 hover:text-green-400 transition-colors">
              Security
            </Link>
          </li>
        </ul>
      </div>

      {/* Legal */}
      <div>
        <h3 className="text-lg font-semibold mb-6 text-white">Legal</h3>
        <ul className="space-y-3">
          <li>
            <Link to="/privacy" className="footer-link text-gray-400 hover:text-blue-400 transition-colors">
              Privacy Policy
            </Link>
          </li>
          <li>
            <Link to="/terms" className="footer-link text-gray-400 hover:text-purple-400 transition-colors">
              Terms of Service
            </Link>
          </li>
          <li>
            <Link to="/disclaimer" className="footer-link text-gray-400 hover:text-teal-400 transition-colors">
              Disclaimer
            </Link>
          </li>
          <li>
            <Link to="/cookies" className="footer-link text-gray-400 hover:text-green-400 transition-colors">
              Cookie Policy
            </Link>
          </li>
        </ul>
      </div>
    </div>

    {/* Social Media Section */}
    <div className="border-t border-white/10 pt-8 mb-8">
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
          Connect With Us
        </h3>
        <p className="text-gray-400 mb-6">
          Stay updated with the latest news and get instant support
        </p>
      </div>
      
      <div className="flex justify-center items-center space-x-4 flex-wrap gap-4">
        {/* WhatsApp */}
        <a 
          href="https://wa.me/your-number" 
          target="_blank" 
          rel="noopener noreferrer"
          className="social-link whatsapp group relative overflow-hidden"
        >
          <div className="social-icon-bg whatsapp-bg"></div>
          <div className="social-icon relative z-10">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.525 3.488"/>
            </svg>
          </div>
          <span className="social-label">WhatsApp</span>
        </a>

        {/* Facebook */}
        <a 
          href="https://facebook.com/your-page" 
          target="_blank" 
          rel="noopener noreferrer"
          className="social-link facebook group relative overflow-hidden"
        >
          <div className="social-icon-bg facebook-bg"></div>
          <div className="social-icon relative z-10">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </div>
          <span className="social-label">Facebook</span>
        </a>

        {/* Instagram */}
        <a 
          href="https://instagram.com/your-profile" 
          target="_blank" 
          rel="noopener noreferrer"
          className="social-link instagram group relative overflow-hidden"
        >
          <div className="social-icon-bg instagram-bg"></div>
          <div className="social-icon relative z-10">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </div>
          <span className="social-label">Instagram</span>
        </a>

        {/* Twitter */}
        <a 
          href="https://twitter.com/your-profile" 
          target="_blank" 
          rel="noopener noreferrer"
          className="social-link twitter group relative overflow-hidden"
        >
          <div className="social-icon-bg twitter-bg"></div>
          <div className="social-icon relative z-10">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
          </div>
          <span className="social-label">Twitter</span>
        </a>

        {/* YouTube */}
        <a 
          href="https://youtube.com/your-channel" 
          target="_blank" 
          rel="noopener noreferrer"
          className="social-link youtube group relative overflow-hidden"
        >
          <div className="social-icon-bg youtube-bg"></div>
          <div className="social-icon relative z-10">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </div>
          <span className="social-label">YouTube</span>
        </a>
      </div>
    </div>

    {/* Copyright Section */}
    <div className="border-t border-white/10 pt-8">
      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div className="flex items-center space-x-4">
          <p className="text-gray-400 text-sm">
            © 2025 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 font-semibold">LUNCH POOL</span>. All rights reserved.
          </p>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-400">Secure & Verified</span>
          </div>
          
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <span>Powered by Blockchain Technology</span>
            <div className="w-4 h-4 ml-1">
              <svg viewBox="0 0 24 24" fill="currentColor" className="text-blue-400">
                <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Additional Copyright Info */}
      <div className="mt-4 pt-4 border-t border-white/5">
        <p className="text-xs text-gray-500 text-center leading-relaxed">
          LUNCH POOL is committed to providing secure and reliable blockchain solutions. 
          This platform is designed for educational and utility purposes. Always verify transactions and connections. 
          <span className="text-blue-400 ml-1">Use at your own discretion.</span>
        </p>
      </div>
    </div>
  </div>

  {/* Footer Background Effects */}
  <div className="absolute inset-0 pointer-events-none">
    <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl"></div>
    <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl"></div>
  </div>
</footer>


      {/* Alert Banner */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-900/70 to-purple-900/70 backdrop-blur-sm border-t border-white/10 p-4 flex items-center justify-center z-30">
        <AlertTriangle size={16} className="text-yellow-400 mr-2" />
        <span className="text-sm">Security First: Always verify you're on the official LUNCH POOL platform</span>
        <a href="#" className="text-blue-400 ml-2 flex items-center hover:underline text-sm">
          Learn More <ExternalLink size={12} className="ml-1" />
        </a>
      </div>
      
      {/* Cursor follower effect */}
      <div 
        className="cursor-follower"
        style={{
          left: `${cursorPosition.x}px`,
          top: `${cursorPosition.y}px`
        }}
      ></div>

      <style>{`
        :root {
          --primary-dark: #050718;
          --secondary-dark: #0a0d2c;
          --neon-blue: #00c2ff;
          --electric-purple: #9900ff;
          --accent-teal: #00ffd5;
          --text-light: #ffffff;
          --gradient-blue: linear-gradient(135deg, #0055ff, #00c2ff);
          --gradient-purple: linear-gradient(135deg, #9900ff, #5000ff);
          --gradient-primary: linear-gradient(135deg, #00c2ff, #9900ff);
        }
        
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Space Grotesk', sans-serif;
        }

        .lunch-pool-app {
          background-color: var(--primary-dark);
          color: var(--text-light);
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
        }
        
        /* Preloader Cube Animation */
        .preloader {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        
        .cube {
          width: 80px;
          height: 80px;
          position: relative;
          transform-style: preserve-3d;
          animation: rotate 4s infinite linear;
        }
        
        .cube-face {
          position: absolute;
          width: 80px;
          height: 80px;
          border: 1px solid var(--neon-blue);
          background-color: rgba(0, 194, 255, 0.05);
          box-shadow: 0 0 15px rgba(0, 194, 255, 0.5);
        }
        
        .cube-face-front {
          transform: translateZ(40px);
        }
        
        .cube-face-back {
          transform: translateZ(-40px) rotateY(180deg);
        }
        
        .cube-face-right {
          transform: rotateY(90deg) translateZ(40px);
        }
        
        .cube-face-left {
          transform: rotateY(-90deg) translateZ(40px);
        }
        
        .cube-face-top {
          transform: rotateX(90deg) translateZ(40px);
        }
        
        .cube-face-bottom {
          transform: rotateX(-90deg) translateZ(40px);
        }
        
        @keyframes rotate {
          0% {
            transform: rotateX(0) rotateY(0) rotateZ(0);
          }
          100% {
            transform: rotateX(360deg) rotateY(720deg) rotateZ(360deg);
          }
        }
        
        /* Logo Animation */
        .logo-container {
          position: relative;
        }
        
        .logo {
          font-size: 24px;
          font-weight: 700;
          letter-spacing: 1px;
          background: linear-gradient(to right, var(--neon-blue), var(--electric-purple));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          position: relative;
          z-index: 1;
        }
        
        .logo-blur {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          filter: blur(8px);
          opacity: 0.4;
          background: var(--neon-blue);
          z-index: 0;
        }
        
        .pulse-animation {
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
          100% {
            opacity: 1;
          }
        }
        
        /* Navigation Styles */
        .nav-link {
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.3s ease;
          position: relative;
        }
        
        .nav-link:hover {
          color: var(--text-light);
        }
        
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--gradient-primary);
          transition: width 0.3s ease;
        }
        
        .nav-link:hover::after {
          width: 100%;
        }
        
        /* Cursor Follower */
        .cursor-follower {
          width: 200px;
          height: 200px;
          border-radius: 50%;
          position: fixed;
          pointer-events: none;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, rgba(153, 0, 255, 0.1) 0%, rgba(0, 194, 255, 0.05) 50%, transparent 70%);
          filter: blur(10px);
          z-index: 9;
          opacity: 0.5;
          transition: opacity 0.5s ease;
        }
        
        /* Particles */
        .particle {
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          opacity: 0.7;
          animation: particleFade 1s ease-out forwards;
        }
        
        @keyframes particleFade {
          0% {
            transform: scale(1);
            opacity: 0.7;
          }
          100% {
            transform: scale(0);
            opacity: 0;
          }
        }
        
        /* Hero Content Animations */
        .hero-container.loading {
          opacity: 0;
        }
        
        .fade-in {
          animation: fadeIn 1s ease-out forwards;
          opacity: 0;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Blockchain Visual */
        .blockchain-visual {
          position: relative;
          width: 400px;
          height: 400px;
        }
        
        .blockchain-sphere {
          position: absolute;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0, 194, 255, 0.1) 0%, rgba(153, 0, 255, 0.05) 70%);
          border: 1px solid rgba(0, 194, 255, 0.3);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: pulseSphere 8s infinite alternate;
        }
        
        .blockchain-grid {
          position: absolute;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          border: 1px dashed rgba(0, 194, 255, 0.2);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(0deg);
          animation: rotateGrid 40s linear infinite;
        }
        
        @keyframes pulseSphere {
          0% {
            box-shadow: 0 0 30px rgba(0, 194, 255, 0.5);
            transform: translate(-50%, -50%) scale(1);
          }
          100% {
            box-shadow: 0 0 50px rgba(153, 0, 255, 0.5);
            transform: translate(-50%, -50%) scale(1.1);
          }
        }
        
        @keyframes rotateGrid {
          0% {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          100% {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }
        
        .floating-node {
          position: absolute;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--neon-blue);
          box-shadow: 0 0 15px var(--neon-blue);
        }
        
        .node-1 {
          top: 20%;
          left: 30%;
          animation: floatNode 8s infinite alternate;
        }
        
        .node-2 {
          top: 70%;
          left: 20%;
          animation: floatNode 12s infinite alternate-reverse;
          background: var(--electric-purple);
          box-shadow: 0 0 15px var(--electric-purple);
        }
        
        .node-3 {
          top: 40%;
          left: 80%;
          animation: floatNode 10s infinite alternate;
        }
        
        .node-4 {
          top: 80%;
          left: 60%;
          animation: floatNode 9s infinite alternate-reverse;
          background: var(--accent-teal);
          box-shadow: 0 0 15px var(--accent-teal);
        }
        
        .node-5 {
          top: 30%;
          left: 50%;
          animation: floatNode 11s infinite alternate;
          background: var(--electric-purple);
          box-shadow: 0 0 15px var(--electric-purple);
        }
        
        @keyframes floatNode {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(20px, 20px);
          }
        }
        
        .floating-connection {
          position: absolute;
          height: 1px;
          background: linear-gradient(90deg, var(--neon-blue), transparent);
          opacity: 0.6;
          transform-origin: left center;
        }
        
        .connection-1 {
          width: 150px;
          top: 22%;
          left: 34%;
          transform: rotate(30deg);
          animation: pulseConnection 4s infinite alternate;
        }
        
        .connection-2 {
          width: 120px;
          top: 65%;
          left: 25%;
          transform: rotate(-30deg);
          animation: pulseConnection 5s infinite alternate-reverse;
        }
        
        .connection-3 {
          width: 180px;
          top: 35%;
          left: 55%;
          transform: rotate(150deg);
          animation: pulseConnection 6s infinite alternate;
        }
        
        @keyframes pulseConnection {
          0% {
            opacity: 0.2;
          }
          100% {
            opacity: 0.6;
          }
        }
        
        /* CTA Button Coin Animation */
        .coin-orbit {
          position: absolute;
          width: 100%;
          height: 100%;
          animation: orbitRotate 10s linear infinite;
        }
        
        @keyframes orbitRotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        
        .coin {
          position: absolute;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background-position: center;
          background-size: cover;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        }
        
        .coin-btc {
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          background-color: #f7931a;
        }
        
        .coin-eth {
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          background-color: #627eea;
        }
        
        .coin-bnb {
          top: 50%;
          left: 0;
          transform: translateY(-50%);
          background-color: #f3ba2f;
        }
        
        .coin-usdt {
          top: 50%;
          right: 0;
          transform: translateY(-50%);
          background-color: #26a17b;
        }
        
        /* Light Theme */
        .light-theme {
          background-color: #f0f4ff;
          color: #0a0d2c;
        }
        
        .light-theme .cursor-follower {
          background: radial-gradient(circle, rgba(153, 0, 255, 0.05) 0%, rgba(0, 194, 255, 0.02) 50%, transparent 70%);
        }
        
        /* Responsive Adjustments */
        @media (max-width: 1024px) {
          .blockchain-visual {
            width: 300px;
            height: 300px;
          }
        }
        
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }
          
          .hero-subtitle {
            font-size: 1.2rem;
          }
          
          .blockchain-visual {
            width: 250px;
            height: 250px;
            margin: 0 auto;
          }
        }

        /* FAQ Styles */
.faq-item {
  transition: all 0.3s ease;
}

.faq-question:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 194, 255, 0.15);
}

.faq-answer {
  transition: max-height 0.4s ease-in-out, opacity 0.3s ease-in-out, padding 0.3s ease;
}

/* Responsive FAQ adjustments */
@media (max-width: 768px) {
  .faq-question h3 {
    font-size: 1rem;
    line-height: 1.4;
  }
  
  .faq-question {
    padding: 1rem;
  }
  
  .faq-answer {
    padding: 1rem;
    padding-top: 0;
  } 
}

/* Footer Styles */
.footer-logo-container {
  position: relative;
}

.footer-logo {
  font-weight: 700;
  letter-spacing: 1px;
  background: linear-gradient(to right, var(--neon-blue), var(--electric-purple));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  position: relative;
  z-index: 1;
}

.footer-logo-blur {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  filter: blur(6px);
  opacity: 0.3;
  background: var(--neon-blue);
  z-index: 0;
}

.footer-link {
  position: relative;
  display: inline-block;
  text-decoration: none;
}

.footer-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: currentColor;
  transition: width 0.3s ease;
}

.footer-link:hover::after {
  width: 100%;
}

/* Social Media Styles */
.social-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  padding: 16px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  position: relative;
  min-width: 80px;
}

.social-link:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.social-icon-bg {
  position: absolute;
  inset: 0;
  border-radius: 16px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.social-link:hover .social-icon-bg {
  opacity: 0.1;
}

.social-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  transition: all 0.3s ease;
}

.social-label {
  font-size: 12px;
  font-weight: 500;
  color: #9ca3af;
  transition: color 0.3s ease;
}

/* Individual Social Platform Colors */
.whatsapp:hover .social-icon {
  color: #25D366;
  background: rgba(37, 211, 102, 0.1);
}

.whatsapp:hover .social-label {
  color: #25D366;
}

.whatsapp-bg {
  background: linear-gradient(135deg, #25D366, #128C7E);
}

.facebook:hover .social-icon {
  color: #1877F2;
  background: rgba(24, 119, 242, 0.1);
}

.facebook:hover .social-label {
  color: #1877F2;
}

.facebook-bg {
  background: linear-gradient(135deg, #1877F2, #42A5F5);
}

.instagram:hover .social-icon {
  color: #E4405F;
  background: rgba(228, 64, 95, 0.1);
}

.instagram:hover .social-label {
  color: #E4405F;
}

.instagram-bg {
  background: linear-gradient(135deg, #E4405F, #FFDC80);
}

.twitter:hover .social-icon {
  color: #1DA1F2;
  background: rgba(29, 161, 242, 0.1);
}

.twitter:hover .social-label {
  color: #1DA1F2;
}

.twitter-bg {
  background: linear-gradient(135deg, #1DA1F2, #0084B4);
}

.youtube:hover .social-icon {
  color: #FF0000;
  background: rgba(255, 0, 0, 0.1);
}

.youtube:hover .social-label {
  color: #FF0000;
}

.youtube-bg {
  background: linear-gradient(135deg, #FF0000, #CC0000);
}

/* Responsive Footer */
@media (max-width: 768px) {
  .social-link {
    min-width: 70px;
    padding: 12px;
  }
  
  .social-icon {
    width: 40px;
    height: 40px;
    margin-bottom: 6px;
  }
  
  .social-label {
    font-size: 11px;
  }
  
  .footer-stats {
    justify-content: center;
  }
  
  .footer-stats .stat-item {
    text-align: center;
  }
}

@media (max-width: 640px) {
  .social-link {
    flex-direction: row;
    min-width: auto;
    padding: 8px 12px;
  }
  
  .social-icon {
    width: 32px;
    height: 32px;
    margin-bottom: 0;
    margin-right: 8px;
  }
  
  .social-label {
    font-size: 12px;
  }
}
      `}</style>
    </div>
  );
}