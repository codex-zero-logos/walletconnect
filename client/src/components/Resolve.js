import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ServicesSection() {
  const [selectedService, setSelectedService] = useState(null);
  const navigate = useNavigate();

  const handleServiceClick = (serviceName) => {
    setSelectedService(serviceName);
    navigate('/connect', {});
  }


    const services = [
    {
      title: "Blockchain Recovery",
      description: "Accidentally sent funds to the wrong address? Our platform facilitates blockchain recovery, helping you retrieve your lost or stuck transactions securely.",
      gradient: "from-blue-500 to-purple-600",
      hoverBorder: "hover:border-blue-500/50",
      glowGradient: "from-blue-500/5 to-purple-600/5"
    },
    {
      title: "Crypto Wallet Restoration",
      description: "Lost access to your cryptocurrency wallet? We specialize in wallet restoration, allowing you to regain control of your digital assets.",
      gradient: "from-purple-500 to-pink-600",
      hoverBorder: "hover:border-purple-500/50",
      glowGradient: "from-purple-500/5 to-pink-600/5"
    },
    {
      title: "Smart Contract Audits and Debugging",
      description: "Ensure the integrity of your smart contracts. Our experts conduct comprehensive audits and debugging to rectify vulnerabilities and improve security.",
      gradient: "from-teal-500 to-cyan-600",
      hoverBorder: "hover:border-teal-500/50",
      glowGradient: "from-teal-500/5 to-cyan-600/5"
    },
    {
      title: "DeFi Protocol Optimization",
      description: "Enhance the performance of your DeFi platform. Our experts analyze and optimize your DeFi protocols for efficiency, security, and seamless user experiences.",
      gradient: "from-green-500 to-emerald-600",
      hoverBorder: "hover:border-green-500/50",
      glowGradient: "from-green-500/5 to-emerald-600/5"
    },
    {
      title: "Airdrop Fixes",
      description: "Resolve issues related to airdrops, ensuring accurate distribution and reception of tokens during airdrop events.",
      gradient: "from-blue-500 to-indigo-600",
      hoverBorder: "hover:border-blue-500/50",
      glowGradient: "from-blue-500/5 to-indigo-600/5"
    },
    {
      title: "Token Bridge Solutions",
      description: "Develop and maintain token bridges, enabling seamless transfers and interoperability between different blockchain networks.",
      gradient: "from-purple-500 to-violet-600",
      hoverBorder: "hover:border-purple-500/50",
      glowGradient: "from-purple-500/5 to-violet-600/5"
    },
    {
      title: "NFT (Non-Fungible Token) Solutions",
      description: "Assist in the creation, management, and troubleshooting of NFTs, ensuring a smooth experience in the NFT marketplace.",
      gradient: "from-orange-500 to-red-600",
      hoverBorder: "hover:border-orange-500/50",
      glowGradient: "from-orange-500/5 to-red-600/5"
    },
    {
      title: "REVOKE",
      description: "Click here if you have problem with Revoke access on your wallet.",
      gradient: "from-red-500 to-pink-600",
      hoverBorder: "hover:border-red-500/50",
      glowGradient: "from-red-500/5 to-pink-600/5"
    },
    {
      title: "Staking",
      description: "Click here to stake tokens.",
      gradient: "from-teal-500 to-green-600",
      hoverBorder: "hover:border-teal-500/50",
      glowGradient: "from-teal-500/5 to-green-600/5"
    },
    {
      title: "KYC Issues",
      description: "Click here rectify KYC related issues.",
      gradient: "from-yellow-500 to-orange-600",
      hoverBorder: "hover:border-yellow-500/50",
      glowGradient: "from-yellow-500/5 to-orange-600/5"
    },
    {
      title: "Wallet Approval",
      description: "Click here to resolve wallet approval issues.",
      gradient: "from-blue-500 to-cyan-600",
      hoverBorder: "hover:border-blue-500/50",
      glowGradient: "from-blue-500/5 to-cyan-600/5"
    },
    {
      title: "CONNECT TO DAPPS",
      description: "Click here to connect to DAPPS.",
      gradient: "from-purple-500 to-indigo-600",
      hoverBorder: "hover:border-purple-500/50",
      glowGradient: "from-purple-500/5 to-indigo-600/5"
    },
    {
      title: "MIGRATION",
      description: "Click here for wallet transfer.",
      gradient: "from-green-500 to-teal-600",
      hoverBorder: "hover:border-green-500/50",
      glowGradient: "from-green-500/5 to-teal-600/5"
    },
    {
      title: "TRANSACTION DELAY",
      description: "Click here for transaction delay issues.",
      gradient: "from-red-500 to-orange-600",
      hoverBorder: "hover:border-red-500/50",
      glowGradient: "from-red-500/5 to-orange-600/5"
    },
    {
      title: "TOKEN BRIDGE",
      description: "Click here for token bridge.",
      gradient: "from-cyan-500 to-blue-600",
      hoverBorder: "hover:border-cyan-500/50",
      glowGradient: "from-cyan-500/5 to-blue-600/5"
    },
    {
      title: "Buy and Sell Liquidity Issues Resolution",
      description: "Address liquidity challenges affecting buy and sell actions, ensuring a balanced and smooth liquidity provision within trading platforms.",
      gradient: "from-violet-500 to-purple-600",
      hoverBorder: "hover:border-violet-500/50",
      glowGradient: "from-violet-500/5 to-purple-600/5"
    },
    {
      title: "Deposit and Withdrawal Management",
      description: "Optimize deposit and withdrawal processes to enhance user experience and streamline fund transfers securely.",
      gradient: "from-emerald-500 to-green-600",
      hoverBorder: "hover:border-emerald-500/50",
      glowGradient: "from-emerald-500/5 to-green-600/5"
    },
    {
      title: "Unable To Buy Coins/Tokens",
      description: "To trade crypto your account must be marked as a trusted payment source.",
      gradient: "from-amber-500 to-yellow-600",
      hoverBorder: "hover:border-amber-500/50",
      glowGradient: "from-amber-500/5 to-yellow-600/5"
    },
    {
      title: "Slippage Mitigation",
      description: "Implement strategies to minimize slippage, providing users with more predictable and cost-effective trades.",
      gradient: "from-rose-500 to-red-600",
      hoverBorder: "hover:border-rose-500/50",
      glowGradient: "from-rose-500/5 to-red-600/5"
    },
    {
      title: "Rectification",
      description: "Click here to rectify issues.",
      gradient: "from-lime-500 to-green-600",
      hoverBorder: "hover:border-lime-500/50",
      glowGradient: "from-lime-500/5 to-green-600/5"
    },
    {
      title: "High Gas Fees",
      description: "Click here for gas fee related issues.",
      gradient: "from-orange-500 to-amber-600",
      hoverBorder: "hover:border-orange-500/50",
      glowGradient: "from-orange-500/5 to-amber-600/5"
    },
    {
      title: "Validation",
      description: "Click here for Validation related issues.",
      gradient: "from-sky-500 to-blue-600",
      hoverBorder: "hover:border-sky-500/50",
      glowGradient: "from-sky-500/5 to-blue-600/5"
    },
    {
      title: "Claim Reward",
      description: "Click here for reward related issues.",
      gradient: "from-fuchsia-500 to-purple-600",
      hoverBorder: "hover:border-fuchsia-500/50",
      glowGradient: "from-fuchsia-500/5 to-purple-600/5"
    },
    {
      title: "Slippage Error",
      description: "Click here for slippage related error during trade.",
      gradient: "from-pink-500 to-rose-600",
      hoverBorder: "hover:border-pink-500/50",
      glowGradient: "from-pink-500/5 to-rose-600/5"
    }
  ];

  return (
    <section className="relative z-20 py-20 px-6 bg-gradient-to-b from-transparent to-black/20 min-h-screen bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-3 py-1 rounded-full bg-green-900/30 border border-green-500/50 text-green-400 text-xs font-semibold mb-6 animate-pulse">
            OUR SERVICES
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
            Issues to Resolve - Our Services
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Comprehensive blockchain solutions for all your crypto-related challenges
          </p>
        </div>
        
        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div 
              key={index}
              className={`service-card group relative overflow-hidden rounded-xl bg-gradient-to-b from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-sm p-6 ${service.hoverBorder} transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-2xl`}
            >
              <h3 className="text-lg font-semibold mb-3 text-white group-hover:text-blue-300 transition-colors">
                {service.title}
              </h3>
              <p className="text-gray-400 text-sm mb-4 leading-relaxed group-hover:text-gray-300 transition-colors">
                {service.description}
              </p>
              <button 
                style={{ zIndex: 10, position: 'relative' }}
                onClick={() => handleServiceClick(service.title)}
                className={`resolve-btn block w-full px-4 py-2 rounded-lg bg-gradient-to-r ${service.gradient} font-medium text-white hover:shadow-lg hover:shadow-blue-500/20 transition-all transform hover:scale-105 active:scale-95`}
              >
                Resolve
              </button>
              <div className={`absolute inset-0 z-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r ${service.glowGradient}`}></div>
            </div>
          ))}
        </div>

        {/* Status Display */}
        {selectedService && (
          <div className="mt-8 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg text-center">
            <p className="text-blue-300">
              Selected Service: <span className="font-semibold text-white">{selectedService}</span>
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Click any service button to connect and resolve your issue
            </p>
          </div>
        )}
      </div>
    </section>
  );
}