
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, Copy, Check, Link, RefreshCw, Users, CreditCard } from "lucide-react";

// Dummy employee data (simulating API response)
const dummyEmployeeData = [
    {
        id: 1,
        name: "Abhinav",
        walletAddress: "0xc8c3725539f1074e147874a249ca47473843db6a1625ff0510396fc8576cb131",
        salary: "0.5",
        department: "OG"
    },
];

const AptosBulk = () => {
    const [senderAddress, setSenderAddress] = useState("");
    const [recipients, setRecipients] = useState("");
    const [amounts, setAmounts] = useState("");
    const [transactionHash, setTransactionHash] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);
    const [walletStatus, setWalletStatus] = useState("disconnected");
    // Added states for employees
    const [employees, setEmployees] = useState([]);
    const [selectedEmployees, setSelectedEmployees] = useState({});
    const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);

    // Contract address where your module is deployed
    const DEPLOYED_CONTRACT_ADDRESS = "0xc86d8882ad5f59d399d3c7cc365282e439618494090a21e9b33a947d480c6ae2";

    useEffect(() => {
        // Check if wallet is available
        const checkWallet = () => {
            if (window.petra) {
                console.log("Petra wallet detected");
                setWalletStatus("detected");
            } else if (window.aptos) {
                console.log("Aptos wallet detected");
                setWalletStatus("detected");
            } else {
                console.log("No wallet detected, checking again in 1 second");
                setTimeout(checkWallet, 1000);
            }
        };

        checkWallet();

        // Add employee data fetching similar to Bulk.jsx
        fetchEmployees();
    }, []);

    // Added fetchEmployees function similar to Bulk.jsx
    const fetchEmployees = async () => {
        setIsLoadingEmployees(true);
        try {
            // Simulating API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Set employees data from dummy data
            setEmployees(dummyEmployeeData);

            // Initialize all employees as selected
            const initialSelected = {};
            dummyEmployeeData.forEach(emp => {
                initialSelected[emp.id] = true;
            });
            setSelectedEmployees(initialSelected);

            // Optionally update the textareas with the employee data
            updateRecipientsAndAmounts(dummyEmployeeData);
        } catch (error) {
            console.error("Error fetching employee data:", error);
        } finally {
            setIsLoadingEmployees(false);
        }
    };

    // Helper function to update recipients and amounts based on employees
    const updateRecipientsAndAmounts = (employeeData) => {
        const recipientAddresses = employeeData.map(emp => emp.walletAddress).join(',');
        const employeeAmounts = employeeData.map(emp => emp.salary).join(',');

        setRecipients(recipientAddresses);
        setAmounts(employeeAmounts);
    };

    const handleSelectEmployee = (id) => {
        setSelectedEmployees(prev => {
            const updated = {
                ...prev,
                [id]: !prev[id]
            };

            // Update recipients and amounts based on selected employees
            const selectedEmps = employees.filter(emp => updated[emp.id]);
            if (selectedEmps.length > 0) {
                const recipientAddresses = selectedEmps.map(emp => emp.walletAddress).join(',');
                const employeeAmounts = selectedEmps.map(emp => emp.salary).join(',');

                setRecipients(recipientAddresses);
                setAmounts(employeeAmounts);
            }

            return updated;
        });
    };

    const connectWallet = async () => {
        try {
            setIsLoading(true);
            let wallet;

            // Determine which wallet to use
            if (window.petra) {
                wallet = window.petra;
            } else if (window.aptos) {
                wallet = window.aptos;
            } else {
                alert("Please install Petra Wallet or another Aptos-compatible wallet");
                setIsLoading(false);
                return;
            }

            console.log("Connecting to wallet...");
            const response = await wallet.connect();
            console.log("Wallet connected:", response);

            // Check if response contains an address
            if (response && response.address) {
                setSenderAddress(response.address);
                setWalletStatus("connected");
            } else {
                console.error("Connection response does not contain address:", response);
                alert("Failed to get wallet address");
            }
        } catch (error) {
            console.error("Error connecting wallet:", error);
            alert(`Error connecting wallet: ${error.message || "Unknown error"}`);
        } finally {
            setIsLoading(false);
        }
    };

    const verifyNetwork = async () => {
        try {
            const wallet = window.petra || window.aptos;
            const network = await wallet.network();
            console.log("Current network:", network);

            if (network && network.name && network.name.toLowerCase() !== 'testnet') {
                alert("Please switch to Testnet in your wallet");
                return false;
            }
            return true;
        } catch (error) {
            console.error("Error verifying network:", error);
            alert("Could not verify network. Please ensure you're connected to Testnet");
            return false;
        }
    };

    const parseAmounts = (amountsString) => {
        // Parse amounts and convert to Octas (1 APT = 100,000,000 Octas)
        return amountsString
            .split(",")
            .map(amount => {
                const parsedAmount = parseFloat(amount.trim());
                // Convert APT to Octas (multiplication by 10^8)
                return Math.floor(parsedAmount * 100000000).toString();
            });
    };

    const handleBulkTransfer = async () => {
        if (!senderAddress) {
            alert("Please connect your wallet first.");
            return;
        }

        // Verify network
        if (!await verifyNetwork()) {
            return;
        }

        const recipientList = recipients.split(",").map(addr => addr.trim());
        const amountList = parseAmounts(amounts);

        if (recipientList.length !== amountList.length) {
            alert("Recipients and amounts must have the same length.");
            return;
        }

        setIsLoading(true);
        try {
            const wallet = window.petra || window.aptos;

            // Execute bulk transfer
            const transferPayload = {
                function: `${DEPLOYED_CONTRACT_ADDRESS}::bulk_payroll::bulk_transfer`,
                type_arguments: [],
                arguments: [recipientList, amountList]
            };

            console.log("Submitting transaction with payload:", transferPayload);

            const transferTransaction = await wallet.signAndSubmitTransaction(transferPayload);
            console.log("Transaction submitted:", transferTransaction);

            setTransactionHash(transferTransaction.hash);
        } catch (error) {
            console.error("Error submitting transaction:", error);
            alert(`Transaction failed: ${error.message || "Unknown error"}`);
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    const truncateAddress = (address) => {
        if (!address) return "";
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.05
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

    const floatVariants = {
        initial: { y: 0 },
        animate: {
            y: [0, -10, 0],
            transition: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    const shimmerVariants = {
        initial: { x: "-100%", opacity: 0.3 },
        animate: {
            x: "100%",
            opacity: 0.7,
            transition: {
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut"
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-950 to-slate-900 text-white overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    initial={{ opacity: 0.2 }}
                    animate={{
                        opacity: [0.2, 0.3, 0.2],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-0 -left-1/3 w-2/3 h-2/3 rounded-full bg-indigo-900/10 blur-[150px]"
                />
                <motion.div
                    initial={{ opacity: 0.2 }}
                    animate={{
                        opacity: [0.2, 0.25, 0.2],
                        scale: [1, 1.05, 1],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-0 -right-1/3 w-2/3 h-2/3 rounded-full bg-violet-900/10 blur-[150px]"
                />
            </div>

            {/* Content container */}
            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
                {/* Header */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="text-center mb-16"
                >
                    <motion.div
                        variants={itemVariants}
                        className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 mb-6"
                    >
                        <div className="w-2 h-2 rounded-full bg-indigo-400 mr-2.5 animate-pulse" />
                        <span className="text-sm font-medium text-indigo-300">Aptos Network</span>
                    </motion.div>

                    <motion.h1
                        variants={itemVariants}
                        className="text-4xl md:text-6xl font-bold tracking-tight mb-6"
                    >
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 via-violet-300 to-indigo-200">
                            Aptos Bulk Payroll
                        </span>
                    </motion.h1>

                    <motion.p
                        variants={itemVariants}
                        className="text-lg text-gray-400 max-w-2xl mx-auto"
                    >
                        Execute multiple payments in a single transaction with precision and efficiency on the Aptos blockchain.
                    </motion.p>
                </motion.div>

                {/* Main content */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                >
                    {/* Wallet connection */}
                    <motion.div
                        variants={itemVariants}
                        className="mb-8"
                    >
                        <motion.button
                            onClick={connectWallet}
                            disabled={isLoading}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className={`w-full flex items-center justify-center px-6 py-5 rounded-xl font-medium text-base relative overflow-hidden backdrop-blur-sm transition-all duration-300 ${senderAddress
                                ? "bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border border-emerald-500/20 text-emerald-300"
                                : "bg-gradient-to-r from-indigo-600/80 to-violet-600/80 border border-white/10 text-white shadow-lg shadow-indigo-900/20"
                                }`}
                        >
                            <div className="relative z-10 flex items-center">
                                <Wallet className="w-5 h-5 mr-3" strokeWidth={1.5} />
                                {isLoading ? (
                                    <span className="flex items-center">
                                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" strokeWidth={1.5} />
                                        Connecting...
                                    </span>
                                ) : senderAddress ? (
                                    <span className="flex items-center">
                                        <span className="h-2.5 w-2.5 bg-emerald-400 rounded-full mr-2.5 animate-pulse" />
                                        <span>Connected: {truncateAddress(senderAddress)}</span>
                                    </span>
                                ) : (
                                    <span>Connect Wallet</span>
                                )}
                            </div>

                            {!senderAddress && !isLoading && (
                                <motion.div
                                    variants={shimmerVariants}
                                    initial="initial"
                                    animate="animate"
                                    className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
                                />
                            )}
                        </motion.button>
                    </motion.div>

                    {/* Main card */}
                    <div className="space-y-8">
                        {/* Recipients section */}
                        <motion.div
                            variants={itemVariants}
                            className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shadow-xl shadow-black/5"
                        >
                            <div className="p-6 border-b border-white/5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <Users className="w-5 h-5 text-indigo-400" strokeWidth={1.5} />
                                        <h2 className="text-xl font-semibold">Recipients</h2>
                                    </div>
                                    <motion.button
                                        onClick={fetchEmployees}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 transition-colors"
                                    >
                                        <RefreshCw className="w-4 h-4" strokeWidth={1.5} />
                                        <span className="text-sm">Refresh</span>
                                    </motion.button>
                                </div>
                            </div>

                            <div className="p-6">
                                {isLoadingEmployees ? (
                                    <div className="flex justify-center items-center py-12">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                        >
                                            <RefreshCw size={28} className="text-indigo-400" strokeWidth={1.5} />
                                        </motion.div>
                                    </div>
                                ) : (
                                    <div className="bg-slate-900/50 rounded-xl overflow-hidden border border-white/5">
                                        <div className="grid grid-cols-[auto_1fr_auto_auto] gap-3 p-4 border-b border-white/5 bg-white/5">
                                            <div className="px-2"></div>
                                            <div className="font-medium text-gray-300 text-sm">Name</div>
                                            <div className="font-medium text-gray-300 text-sm">Department</div>
                                            <div className="font-medium text-gray-300 text-sm px-3">Amount (APT)</div>
                                        </div>

                                        <div className="max-h-[240px] overflow-y-auto">
                                            <AnimatePresence>
                                                {employees.map(employee => (
                                                    <motion.div
                                                        key={employee.id}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -10 }}
                                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                        className="grid grid-cols-[auto_1fr_auto_auto] gap-3 p-4 border-b border-white/5 hover:bg-white/5 transition-all duration-200"
                                                    >
                                                        <div className="px-2">
                                                            <div className="relative flex items-center justify-center">
                                                                <input
                                                                    type="checkbox"
                                                                    id={`emp-${employee.id}`}
                                                                    checked={selectedEmployees[employee.id] || false}
                                                                    onChange={() => handleSelectEmployee(employee.id)}
                                                                    className="peer sr-only"
                                                                />
                                                                <div className="h-4 w-4 rounded border border-white/20 bg-white/5 peer-checked:bg-indigo-500 peer-checked:border-indigo-500 transition-all duration-200"></div>
                                                                <Check
                                                                    className={`absolute w-3 h-3 text-white transition-opacity duration-200 ${selectedEmployees[employee.id] ? 'opacity-100' : 'opacity-0'
                                                                        }`}
                                                                    strokeWidth={3}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="text-white text-sm">
                                                            <div className="font-medium">{employee.name}</div>
                                                            <div className="text-xs text-gray-500 truncate mt-0.5">
                                                                {truncateAddress(employee.walletAddress)}
                                                            </div>
                                                        </div>
                                                        <div className="text-gray-300 text-sm self-center">{employee.department}</div>
                                                        <div className="text-gray-200 text-sm font-mono px-3 self-center">{employee.salary}</div>
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                        </div>

                                        <div className="p-4 flex justify-between items-center bg-white/[0.03]">
                                            <div className="text-sm text-gray-400">
                                                {Object.values(selectedEmployees).filter(Boolean).length} selected
                                            </div>
                                            <button
                                                onClick={() => {
                                                    const allSelected = employees.every(emp => selectedEmployees[emp.id]);
                                                    const newSelection = {};
                                                    employees.forEach(emp => {
                                                        newSelection[emp.id] = !allSelected;
                                                    });
                                                    setSelectedEmployees(newSelection);
                                                    updateRecipientsAndAmounts(allSelected ? [] : employees);
                                                }}
                                                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                                            >
                                                {employees.every(emp => selectedEmployees[emp.id]) ? 'Deselect All' : 'Select All'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Transfer details section */}
                        <motion.div
                            variants={itemVariants}
                            className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shadow-xl shadow-black/5"
                        >
                            <div className="p-6 border-b border-white/5">
                                <div className="flex items-center space-x-3">
                                    <CreditCard className="w-5 h-5 text-indigo-400" strokeWidth={1.5} />
                                    <h2 className="text-xl font-semibold">Transfer Details</h2>
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Recipients (comma-separated addresses)
                                    </label>
                                    <div className="relative">
                                        <textarea
                                            className="w-full px-4 py-3 bg-slate-900/50 rounded-xl text-white focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 transition-all duration-200 h-24 resize-none border border-white/10"
                                            value={recipients}
                                            onChange={(e) => setRecipients(e.target.value)}
                                            placeholder="0x1234...,0x5678..."
                                        />
                                        <div className="absolute inset-0 rounded-xl pointer-events-none ring-1 ring-inset ring-white/10"></div>
                                    </div>
                                    <p className="mt-2 text-xs text-gray-500">
                                        Enter multiple recipient addresses separated by commas
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Amounts (comma-separated APT amounts)
                                    </label>
                                    <div className="relative">
                                        <textarea
                                            className="w-full px-4 py-3 bg-slate-900/50 rounded-xl text-white focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 transition-all duration-200 h-24 resize-none border border-white/10"
                                            value={amounts}
                                            onChange={(e) => setAmounts(e.target.value)}
                                            placeholder="1,2.5,0.75..."
                                        />
                                        <div className="absolute inset-0 rounded-xl pointer-events-none ring-1 ring-inset ring-white/10"></div>
                                    </div>
                                    <p className="mt-2 text-xs text-gray-500">
                                        Enter payment amounts in APT corresponding to each recipient
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Action button */}
                        <motion.div
                            variants={itemVariants}
                            className="mt-8"
                        >
                            <motion.button
                                onClick={handleBulkTransfer}
                                disabled={!senderAddress || isLoading}
                                whileHover={!senderAddress || isLoading ? {} : { scale: 1.01 }}
                                whileTap={!senderAddress || isLoading ? {} : { scale: 0.98 }}
                                className={`w-full relative py-5 px-6 rounded-xl font-medium text-base overflow-hidden transition-all duration-300
                  ${!senderAddress || isLoading
                                        ? 'bg-gray-800/50 text-gray-500 cursor-not-allowed border border-white/5'
                                        : 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-900/20 border border-white/10'
                                    }`}
                            >
                                <div className="relative z-10 flex items-center justify-center">
                                    {isLoading ? (
                                        <span className="flex items-center">
                                            <RefreshCw size={16} className="mr-2 animate-spin" strokeWidth={1.5} />
                                            Processing...
                                        </span>
                                    ) : (
                                        "Execute Bulk Transfer"
                                    )}
                                </div>

                                {!isLoading && senderAddress && (
                                    <motion.div
                                        variants={shimmerVariants}
                                        initial="initial"
                                        animate="animate"
                                        className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
                                    />
                                )}
                            </motion.button>
                        </motion.div>
                    </div>

                    {/* Transaction result */}
                    <AnimatePresence>
                        {transactionHash && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                className="mt-8 bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shadow-xl shadow-black/5"
                            >
                                <div className="p-6 border-b border-white/5">
                                    <h3 className="text-lg font-semibold text-emerald-400">
                                        Transaction Submitted
                                    </h3>
                                </div>

                                <div className="p-6 space-y-4">
                                    <div className="p-4 bg-slate-900/50 rounded-xl border border-white/5">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-mono text-gray-400 truncate pr-4">
                                                {truncateAddress(transactionHash)}...
                                            </span>
                                            <motion.button
                                                onClick={() => copyToClipboard(transactionHash)}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="text-gray-400 hover:text-indigo-400 transition-colors"
                                            >
                                                {copySuccess ? (
                                                    <Check size={16} className="text-emerald-400" strokeWidth={2} />
                                                ) : (
                                                    <Copy size={16} strokeWidth={1.5} />
                                                )}
                                            </motion.button>
                                        </div>
                                    </div>

                                    <a
                                        href={`https://explorer.aptoslabs.com/txn/${transactionHash}?network=testnet`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center px-4 py-2.5 bg-indigo-500/20 hover:bg-indigo-500/30 
                      rounded-xl text-indigo-300 text-sm font-medium transition-colors border border-indigo-500/20"
                                    >
                                        <Link size={14} className="mr-2" strokeWidth={1.5} />
                                        View on Aptos Explorer
                                    </a>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Footer */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-12 text-center text-gray-500 text-sm"
                    >
                        <div className="flex justify-center items-center space-x-2">
                            <span>Powered by</span>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400 font-medium">
                                Aptos Blockchain
                            </span>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default AptosBulk;
