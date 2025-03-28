import React, { useEffect, useState } from 'react';
import { Coins, ArrowRightLeft, Users, Wallet, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

function StellarIntro() {
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        // Show content with delay
        setTimeout(() => setShowContent(true), 500);
    }, []);


    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0">
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `
                            linear-gradient(to right, rgba(99, 102, 241, 0.1) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(99, 102, 241, 0.1) 1px, transparent 1px)
                        `,
                        backgroundSize: '40px 40px',
                        animation: 'gradientMove 20s linear infinite'
                    }}
                />

                {/* Floating coins */}
                {[...Array(12)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute opacity-10"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animation: `float ${Math.random() * 10 + 10}s linear infinite`
                        }}
                    >
                        <Coins className={`w-${Math.random() * 8 + 4} h-${Math.random() * 8 + 4} text-blue-500`} />
                    </div>
                ))}
            </div>

            {/* Gradient orb */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
            </div>

            <div className={`relative z-10 min-h-screen flex items-center justify-center transition-opacity duration-1000 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
                <div className="text-center px-4">
                    <div className="inline-flex items-center justify-center space-x-2 mb-8 px-6 py-3 rounded-full bg-blue-500/10 border border-blue-500/20">
                        <Sparkles className="w-5 h-5 text-blue-400" />
                        <span className="text-blue-400 font-medium">Stellar Payments</span>
                    </div>

                    <div className="mb-12 relative">
                        <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20 blur-lg animate-pulse" />
                        <Wallet className="w-24 h-24 mx-auto text-blue-400 relative animate-bounce" />
                    </div>

                    <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
                        Next-Gen{' '}
                        <span className="relative">
                            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                                Stellar Payments
                            </span>
                            <span className="absolute -bottom-2 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 opacity-50" />
                        </span>
                    </h1>

                    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
                        Fast, secure, and efficient blockchain payments powered by Stellar Network.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
                        {/* Bulk Transfer */}
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-200" />
                            <div className="relative p-6 bg-gray-900/90 rounded-lg border border-blue-500/20 backdrop-blur-sm">
                                <Users className="w-12 h-12 text-blue-400 mb-4 mx-auto" />
                                <h3 className="text-lg font-semibold text-white mb-2">Bulk Transfer</h3>
                                <p className="text-gray-400 text-sm">Send XLM or USDC to multiple recipients in one transaction</p>
                            </div>
                        </div>

                        {/* P2P Transfer */}
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-200" />
                            <div className="relative p-6 bg-gray-900/90 rounded-lg border border-purple-500/20 backdrop-blur-sm">
                                <ArrowRightLeft className="w-12 h-12 text-purple-400 mb-4 mx-auto" />
                                <h3 className="text-lg font-semibold text-white mb-2">P2P Transfer</h3>
                                <p className="text-gray-400 text-sm">Direct peer-to-peer transfers of XLM and USDC</p>
                            </div>
                        </div>

                        {/* Swap Pay */}
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-200" />
                            <div className="relative p-6 bg-gray-900/90 rounded-lg border border-indigo-500/20 backdrop-blur-sm">
                                <Coins className="w-12 h-12 text-indigo-400 mb-4 mx-auto" />
                                <h3 className="text-lg font-semibold text-white mb-2">Swap Pay</h3>
                                <p className="text-gray-400 text-sm">Pay in USDC using XLM with automatic swap</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative inline-block m-4">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur animate-pulse" />
                        <Link to="/stellar-bulk">
                            <button className="relative px-8 py-4 bg-blue-500/20 rounded-lg backdrop-blur-sm border border-blue-500/30 text-white font-medium hover:bg-blue-500/30 transition duration-200">
                                Bulk Payroll
                            </button>
                        </Link>
                    </div>

                    <div className="relative inline-block m-4">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur animate-pulse" />
                        <Link to="/stellar-swap">
                            <button className="relative px-8 py-4 bg-blue-500/20 rounded-lg backdrop-blur-sm border border-blue-500/30 text-white font-medium hover:bg-blue-500/30 transition duration-200">
                                Swap Pay
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(5deg); }
                }

                @keyframes gradientMove {
                    0% { background-position: 0 0; }
                    100% { background-position: 40px 40px; }
                }
            `}</style>
        </div>
    );
}

export default StellarIntro;