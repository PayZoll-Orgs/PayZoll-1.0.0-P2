import React, { useState, useRef, useEffect } from 'react'; // Add useEffect import
import { ethers } from 'ethers';
import { CHAINS } from '../constant/chain';
import { motion } from 'framer-motion';

// Minimal ABI for our bulkTransfer function
const bulkPayrollAbi = [
    "function bulkTransfer(address token, address[] calldata recipients, uint256[] calldata amounts) external payable"
];

// Minimal ABI for ERC20 functions (allowance, approve, balanceOf)
const tokenAbi = [
    "function allowance(address owner, address spender) view returns (uint256)",
    "function approve(address spender, uint256 amount) returns (bool)",
    "function balanceOf(address owner) view returns (uint256)"
];

// Define native token placeholder (using zero address)
const NATIVE_TOKEN_ADDRESS = "0x0000000000000000000000000000000000000000";

function Bulk() {
    const [selectedChain, setSelectedChain] = useState(CHAINS[0]);
    const [selectedToken, setSelectedToken] = useState(CHAINS[0].tokens[0]);
    const [recipients, setRecipients] = useState("");
    const [amounts, setAmounts] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState({ show: false, type: '', message: '' });
    // Add this ref to track network switching
    const isSwitchingNetwork = useRef(false);

    // Add this useEffect to handle MetaMask events
    useEffect(() => {
        // Handle chain changes in MetaMask
        const handleChainChanged = (chainId) => {
            // Convert to decimal
            const decimalChainId = parseInt(chainId, 16);
            console.log("MetaMask chain changed to:", decimalChainId);

            // Find and set the chain
            const chain = CHAINS.find(c => c.chainId === decimalChainId);
            if (chain) {
                setSelectedChain(chain);
                setSelectedToken(chain.tokens[0]);
                showNotification('info', `Connected to ${chain.name}`);
            }
        };

        // Add MetaMask event listeners
        if (window.ethereum) {
            window.ethereum.on('chainChanged', handleChainChanged);
        }

        // Clean up listeners
        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener('chainChanged', handleChainChanged);
            }
        };
    }, []);

    // Handle chain selection change
    const handleChainChange = async (e) => {
        // Prevent form submission
        e.preventDefault();

        // Prevent multiple simultaneous network switching attempts
        if (isSwitchingNetwork.current) return;

        try {
            isSwitchingNetwork.current = true;

            const chainId = parseInt(e.target.value);
            const chain = CHAINS.find(c => c.chainId === chainId);

            // First update the UI to show the selected network
            setSelectedChain(chain);
            setSelectedToken(chain.tokens[0]);

            // Then request MetaMask to switch networks
            if (window.ethereum) {
                try {
                    const hexChainId = `0x${chainId.toString(16)}`;

                    await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: hexChainId }],
                    });

                    showNotification('success', `Switched to ${chain.name}`);
                } catch (switchError) {
                    // This error code indicates that the chain has not been added to MetaMask
                    if (switchError.code === 4902) {
                        try {
                            await window.ethereum.request({
                                method: 'wallet_addEthereumChain',
                                params: [
                                    {
                                        chainId: `0x${chainId.toString(16)}`,
                                        chainName: chain.name,
                                        nativeCurrency: {
                                            name: chain.nativeCurrency?.name || chain.symbol,
                                            symbol: chain.nativeCurrency?.symbol || chain.symbol,
                                            decimals: chain.nativeCurrency?.decimals || 18
                                        },
                                        rpcUrls: [chain.rpcUrl],
                                        blockExplorerUrls: chain.blockExplorer ? [chain.blockExplorer] : undefined
                                    },
                                ],
                            });
                            showNotification('success', `Added and switched to ${chain.name}`);
                        } catch (addError) {
                            console.error("Error adding chain:", addError);
                            showNotification('error', `Failed to add ${chain.name} network to MetaMask`);
                        }
                    } else {
                        console.error("Error switching chain:", switchError);
                        showNotification('error', `Failed to switch to ${chain.name} network`);
                    }
                }
            }
        } catch (error) {
            console.error("Chain change error:", error);
            showNotification('error', 'Error switching networks');
        } finally {
            isSwitchingNetwork.current = false;
        }
    };

    // Handle token selection change
    const handleTokenChange = (e) => {
        const token = selectedChain.tokens.find(t => t.address === e.target.value);
        setSelectedToken(token);
    };

    // Add this function after your handleTokenChange function
    const addTokenToWallet = async () => {
        if (!window.ethereum) {
            showNotification('error', 'MetaMask not detected');
            return;
        }

        // Skip for native tokens (which use the zero address)
        if (selectedToken.address === NATIVE_TOKEN_ADDRESS) {
            showNotification('info', `${selectedToken.symbol} is a native token and already in your wallet`);
            return;
        }

        try {
            // Request to add the token to user's wallet
            const wasAdded = await window.ethereum.request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20',
                    options: {
                        address: selectedToken.address,
                        symbol: selectedToken.symbol,
                        decimals: selectedToken.decimals || 18,
                        // You could add an image URL if available in your token data
                        // image: selectedToken.imageUrl
                    },
                },
            });

            if (wasAdded) {
                showNotification('success', `${selectedToken.symbol} added to your wallet!`);
            } else {
                showNotification('info', 'Token was not added to your wallet');
            }
        } catch (error) {
            console.error('Error adding token to wallet:', error);
            showNotification('error', 'Failed to add token to wallet');
        }
    };

    // Display notification
    const showNotification = (type, message) => {
        setNotification({ show: true, type, message });
        setTimeout(() => setNotification({ show: false, type: '', message: '' }), 5000);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Split comma-separated values for recipients and amounts
            const recipientList = recipients.split(",").map(item => item.trim());
            const amountList = amounts.split(",").map(item => item.trim());

            if (recipientList.length !== amountList.length) {
                throw new Error("Recipients and amounts length mismatch!");
            }

            // Convert amounts to BigNumbers using token decimals (default to 18)
            const decimals = selectedToken.decimals || 18;
            const parsedAmounts = amountList.map(a => ethers.parseUnits(a, decimals));

            // Sum up total amounts using native BigInt instead of BigNumber
            const totalAmount = parsedAmounts.reduce((acc, curr) => acc + BigInt(curr), BigInt(0));

            // Request wallet connection (MetaMask)
            if (!window.ethereum) {
                throw new Error("No Ethereum wallet detected. Please install MetaMask.");
            }
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            // Ensure the wallet is connected to the selected chain
            const network = await provider.getNetwork();
            if (network.chainId !== BigInt(selectedChain.chainId)) {
                throw new Error(`Please switch to ${selectedChain.name} in your wallet.`);
            }

            // Instantiate the BulkPayroll contract with the deployed address for the selected chain
            const contract = new ethers.Contract(selectedChain.contractAddress, bulkPayrollAbi, signer);

            let tx;
            // Check if the selected token is native (address equals zero address)
            if (selectedToken.address === NATIVE_TOKEN_ADDRESS) {
                // For native token transfers, no approval is required.
                // Pass the total native token value as msg.value.
                tx = await contract.bulkTransfer(selectedToken.address, recipientList, parsedAmounts, {
                    value: totalAmount
                });
            } else {
                // For ERC20 transfers
                const tokenContract = new ethers.Contract(selectedToken.address, tokenAbi, signer);
                const owner = await signer.getAddress();
                const allowance = await tokenContract.allowance(owner, selectedChain.contractAddress);
                const balance = await tokenContract.balanceOf(owner);

                // BigInt comparisons instead of .lt()
                if (BigInt(balance) < totalAmount) {
                    throw new Error("Insufficient token balance for the transfer.");
                }

                if (BigInt(allowance) < totalAmount) {
                    showNotification('info', 'Insufficient allowance. Sending approval transaction...');
                    const approveTx = await tokenContract.approve(selectedChain.contractAddress, totalAmount);
                    showNotification('info', `Approval tx sent: ${approveTx.hash.substring(0, 10)}...`);
                    await approveTx.wait();
                    showNotification('success', 'Approval successful!');
                }

                // Gas estimation with BigInt
                let gasEstimate;
                try {
                    gasEstimate = await contract.estimateGas.bulkTransfer(selectedToken.address, recipientList, parsedAmounts);
                    gasEstimate = gasEstimate * BigInt(2);  // Double gas estimate
                } catch (gasError) {
                    console.error("Gas estimation failed:", gasError);
                    throw new Error("Gas estimation failed. Check the recipient addresses and amounts.");
                }

                tx = await contract.bulkTransfer(selectedToken.address, recipientList, parsedAmounts, { gasLimit: gasEstimate });
            }

            showNotification('success', `Bulk transfer tx sent: ${tx.hash.substring(0, 10)}...${tx.hash.substring(tx.hash.length - 6)}`);
            await tx.wait();
            showNotification('success', "Bulk transfer complete!");

            // Clear form after successful transaction
            setRecipients("");
            setAmounts("");
        } catch (error) {
            console.error("Error during bulk transfer", error);
            showNotification('error', error.message || "Transaction failed.");
        } finally {
            setIsLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 120 }
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                className="max-w-3xl mx-auto bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="bg-gradient-to-r from-purple-900 to-indigo-800 py-6 px-8">
                    <h2 className="text-2xl font-bold text-white">Bulk Payroll Transfer</h2>
                    <p className="text-purple-200 mt-1">Send tokens to multiple recipients in a single transaction</p>
                </div>

                <div className="p-8">
                    {notification.show && (
                        <motion.div
                            className={`mb-6 p-4 rounded-md ${notification.type === 'error' ? 'bg-red-900 bg-opacity-30 text-red-300 border border-red-700' : 'bg-green-900 bg-opacity-30 text-green-300 border border-green-700'}`}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                        >
                            {notification.message}
                        </motion.div>
                    )}

                    <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Blockchain Network</label>
                            <select
                                value={selectedChain.chainId}
                                onChange={handleChainChange}
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white focus:ring-purple-500 focus:border-purple-500"
                            >
                                {CHAINS.map(chain => (
                                    <option key={chain.chainId} value={chain.chainId}>
                                        {chain.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Token</label>
                            <div className="flex space-x-2">
                                <select
                                    value={selectedToken.address}
                                    onChange={handleTokenChange}
                                    className="flex-grow px-4 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white focus:ring-purple-500 focus:border-purple-500"
                                >
                                    {selectedChain.tokens.map(token => (
                                        <option key={token.address} value={token.address}>
                                            {token.symbol} {token.name ? `- ${token.name}` : ''}
                                        </option>
                                    ))}
                                </select>

                                {/* Only show the Add to Wallet button for non-native tokens */}
                                {selectedToken.address !== NATIVE_TOKEN_ADDRESS && (
                                    <motion.button
                                        type="button"
                                        onClick={addTokenToWallet}
                                        className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white text-sm font-medium"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        title="Add token to MetaMask"
                                    >
                                        Add to Wallet
                                    </motion.button>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    <form onSubmit={handleSubmit}>
                        <motion.div
                            className="space-y-6"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.div variants={itemVariants}>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Recipient Addresses <span className="text-xs text-gray-400">(comma separated)</span>
                                </label>
                                <textarea
                                    value={recipients}
                                    onChange={(e) => setRecipients(e.target.value)}
                                    rows="3"
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white focus:ring-purple-500 focus:border-purple-500"
                                    placeholder="0xabc..., 0xdef..., ..."
                                    required
                                />
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Amounts <span className="text-xs text-gray-400">(comma separated)</span>
                                </label>
                                <textarea
                                    value={amounts}
                                    onChange={(e) => setAmounts(e.target.value)}
                                    rows="3"
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white focus:ring-purple-500 focus:border-purple-500"
                                    placeholder="1.0, 2.5, ..."
                                    required
                                />
                                <div className="mt-1 text-xs text-gray-400">
                                    Token decimals: {selectedToken.decimals || 18}
                                </div>
                            </motion.div>

                            <motion.div
                                variants={itemVariants}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </>
                                    ) : 'Submit Bulk Transfer'}
                                </button>
                            </motion.div>
                        </motion.div>
                    </form>
                </div>
            </motion.div>

            <motion.div
                className="max-w-3xl mx-auto mt-6 text-center text-gray-500 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                Secure blockchain transactions powered by smart contracts
            </motion.div>
        </div>
    );
}

export default Bulk;
