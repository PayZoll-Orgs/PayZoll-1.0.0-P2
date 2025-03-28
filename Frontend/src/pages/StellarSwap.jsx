import { useState, useEffect } from 'react';
import * as StellarSdk from "@stellar/stellar-sdk";
import { useAccount } from '@/hooks/useAccount';
import { signTransaction } from '@stellar/freighter-api';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Coins, ArrowRightLeft, Wallet, Sparkles } from 'lucide-react';

const USDC_TO_XLM_RATE = 0.88;
const MAX_USDC_AMOUNT = 100;
const HORIZON_URL = 'https://horizon-testnet.stellar.org';
const SERVICE_CONTRACT_ADDRESS = 'GBDY7MPNHO7CB3GTI632X2WMTA5GS4YTKKEJBTGDBFJALCUKGLA2PETK';
const API_URL = 'https://payzoll-1-0-0-p2-backend-stellar.onrender.com';

const floatingCoinVariants = {
    animate: {
        y: [0, -20, 0],
        rotate: [0, 5, 0],
        transition: {
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }
};

const pageTransition = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.5 }
};

export default function StellarSwap() {
    const { address } = useAccount();
    const navigate = useNavigate();
    const [recipient, setRecipient] = useState('');
    const [usdcAmount, setUsdcAmount] = useState('');
    const [xlmNeeded, setXlmNeeded] = useState(0);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');
    const [statusType, setStatusType] = useState('default');
    const [step, setStep] = useState(0);
    const [isInitialRender, setIsInitialRender] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        setIsInitialRender(false);
    }, []);

    const calculateXlm = (amount) => {
        const value = (parseFloat(amount || '0') / USDC_TO_XLM_RATE).toFixed(2);
        setXlmNeeded(parseFloat(value));
    };

    const resetForm = () => {
        setRecipient('');
        setUsdcAmount('');
        setXlmNeeded(0);
        setStatus('');
        setStatusType('default');
        setStep(0);
        setLoading(false);
    };

    const sendXlmFromUser = async () => {
        setLoading(true);
        setStatus('Starting transaction');
        setStatusType('default');
        setStep(1);

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            setStatus('Building transaction');
            await new Promise(resolve => setTimeout(resolve, 1500));
            setStatus('Sending XLM to service contract');

            const server = new StellarSdk.Horizon.Server(HORIZON_URL);
            const sourceAccount = await server.loadAccount(address || '');

            if (!StellarSdk.StrKey.isValidEd25519PublicKey(recipient)) {
                throw new Error('Invalid recipient address');
            }

            const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
                fee: StellarSdk.BASE_FEE,
                networkPassphrase: StellarSdk.Networks.TESTNET,
            })
                .addOperation(StellarSdk.Operation.payment({
                    destination: SERVICE_CONTRACT_ADDRESS,
                    asset: StellarSdk.Asset.native(),
                    amount: xlmNeeded.toFixed(7),
                }))
                .setTimeout(30)
                .build();

            const signedXdr = await signTransaction(
                transaction.toXDR(),
                { networkPassphrase: StellarSdk.Networks.TESTNET }
            );

            const response = await server.submitTransaction(
                StellarSdk.TransactionBuilder.fromXDR(
                    signedXdr.signedTxXdr,
                    StellarSdk.Networks.TESTNET
                )
            );

            setStatus(`XLM transaction successful! Hash: ${response}`);
            setStatusType('success');
            setStep(2);

            await sendUsdcFromUser();

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.error('Transaction failed:', error);
            setStatus(`Error: ${errorMessage}`);
            setStatusType('error');
            setStep(0);
        } finally {
            setLoading(false);
        }
    };

    const sendUsdcFromUser = async () => {
        setLoading(true);
        setStatus('Initiating USDC transfer');
        setStatusType('default');

        try {
            await new Promise(resolve => setTimeout(resolve, 2000));

            const response = await fetch(`${API_URL}/stellar/transfer/usdc`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    recipient,
                    amount: usdcAmount
                })
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Transfer failed');
            }

            setStatus(`USDC transfer successful! Hash: ${data.transaction.hash}`);
            setStatusType('success');
            setStep(3);

            // Replace the refresh logic with reset timer
            setTimeout(() => {
                setStatus('Transaction complete! Starting new session...');
                setTimeout(() => {
                    resetForm();
                }, 1000);
            }, 4000);

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            setStatus(`Error: ${errorMessage}`);
            setStatusType('error');
        } finally {
            setLoading(false);
        }
    };

    const truncateAddress = (addr) => {
        if (!addr) return '';
        return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
    };

    const copyToClipboard = () => {
        if (address) {
            navigator.clipboard.writeText(address);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15
            }
        }
    };

    const glowVariants = {
        initial: { opacity: 0.5 },
        animate: {
            opacity: [0.5, 1, 0.5],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    return (
        <motion.div
            className="min-h-screen bg-gradient-to-b from-gray-900 to-black relative overflow-hidden"
            variants={pageTransition}
            initial="initial"
            animate="animate"
            exit="exit"
        >
            {/* Background elements stay the same */}
            <div className="absolute inset-0">
                {/* Grid and floating coins as before */}
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
                {[...Array(12)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute opacity-10"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        variants={floatingCoinVariants}
                        animate="animate"
                    >
                        <Coins className={`w-${Math.random() * 8 + 4} h-${Math.random() * 8 + 4} text-blue-500`} />
                    </motion.div>
                ))}
            </div>

            {/* Main Content - Improved Layout */}
            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-10">
                {/* More compact header */}
                <motion.div
                    className="text-center mb-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div
                        className="inline-flex items-center justify-center space-x-2 mb-4 px-5 py-2 rounded-full bg-blue-500/10 border border-blue-500/20"
                        variants={itemVariants}
                    >
                        <Sparkles className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-400 font-medium">Stellar Network</span>
                    </motion.div>

                    <motion.div variants={itemVariants} className="flex items-center justify-center space-x-6 mb-6">
                        <div className="relative">
                            <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20 blur-lg animate-pulse" />
                            <Wallet className="w-16 h-16 text-blue-400 relative" />
                        </div>
                        <motion.h1
                            className="text-5xl font-bold text-white leading-tight"
                        >
                            PayZoll{' '}
                            <span className="relative">
                                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                                    Gateway
                                </span>
                                <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 opacity-50" />
                            </span>
                        </motion.h1>
                    </motion.div>
                </motion.div>

                {/* Transfer Card - Enhanced Layout */}
                <motion.div
                    className="w-full max-w-5xl relative"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="relative bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-gray-800/50 shadow-2xl overflow-hidden">
                        {/* Card Header */}
                        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-6 border-b border-gray-800/50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <ArrowRightLeft className="w-5 h-5 text-blue-400" />
                                    <h2 className="text-xl font-semibold text-white">Pay USDC using XLM</h2>
                                </div>
                                {address ? (
                                    <div className="bg-green-900/20 px-3 py-1 rounded-full border border-green-500/30">
                                        <span className="text-green-400 text-sm">Connected</span>
                                    </div>
                                ) : (
                                    <div className="bg-red-900/20 px-3 py-1 rounded-full border border-red-500/30">
                                        <span className="text-red-400 text-sm">Not Connected</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {address && (
                            <div className="px-6 py-3 bg-gray-900/40 border-b border-gray-800/50 flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                    <span className="text-sm text-gray-400">Connected:</span>
                                    <span className="text-sm font-mono text-white">{truncateAddress(address)}</span>
                                </div>
                                <motion.button
                                    onClick={copyToClipboard}
                                    whileTap={{ scale: 0.95 }}
                                    className="text-xs text-blue-400 hover:text-blue-300 bg-blue-900/20 border border-blue-700/30 rounded-md px-2 py-1 transition-colors flex items-center space-x-1"
                                >
                                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
                                    </svg>
                                </motion.button>
                            </div>
                        )}

                        {/* Form Content */}
                        <div className="p-6 space-y-6">
                            <motion.div variants={itemVariants} className="space-y-4">
                                {/* Recipient Input */}
                                <div className="group">
                                    <label className="flex items-center justify-between text-sm mb-2">
                                        <span className="font-medium text-gray-300">Recipient Address</span>
                                        {recipient && (
                                            <span
                                                className="text-xs text-blue-400 cursor-pointer hover:underline"
                                                onClick={() => setRecipient('')}
                                            >
                                                Clear
                                            </span>
                                        )}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Enter Stellar address (G...)"
                                            className="w-full p-4 bg-gray-800/30 rounded-xl border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/25 transition-all outline-none"
                                            value={recipient}
                                            onChange={(e) => setRecipient(e.target.value)}
                                            disabled={loading}
                                        />
                                        <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </div>

                                {/* USDC Amount */}
                                <div className="group">
                                    <div className="flex justify-between mb-2">
                                        <label className="text-sm font-medium text-gray-300">
                                            USDC Amount
                                        </label>
                                        <span className="text-xs text-blue-400">Max: {MAX_USDC_AMOUNT} USDC</span>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            placeholder="0.00"
                                            className="w-full p-4 bg-gray-800/30 rounded-xl border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/25 transition-all outline-none pr-16 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            value={usdcAmount}
                                            onChange={(e) => {
                                                setUsdcAmount(e.target.value);
                                                calculateXlm(e.target.value);
                                            }}
                                            max={MAX_USDC_AMOUNT}
                                            step="0.01"
                                            disabled={loading}
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center px-4">
                                            <span className="text-gray-400">USDC</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* XLM Calculation Display */}
                            <AnimatePresence>
                                {xlmNeeded > 0 && (
                                    <motion.div
                                        variants={itemVariants}
                                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                        className="bg-blue-900/20 rounded-xl p-4 border border-blue-800/50 backdrop-blur-sm"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <span className="text-gray-300 text-sm">You will pay:</span>
                                                <span className="block text-xl font-medium text-white">
                                                    {xlmNeeded.toFixed(2)} <span className="text-blue-400">XLM</span>
                                                </span>
                                            </div>
                                            <div className="h-10 w-[1px] bg-blue-800/50"></div>
                                            <div className="text-right">
                                                <span className="block text-sm text-gray-300">Exchange Rate</span>
                                                <span className="block text-blue-300">1 USDC = {USDC_TO_XLM_RATE} XLM</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Status Messages */}
                            <AnimatePresence>
                                {status && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                        className={`p-3 rounded-xl ${statusType === 'success' ? 'bg-green-900/20 border border-green-800/50' :
                                            statusType === 'error' ? 'bg-red-900/20 border border-red-800/50' :
                                                'bg-gray-800/30 border border-gray-700/50'
                                            }`}
                                    >
                                        <div className="flex items-start space-x-3">
                                            <div className={`p-1 rounded-full ${statusType === 'success' ? 'bg-green-500/80' :
                                                statusType === 'error' ? 'bg-red-500/80' :
                                                    'bg-blue-500/80'
                                                }`}>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                    className="w-4 h-4"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12zm-1-5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm0-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <p className={`text-sm font-medium ${statusType === 'success' ? 'text-green-400' :
                                                    statusType === 'error' ? 'text-red-400' :
                                                        'text-blue-400'
                                                    }`}>
                                                    {statusType === 'success' ? 'Success' :
                                                        statusType === 'error' ? 'Error' :
                                                            'Processing'}
                                                </p>
                                                <p className="text-gray-300 text-xs break-all mt-0.5">{status}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Action Button */}
                            <motion.div variants={itemVariants}>
                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    onClick={sendXlmFromUser}
                                    disabled={loading || !recipient || !usdcAmount || parseFloat(usdcAmount) <= 0}
                                    className={`w-full p-4 rounded-xl font-medium transition-all duration-200 
                                        ${loading || !recipient || !usdcAmount || parseFloat(usdcAmount) <= 0
                                            ? 'bg-gray-700/80 cursor-not-allowed opacity-70'
                                            : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 shadow-lg hover:shadow-blue-500/25'
                                        }`}
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center space-x-2">
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                            />
                                            <span>Processing Transaction...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center space-x-2">
                                            <ArrowRightLeft className="w-4 h-4" />
                                            <span>Pay with XLM</span>
                                        </div>
                                    )}
                                </motion.button>
                            </motion.div>
                        </div>

                        {/* Footer with rate information */}
                        <div className="bg-gray-900/60 px-6 py-3 border-t border-gray-800/50">
                            <div className="flex items-center justify-between text-xs text-gray-400">
                                <span>Powered by Stellar Network</span>
                                <a href="https://stellar.org" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">
                                    Learn More
                                </a>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="mt-8">
                    <div className="flex justify-center items-center space-x-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex flex-col items-center space-y-2">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${step >= i
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-800 text-gray-400 border border-gray-700'
                                        }`}
                                >
                                    {i}
                                </div>
                                <span className={`text-xs ${step >= i ? 'text-blue-400' : 'text-gray-500'}`}>
                                    {i === 1 ? 'Pay XLM' : i === 2 ? '....Confirm' : 'Get USDC'}
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Animation styles remain the same */}
            <style jsx>{`
                @keyframes gradientMove {
                    0% { background-position: 0 0; }
                    100% { background-position: 40px 40px; }
                }
            `}</style>
        </motion.div>
    );
}