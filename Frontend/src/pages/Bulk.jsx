import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CHAINS } from '../constant/chain';
import { useWeb3 } from '../context/useWeb3';

// Define native token placeholder (using zero address)
const NATIVE_TOKEN_ADDRESS = "0x0000000000000000000000000000000000000000";

function Bulk() {
    const [recipients, setRecipients] = useState("");
    const [amounts, setAmounts] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const {
        account,
        selectedChain,
        selectedToken,
        notification,
        switchNetwork,
        handleTokenChange,
        addTokenToWallet,
        sendBulkTransfer
    } = useWeb3();

    const onChainChange = async (e) => {
        e.preventDefault();
        await switchNetwork(parseInt(e.target.value));
    };

    const onTokenChange = (e) => {
        handleTokenChange(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const recipientList = recipients.split(",").map(item => item.trim());
            const amountList = amounts.split(",").map(item => item.trim());
            const result = await sendBulkTransfer(recipientList, amountList);

            if (result && result.success) {
                setRecipients("");
                setAmounts("");
            }
        } catch (error) {
            console.error("Form submission error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0F1C] py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="max-w-4xl mx-auto"
            >
                <div className="text-center mb-12">
                    <motion.h1
                        className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-400"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        Bulk Transfer Dashboard
                    </motion.h1>
                    <motion.p
                        className="mt-3 text-gray-400"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        Execute multiple transfers in a single transaction
                    </motion.p>
                </div>

                <motion.div
                    className="bg-[#111827] rounded-2xl shadow-xl border border-gray-800"
                    variants={fadeInUp}
                >
                    {notification.show && (
                        <motion.div
                            className={`p-4 ${notification.type === 'error'
                                    ? 'bg-red-900/30 text-red-300 border-red-700'
                                    : notification.type === 'info'
                                        ? 'bg-blue-900/30 text-blue-300 border-blue-700'
                                        : 'bg-green-900/30 text-green-300 border-green-700'
                                } rounded-t-2xl border-b`}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                        >
                            {notification.message}
                        </motion.div>
                    )}

                    <div className="p-8">
                        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
                            {account && (
                                <motion.div
                                    variants={fadeInUp}
                                    className="mb-8 p-4 bg-[#1C2333] rounded-xl border border-gray-800"
                                >
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                        <span className="text-gray-400">Connected Wallet:</span>
                                        <span className="font-mono text-violet-400">
                                            {account.substring(0, 6)}...{account.substring(account.length - 4)}
                                        </span>
                                    </div>
                                </motion.div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <motion.div variants={fadeInUp} className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-300">Network</label>
                                    <select
                                        value={selectedChain?.chainId}
                                        onChange={onChainChange}
                                        className="w-full px-4 py-3 bg-[#1C2333] border border-gray-800 rounded-xl text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                                    >
                                        {CHAINS.map(chain => (
                                            <option key={chain.chainId} value={chain.chainId}>
                                                {chain.name}
                                            </option>
                                        ))}
                                    </select>
                                </motion.div>

                                <motion.div variants={fadeInUp} className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-300">Token</label>
                                    <div className="flex space-x-2">
                                        <select
                                            value={selectedToken?.address}
                                            onChange={onTokenChange}
                                            className="flex-grow px-4 py-3 bg-[#1C2333] border border-gray-800 rounded-xl text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                                        >
                                            {selectedChain?.tokens.map(token => (
                                                <option key={token.address} value={token.address}>
                                                    {token.symbol} {token.name ? `- ${token.name}` : ''}
                                                </option>
                                            ))}
                                        </select>

                                        {selectedToken?.address !== NATIVE_TOKEN_ADDRESS && (
                                            <motion.button
                                                type="button"
                                                onClick={() => addTokenToWallet()}
                                                className="px-4 py-3 bg-violet-600 hover:bg-violet-700 rounded-xl text-white font-medium transition-colors duration-200"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                Add Token
                                            </motion.button>
                                        )}
                                    </div>
                                </motion.div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <motion.div variants={fadeInUp} className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-300">
                                        Recipient Addresses <span className="text-xs text-gray-500">(comma separated)</span>
                                    </label>
                                    <textarea
                                        value={recipients}
                                        onChange={(e) => setRecipients(e.target.value)}
                                        rows="3"
                                        className="w-full px-4 py-3 bg-[#1C2333] border border-gray-800 rounded-xl text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                                        placeholder="0xabc..., 0xdef..., ..."
                                        required
                                    />
                                </motion.div>

                                <motion.div variants={fadeInUp} className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-300">
                                        Amounts <span className="text-xs text-gray-500">(comma separated)</span>
                                    </label>
                                    <textarea
                                        value={amounts}
                                        onChange={(e) => setAmounts(e.target.value)}
                                        rows="3"
                                        className="w-full px-4 py-3 bg-[#1C2333] border border-gray-800 rounded-xl text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                                        placeholder="1.0, 2.5, ..."
                                        required
                                    />
                                    <div className="text-xs text-gray-500">
                                        Token decimals: {selectedToken?.decimals || 18}
                                    </div>
                                </motion.div>

                                <motion.div variants={fadeInUp}>
                                    <button
                                        type="submit"
                                        disabled={isLoading || !account}
                                        className={`w-full py-4 px-6 rounded-xl font-medium text-white 
                                            ${isLoading || !account
                                                ? 'bg-gray-700 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700'
                                            } transition-all duration-200 transform hover:scale-[1.02]`}
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center justify-center space-x-2">
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                <span>Processing...</span>
                                            </div>
                                        ) : !account ? 'Connect Wallet to Continue' : 'Execute Bulk Transfer'}
                                    </button>
                                </motion.div>
                            </form>
                        </motion.div>
                    </div>
                </motion.div>

                <motion.div
                    className="mt-8 text-center text-gray-500 text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    Powered by secure smart contract technology
                </motion.div>
            </motion.div>
        </div>
    );
}

export default Bulk;