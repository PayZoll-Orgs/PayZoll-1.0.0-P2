import React, { useState, useEffect } from 'react';
import BigNumber from 'bignumber.js';
import { signTransaction } from '@stellar/freighter-api';
import { useAccount } from '@/hooks/useAccount';
import { Networks } from 'stellar-sdk';
import { Client } from '@stellar/stellar-sdk/contract';
import { Coins, ArrowRightLeft, Users, Wallet, Sparkles, Plus, X, Check, AlertTriangle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Constants remain the same
const RPC_URL = "https://soroban-testnet.stellar.org/";
const CONTRACT_ADDRESS = 'CAAX52OHYPSYCUFTEO4FHQL345SYQD6D7JAGSPOFNMXXQJXO6DAHN3QR';
const WASM_HASH = "0ebde7a3d59aa065fb48d9cb48922abab601783216b9733f74071b441bb16a2a";
const TOKEN_IDS = {
    native: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC',
    usdc: 'CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA'
};
const DECIMALS = 7;

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
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
            stiffness: 100
        }
    }
};

export default function StellarBulk() {
    const { address } = useAccount();
    const [selectedToken, setSelectedToken] = useState('native');
    const [recipients, setRecipients] = useState([{ recipient: '', amount: '' }]);
    const [status, setStatus] = useState('');
    const [statusType, setStatusType] = useState('default'); // 'default', 'success', 'error'
    const [isProcessing, setIsProcessing] = useState(false);
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        // Show content with delay for entrance animation
        setTimeout(() => setShowContent(true), 500);
    }, []);

    const submitTransfer = async () => {
        // Validate inputs
        if (!address) {
            setStatus('Wallet not connected');
            setStatusType('error');
            return;
        }

        if (recipients.some(r => !r.recipient || !r.amount)) {
            setStatus('Please fill in all recipient addresses and amounts');
            setStatusType('error');
            return;
        }

        if (recipients.some(r => parseFloat(r.amount) <= 0)) {
            setStatus('All amounts must be greater than 0');
            setStatusType('error');
            return;
        }

        setIsProcessing(true);
        setStatus('Processing transaction...');
        setStatusType('default');

        try {
            // Instantiate a client for the deployed contract using the Soroban SDK
            const client = await Client.from({
                contractId: CONTRACT_ADDRESS,
                networkPassphrase: Networks.TESTNET,
                rpcUrl: RPC_URL,
                wasmHash: WASM_HASH,
                publicKey: address,
                signTransaction, // Using Freighter for signing in the browser
            });

            // Prepare parameters for the bulk_transfer call
            const sender = address;
            const token_id = TOKEN_IDS[selectedToken];
            const recipientsList = recipients.map(r => r.recipient);
            const amountsList = recipients.map(r =>
                new BigNumber(r.amount)
                    .times(new BigNumber(10).pow(DECIMALS))
                    .toFixed(0)
            );

            // Invoke the bulk_transfer function on the contract
            const bulkTransferTx = await client.bulk_transfer({
                sender,
                token_id,
                recipients: recipientsList,
                amounts: amountsList,
            });

            // Sign and send the transaction; this will simulate then execute the contract call
            const { result } = await bulkTransferTx.signAndSend();
            console.log("Bulk transfer result:", result);
            setStatus('Transaction Successful!');
            setStatusType('success');

            // Reset the form after success
            setRecipients([{ recipient: '', amount: '' }]);
        } catch (error) {
            console.error('Transaction Error:', error);
            setStatus(`Error: ${error.message}`);
            setStatusType('error');
        } finally {
            setIsProcessing(false);
        }
    };

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
                    <motion.div
                        key={i}
                        className="absolute opacity-10"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -20, 0],
                            rotate: [0, 5, 0],
                        }}
                        transition={{
                            duration: Math.random() * 5 + 5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <Coins className={`w-${Math.random() * 8 + 4} h-${Math.random() * 8 + 4} text-blue-500`} />
                    </motion.div>
                ))}
            </div>

            {/* Gradient orb */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
            </div>

            <div className={`relative z-10 min-h-screen flex flex-col items-center justify-center py-10 px-4 transition-opacity duration-1000 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
                {/* Header Section */}
                <motion.div
                    className="text-center mb-8"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div
                        className="inline-flex items-center justify-center space-x-2 mb-4 px-5 py-2 rounded-full bg-blue-500/10 border border-blue-500/20"
                        variants={itemVariants}
                    >
                        <Users className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-400 font-medium">Bulk Payments</span>
                    </motion.div>

                    <motion.div variants={itemVariants} className="mb-6">
                        <h1 className="text-5xl font-bold text-white">
                            PayZoll{' '}
                            <span className="relative">
                                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                                    Bulk Transfer
                                </span>
                                <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 opacity-50" />
                            </span>
                        </h1>
                        <p className="mt-2 text-gray-400">Send tokens to multiple recipients in one transaction</p>
                    </motion.div>
                </motion.div>

                {/* Main Content */}
                <motion.div
                    className="w-full max-w-5xl"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Glassmorphic Card */}
                    <div className="relative bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-gray-800/50 shadow-2xl overflow-hidden">
                        {/* Card Header */}
                        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-6 border-b border-gray-800/50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <ArrowRightLeft className="w-5 h-5 text-blue-400" />
                                    <h2 className="text-xl font-semibold text-white">Create Bulk Payment</h2>
                                </div>
                                {address ? (
                                    <div className="bg-green-900/20 px-3 py-1 rounded-full border border-green-500/30">
                                        <span className="text-green-400 text-sm">Wallet Connected</span>
                                    </div>
                                ) : (
                                    <div className="bg-red-900/20 px-3 py-1 rounded-full border border-red-500/30">
                                        <span className="text-red-400 text-sm">Not Connected</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Token Selection */}
                            <motion.div variants={itemVariants} className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300">Select Token</label>
                                <div className="flex space-x-4">
                                    <div
                                        onClick={() => setSelectedToken('native')}
                                        className={`flex-1 flex items-center justify-center space-x-2 p-3 rounded-xl cursor-pointer transition-all ${selectedToken === 'native'
                                                ? 'bg-blue-900/30 border border-blue-500/30'
                                                : 'bg-gray-800/30 border border-gray-700/50 hover:bg-gray-800/50'
                                            }`}
                                    >
                                        <div className="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center">
                                            <Coins className="w-4 h-4 text-blue-400" />
                                        </div>
                                        <span className="font-medium text-white">XLM</span>
                                    </div>

                                    <div
                                        onClick={() => setSelectedToken('usdc')}
                                        className={`flex-1 flex items-center justify-center space-x-2 p-3 rounded-xl cursor-pointer transition-all ${selectedToken === 'usdc'
                                                ? 'bg-blue-900/30 border border-blue-500/30'
                                                : 'bg-gray-800/30 border border-gray-700/50 hover:bg-gray-800/50'
                                            }`}
                                    >
                                        <div className="w-8 h-8 rounded-full bg-green-900/50 flex items-center justify-center">
                                            <span className="text-green-400 font-bold">$</span>
                                        </div>
                                        <span className="font-medium text-white">USDC</span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Recipients List */}
                            <motion.div variants={itemVariants} className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium text-white">Recipients</h3>
                                    <span className="text-xs text-blue-400">{recipients.length} recipient{recipients.length !== 1 ? 's' : ''}</span>
                                </div>

                                <div className="space-y-3 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
                                    <AnimatePresence>
                                        {recipients.map((r, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, x: -10 }}
                                                className="flex gap-3 items-center p-4 bg-gray-800/30 rounded-xl border border-gray-700/50"
                                            >
                                                <div className="w-8 h-8 rounded-full bg-gray-700/50 flex items-center justify-center shrink-0">
                                                    <span className="text-gray-400 font-medium">{i + 1}</span>
                                                </div>

                                                <div className="flex-grow">
                                                    <input
                                                        placeholder="Recipient Address (G...)"
                                                        value={r.recipient}
                                                        onChange={e => {
                                                            const newRecipients = [...recipients];
                                                            newRecipients[i].recipient = e.target.value;
                                                            setRecipients(newRecipients);
                                                        }}
                                                        className="w-full p-2 bg-gray-800/50 rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/25 transition-all outline-none text-white text-sm"
                                                    />
                                                </div>

                                                <div className="w-32">
                                                    <div className="relative">
                                                        <input
                                                            type="number"
                                                            placeholder="Amount"
                                                            value={r.amount}
                                                            onChange={e => {
                                                                const newRecipients = [...recipients];
                                                                newRecipients[i].amount = e.target.value;
                                                                setRecipients(newRecipients);
                                                            }}
                                                            className="w-full p-2 bg-gray-800/50 rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/25 transition-all outline-none text-white text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                        />
                                                        <div className="absolute inset-y-0 right-2 flex items-center">
                                                            <span className="text-gray-400 text-xs">{selectedToken === 'native' ? 'XLM' : 'USDC'}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {recipients.length > 1 && (
                                                    <button
                                                        onClick={() => {
                                                            const newRecipients = [...recipients];
                                                            newRecipients.splice(i, 1);
                                                            setRecipients(newRecipients);
                                                        }}
                                                        className="p-2 rounded-full bg-red-900/20 hover:bg-red-900/40 border border-red-500/20 transition-colors"
                                                    >
                                                        <X className="w-4 h-4 text-red-400" />
                                                    </button>
                                                )}
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>

                                <button
                                    onClick={() => setRecipients([...recipients, { recipient: '', amount: '' }])}
                                    className="w-full p-3 rounded-xl border border-dashed border-blue-500/30 bg-blue-900/10 hover:bg-blue-900/20 text-blue-400 font-medium transition-colors flex items-center justify-center space-x-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Add Recipient</span>
                                </button>
                            </motion.div>

                            {/* Status Message */}
                            <AnimatePresence>
                                {status && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                        className={`p-4 rounded-xl ${statusType === 'success' ? 'bg-green-900/20 border border-green-800/50' :
                                                statusType === 'error' ? 'bg-red-900/20 border border-red-800/50' :
                                                    'bg-gray-800/30 border border-gray-700/50'
                                            }`}
                                    >
                                        <div className="flex items-start space-x-3">
                                            <div className={`p-1.5 rounded-full ${statusType === 'success' ? 'bg-green-500/80' :
                                                    statusType === 'error' ? 'bg-red-500/80' :
                                                        'bg-blue-500/80'
                                                }`}>
                                                {statusType === 'success' ? (
                                                    <Check className="w-4 h-4" />
                                                ) : statusType === 'error' ? (
                                                    <AlertTriangle className="w-4 h-4" />
                                                ) : (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                )}
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

                            {/* Submit Button */}
                            <motion.div variants={itemVariants}>
                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    onClick={submitTransfer}
                                    disabled={isProcessing || !address || recipients.some(r => !r.recipient || !r.amount)}
                                    className={`w-full p-4 rounded-xl font-medium transition-all duration-200 
                                        ${isProcessing || !address || recipients.some(r => !r.recipient || !r.amount)
                                            ? 'bg-gray-700/80 cursor-not-allowed opacity-70'
                                            : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 shadow-lg hover:shadow-blue-500/25'
                                        }`}
                                >
                                    {isProcessing ? (
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
                                            <Users className="w-4 h-4" />
                                            <span>Send Bulk Transfer</span>
                                        </div>
                                    )}
                                </motion.button>
                            </motion.div>
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-900/60 px-6 py-3 border-t border-gray-800/50">
                            <div className="flex items-center justify-between text-xs text-gray-400">
                                <span>Powered by Stellar Soroban</span>
                                <a href="https://stellar.org" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">
                                    Learn More
                                </a>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            <style jsx>{`
                @keyframes gradientMove {
                    0% { background-position: 0 0; }
                    100% { background-position: 40px 40px; }
                }
            `}</style>
        </div>
    );
}
