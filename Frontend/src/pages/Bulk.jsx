import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CHAINS } from '../constant/chain';
import { useWeb3 } from '../context/useWeb3';
import Sidebar from "../components/dashboard/Sidebar";
import { backendDomain } from "../constant/domain";
import axios from "axios";
import { CreditCard, RefreshCw, ChevronDown, Plus, Trash2, Users, UserPlus } from 'react-feather';
import { ethers } from 'ethers';

// Define native token placeholder
const NATIVE_TOKEN_ADDRESS = "0x0000000000000000000000000000000000000000";

// Dummy employee data (simulating API response)
const dummyEmployeeData = [
    {
        id: 1,
        name: "Abhinav",
        walletAddress: "0xF947782C0CB4d3afa57912DA235894563950E2F4",
        salary: "0.5",
        department: "OG"
    },

];


// Custom animated components
const GlowButton = ({ children, disabled, isLoading, onClick, className = "" }) => (
    <motion.button
        onClick={onClick}
        disabled={disabled || isLoading}
        className={`relative py-4 px-6 rounded-xl font-medium text-white overflow-hidden ${className} 
            ${disabled ?
                'bg-gray-800 text-gray-500 cursor-not-allowed' :
                'bg-gradient-to-r from-violet-600 to-indigo-600 shadow-[0_0_15px_rgba(139,92,246,0.5)]'
            } transition-all duration-300`}
        whileHover={disabled ? {} : { scale: 1.02, boxShadow: '0 0 25px rgba(139, 92, 246, 0.7)' }}
        whileTap={disabled ? {} : { scale: 0.98 }}
    >
        {!disabled && (
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-violet-400/20 to-indigo-500/20"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            />
        )}
        <span className="relative flex items-center justify-center space-x-2">
            {isLoading ? (
                <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                </>
            ) : children}
        </span>
    </motion.button>
);

const NeomorphicSelect = ({ value, onChange, options, label, icon }) => (
    <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">{label}</label>
        <div className="relative">
            <select
                value={value}
                onChange={onChange}
                className="w-full appearance-none px-4 py-3 bg-[#1A1E2E] border border-[#2A3152] rounded-xl text-white 
                    focus:ring-2 focus:ring-violet-500/70 focus:border-violet-500/70 focus:shadow-[0_0_10px_rgba(139,92,246,0.3)]
                    transition-all duration-200 pr-10"
            >
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                {icon || <ChevronDown size={18} className="text-violet-400" />}
            </div>
            <div className="absolute inset-0 rounded-xl pointer-events-none bg-gradient-to-r from-violet-500/5 to-indigo-500/5" />
        </div>
    </div>
);

function Bulk() {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployees, setSelectedEmployees] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);

    // New state for P2P transfers
    const [activeTab, setActiveTab] = useState('employees'); // 'employees' or 'p2p'
    const [recipients, setRecipients] = useState([{ address: '', amount: '' }]);
    const [recipientErrors, setRecipientErrors] = useState([{ address: '', amount: '' }]);
    const [isP2PLoading, setIsP2PLoading] = useState(false);

    const {
        account,
        selectedChain,
        selectedToken,
        notification,
        switchNetwork,
        handleTokenChange,
        addTokenToWallet,
        sendBulkTransfer,
        showNotification
    } = useWeb3();

    // Fetch employees from API (simulated)
    useEffect(() => {
        fetchEmployees();
    }, []);

    // const fetchEmployees = async () => {
    //     setIsLoadingEmployees(true);
    //     try {
    //         await new Promise(resolve => setTimeout(resolve, 1000));
    //         setEmployees(dummyEmployeeData);
    //         const initialSelected = {};
    //         dummyEmployeeData.forEach(emp => {
    //             initialSelected[emp.id] = true;
    //         });
    //         setSelectedEmployees(initialSelected);
    //     } catch (error) {
    //         console.error("Error fetching employee data:", error);
    //     } finally {
    //         setIsLoadingEmployees(false);
    //     }
    // };
    const fetchEmployees = async () => {
        setIsLoadingEmployees(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `${backendDomain}/admin/get-all-empolyees`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setEmployees(response.data.employee);
            const initialSelected = {};
            employees.forEach(emp => {
                initialSelected[emp._id] = true;
            });
            setSelectedEmployees(initialSelected);
        } catch (error) {
            console.error("Error fetching employee data:", error);
        } finally {
            setIsLoadingEmployees(false);
        }
    };

    const handleSelectAll = (e) => {
        const isChecked = e.target.checked;
        const newSelected = {};
        employees.forEach(emp => {
            newSelected[emp._id] = isChecked;
        });
        setSelectedEmployees(newSelected);
    };

    const handleSelectEmployee = (id) => {
        setSelectedEmployees(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const onChainChange = async (e) => {
        try {
            const chainId = parseInt(e.target.value);
            await switchNetwork(chainId);
        } catch (error) {
            console.error("Error switching chain:", error);
        }
    };

    const onTokenChange = (e) => {
        handleTokenChange(e.target.value);
    };
    const handlePayEmployees = async () => {
        setIsLoading(true);
        try {
            const selectedEmps = employees.filter(emp => selectedEmployees[emp._id]);
            if (selectedEmps.length === 0) {
                throw new Error("Please select at least one employee to pay");
            }
            const recipientAddresses = selectedEmps.map(emp => emp.accountId);
            const amounts = selectedEmps.map(emp => emp.salary.$numberDecimal);
            await sendBulkTransfer(recipientAddresses, amounts);
        } catch (error) {
            console.error("Error paying employees:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // New functions for P2P transfers
    const addRecipient = () => {
        setRecipients([...recipients, { address: '', amount: '' }]);
        setRecipientErrors([...recipientErrors, { address: '', amount: '' }]);
    };

    const removeRecipient = (index) => {
        if (recipients.length > 1) {
            const newRecipients = [...recipients];
            newRecipients.splice(index, 1);
            setRecipients(newRecipients);

            const newErrors = [...recipientErrors];
            newErrors.splice(index, 1);
            setRecipientErrors(newErrors);
        }
    };

    const handleRecipientChange = (index, field, value) => {
        const newRecipients = [...recipients];
        newRecipients[index][field] = value;
        setRecipients(newRecipients);

        // Clear error when user starts typing
        const newErrors = [...recipientErrors];
        newErrors[index][field] = '';
        setRecipientErrors(newErrors);
    };

    const validateRecipients = () => {
        let valid = true;
        const newErrors = [...recipientErrors];

        recipients.forEach((recipient, index) => {
            // Validate address
            if (!recipient.address) {
                newErrors[index].address = 'Address is required';
                valid = false;
            } else if (!ethers.isAddress(recipient.address)) {
                newErrors[index].address = 'Invalid address format';
                valid = false;
            }

            // Validate amount
            if (!recipient.amount) {
                newErrors[index].amount = 'Amount is required';
                valid = false;
            } else if (isNaN(parseFloat(recipient.amount)) || parseFloat(recipient.amount) <= 0) {
                newErrors[index].amount = 'Amount must be a positive number';
                valid = false;
            }
        });

        setRecipientErrors(newErrors);
        return valid;
    };

    const handleP2PTransfer = async () => {
        if (!validateRecipients()) {
            return;
        }

        setIsP2PLoading(true);
        try {
            const addresses = recipients.map(r => r.address);
            const amounts = recipients.map(r => r.amount);

            const result = await sendBulkTransfer(addresses, amounts);

            if (result && result.success) {
                showNotification('success', 'P2P transfers completed successfully!');
                // Reset form after successful transfer
                setRecipients([{ address: '', amount: '' }]);
            }
        } catch (error) {
            console.error("P2P transfer error:", error);
            showNotification('error', `Failed to execute transfers: ${error.message}`);
        } finally {
            setIsP2PLoading(false);
        }
    };

    // Prepare options for selects
    const chainOptions = CHAINS.map(chain => ({
        value: chain.chainId,
        label: chain.name
    }));

    const tokenOptions = selectedChain?.tokens?.map(token => ({
        value: token.address,
        label: `${token.symbol} ${token.name ? `- ${token.name}` : ''}`
    })) || [];

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.1,
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
                stiffness: 300,
                damping: 24
            }
        }
    };

    const tableRowVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.05,
                duration: 0.5,
                ease: [0.43, 0.13, 0.23, 0.96]
            }
        }),
        hover: {
            backgroundColor: "rgba(139, 92, 246, 0.1)",
            transition: { duration: 0.2 }
        }
    };

    // Animation variants for new elements
    const formRowVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.05,
                duration: 0.3,
                ease: [0.43, 0.13, 0.23, 0.96]
            }
        })
    };

    return (
        <div>
            <Sidebar
                isWalletConnected={account !== undefined}
                onConnectWallet={() => console.log("Connect wallet")}
                account={account}
            />
            <div className=" bg-gradient-to-b from-[#0A0C14] to-[#131629] py-12 px-4 sm:px-6 lg:px-8">
                {/* Decorative elements */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full filter blur-[120px]" />
                    <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-indigo-600/10 rounded-full filter blur-[100px]" />
                </div>

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="max-w-6xl mx-auto relative z-10"
                >
                    <motion.div variants={itemVariants} className="text-center mb-12">
                        <motion.div
                            className="inline-block bg-gradient-to-r from-violet-500/20 to-indigo-500/20 rounded-full px-3 py-1 text-xs font-medium text-violet-400 mb-4"
                            whileHover={{ scale: 1.05, boxShadow: "0 0 10px rgba(139, 92, 246, 0.5)" }}
                        >
                            Bulk Transfers
                        </motion.div>
                        <motion.h1
                            className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400"
                            whileHover={{ scale: 1.01 }}
                            transition={{ duration: 0.3 }}
                        >
                            Payment Dashboard
                        </motion.h1>
                        <motion.p className="mt-3 text-gray-400">
                            Process multiple payments in a single transaction with maximum efficiency
                        </motion.p>
                    </motion.div>

                    <motion.div
                        className="backdrop-blur-sm bg-[#131A2B]/80 rounded-2xl shadow-2xl border border-[#262F48] overflow-hidden
                                   hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] transition-shadow duration-500"
                        variants={itemVariants}
                    >
                        <AnimatePresence>
                            {notification.show && (
                                <motion.div
                                    className={`p-4 ${notification.type === 'error'
                                        ? 'bg-red-900/30 text-red-300 border-red-700'
                                        : notification.type === 'info'
                                            ? 'bg-blue-900/30 text-blue-300 border-blue-700'
                                            : 'bg-green-900/30 text-green-300 border-green-700'
                                        } border-b border-opacity-50`}
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, height: 0, paddingTop: 0, paddingBottom: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {notification.message}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="p-8">
                            <motion.div variants={containerVariants} initial="hidden" animate="visible">
                                {account && (
                                    <motion.div
                                        variants={itemVariants}
                                        className="mb-8 p-4 bg-[#1A1E2E] rounded-xl border border-[#2A3152]"
                                        whileHover={{ boxShadow: "0 0 20px rgba(139, 92, 246, 0.15)" }}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.5)]"></div>
                                            <span className="text-gray-400">Connected:</span>
                                            <span className="font-mono text-violet-400 tracking-wider">
                                                {account.substring(0, 6)}...{account.substring(account.length - 4)}
                                            </span>
                                        </div>
                                    </motion.div>
                                )}

                                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    <NeomorphicSelect
                                        value={selectedChain?.chainId}
                                        onChange={onChainChange}
                                        options={chainOptions.map(c => ({ value: c.value, label: c.label }))}
                                        label="Network"
                                    />

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-300">Token</label>
                                        <div className="flex space-x-2">
                                            <div className="relative flex-grow">
                                                <select
                                                    value={selectedToken?.address}
                                                    onChange={onTokenChange}
                                                    className="w-full appearance-none px-4 py-3 bg-[#1A1E2E] border border-[#2A3152] rounded-xl text-white 
                                                       focus:ring-2 focus:ring-violet-500/70 focus:border-violet-500/70 
                                                       transition-all duration-200 pr-10"
                                                >
                                                    {tokenOptions.map(option => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                    <ChevronDown size={18} className="text-violet-400" />
                                                </div>
                                            </div>

                                            {selectedToken?.address !== NATIVE_TOKEN_ADDRESS && (
                                                <motion.button
                                                    type="button"
                                                    onClick={() => addTokenToWallet()}
                                                    className="px-4 py-3 bg-violet-600/80 hover:bg-violet-600 rounded-xl text-white font-medium 
                                                            transition-all duration-300 border border-violet-500/50 shadow-[0_0_10px_rgba(139,92,246,0.3)]"
                                                    whileHover={{ scale: 1.03, boxShadow: "0 0 20px rgba(139, 92, 246, 0.5)" }}
                                                    whileTap={{ scale: 0.97 }}
                                                >
                                                    Add Token
                                                </motion.button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Tab Navigation */}
                                <motion.div variants={itemVariants} className="mb-6">
                                    <div className="flex border border-[#2A3152] rounded-xl overflow-hidden">
                                        <button
                                            className={`flex-1 py-3 px-4 flex items-center justify-center space-x-2 ${activeTab === 'employees'
                                                ? 'bg-violet-600/30 text-white border-b-2 border-violet-500'
                                                : 'bg-[#1A1E2E] text-gray-400 hover:bg-[#232A45] transition-colors'
                                                }`}
                                            onClick={() => setActiveTab('employees')}
                                        >
                                            <Users size={18} />
                                            <span>Employee Payroll</span>
                                        </button>
                                        <button
                                            className={`flex-1 py-3 px-4 flex items-center justify-center space-x-2 ${activeTab === 'p2p'
                                                ? 'bg-violet-600/30 text-white border-b-2 border-violet-500'
                                                : 'bg-[#1A1E2E] text-gray-400 hover:bg-[#232A45] transition-colors'
                                                }`}
                                            onClick={() => setActiveTab('p2p')}
                                        >
                                            <UserPlus size={18} />
                                            <span>Custom P2P Transfers</span>
                                        </button>
                                    </div>
                                </motion.div>

                                <AnimatePresence mode="wait">
                                    {activeTab === 'employees' ? (
                                        /* Employee Payroll Tab Content */
                                        <motion.div
                                            key="employees"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <div className="mb-8">
                                                <div className="flex justify-between items-center mb-4">
                                                    <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
                                                        Employee Payroll
                                                    </h2>
                                                    <motion.button
                                                        onClick={fetchEmployees}
                                                        disabled={isLoadingEmployees}
                                                        className="px-4 py-2 text-sm bg-[#1A1E2E] border border-indigo-500/30 hover:border-indigo-500/80 
                                                                rounded-lg text-indigo-400 flex items-center space-x-2 shadow-[0_0_10px_rgba(99,102,241,0.2)]
                                                                hover:shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all duration-300"
                                                        whileHover={{ scale: 1.03 }}
                                                        whileTap={{ scale: 0.97 }}
                                                    >
                                                        <RefreshCw size={14} className={`${isLoadingEmployees ? 'animate-spin' : ''}`} />
                                                        <span>{isLoadingEmployees ? 'Loading...' : 'Refresh'}</span>
                                                    </motion.button>
                                                </div>

                                                {/* Existing employee table code */}
                                                <div
                                                    className="overflow-hidden rounded-xl border border-[#2A3152]"
                                                >
                                                    {isLoadingEmployees ? (
                                                        <motion.div
                                                            className="flex flex-col items-center justify-center py-16 px-6 bg-[#1A1E2E]"
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                        >
                                                            <div className="w-12 h-12 mb-4 relative">
                                                                <div className="absolute inset-0 rounded-full border-t-2 border-violet-500 animate-spin"></div>
                                                                <div className="absolute inset-2 rounded-full border-2 border-violet-500/20"></div>
                                                            </div>
                                                            <p className="text-gray-400">Loading employee data...</p>
                                                        </motion.div>
                                                    ) : employees.length > 0 ? (
                                                        <div className="overflow-x-auto">
                                                            <table className="w-full">
                                                                <thead className="bg-[#161D31]">
                                                                    <tr>
                                                                        <th className="p-4 text-left">
                                                                            <div className="flex items-center">
                                                                                <div className="relative">
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        id="select-all"
                                                                                        className="opacity-0 absolute h-5 w-5"
                                                                                        checked={employees.every(emp => selectedEmployees[emp._id])}
                                                                                        onChange={handleSelectAll}
                                                                                    />
                                                                                    <div className={`border ${employees.every(emp => selectedEmployees[emp._id])
                                                                                        ? 'bg-violet-600 border-violet-700'
                                                                                        : 'border-gray-600 bg-[#20273E]'} 
                                                                                        rounded h-5 w-5 flex flex-shrink-0 justify-center items-center
                                                                                        focus-within:border-violet-500 transition-colors duration-200`}>
                                                                                        {employees.every(emp => selectedEmployees[emp._id]) && (
                                                                                            <motion.svg
                                                                                                className="w-3 h-3 text-white pointer-events-none"
                                                                                                viewBox="0 0 12 12"
                                                                                                initial={{ scale: 0 }}
                                                                                                animate={{ scale: 1 }}
                                                                                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                                                                            >
                                                                                                <polyline points="1,6 4,9 11,2" style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 2 }} />
                                                                                            </motion.svg>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                                <label htmlFor="select-all" className="text-gray-300 ml-2 cursor-pointer">
                                                                                    Select All
                                                                                </label>
                                                                            </div>
                                                                        </th>
                                                                        <th className="p-4 text-left text-gray-300 font-medium">Name</th>
                                                                        <th className="p-4 text-left text-gray-300 font-medium">Department</th>
                                                                        <th className="p-4 text-left text-gray-300 font-medium">Wallet Address</th>
                                                                        <th className="p-4 text-right text-gray-300 font-medium">Salary ({selectedToken?.symbol || 'ETH'})</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody className="bg-[#1A1E2E]">
                                                                    {employees.map((employee, i) => (
                                                                        <motion.tr
                                                                            key={employee._id}
                                                                            custom={i}
                                                                            variants={tableRowVariants}
                                                                            whileHover="hover"
                                                                            className="border-t border-[#2A3152]/30 transition-colors"
                                                                        >
                                                                            <td className="p-4">
                                                                                <div className="relative">
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        id={`emp-${employee._id}`}
                                                                                        className="opacity-0 absolute h-5 w-5"
                                                                                        checked={selectedEmployees[employee._id] || false}
                                                                                        onChange={() => handleSelectEmployee(employee._id)}
                                                                                    />
                                                                                    <div className={`border ${selectedEmployees[employee._id]
                                                                                        ? 'bg-violet-600 border-violet-700'
                                                                                        : 'border-gray-600 bg-[#20273E]'} 
                                                                                        rounded h-5 w-5 flex flex-shrink-0 justify-center items-center
                                                                                        focus-within:border-violet-500 transition-colors duration-200`}>
                                                                                        {selectedEmployees[employee._id] && (
                                                                                            <motion.svg
                                                                                                className="w-3 h-3 text-white pointer-events-none"
                                                                                                viewBox="0 0 12 12"
                                                                                                initial={{ scale: 0 }}
                                                                                                animate={{ scale: 1 }}
                                                                                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                                                                            >
                                                                                                <polyline points="1,6 4,9 11,2" style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 2 }} />
                                                                                            </motion.svg>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                            <td className="p-4">
                                                                                <div className="flex items-center space-x-3">
                                                                                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                                                                                        {employee.name[0]}
                                                                                    </div>
                                                                                    <span className="font-medium text-gray-200">{employee.name}</span>
                                                                                </div>
                                                                            </td>
                                                                            <td className="p-4">
                                                                                <span className="px-2 py-1 bg-[#232A45] text-violet-300 text-xs rounded-full">{employee.designation}</span>
                                                                            </td>
                                                                            <td className="p-4">
                                                                                <div className="flex items-center space-x-2">
                                                                                    <div className="w-2 h-2 bg-green-400 rounded-full shadow-[0_0_5px_rgba(74,222,128,0.5)]"></div>
                                                                                    <span className="font-mono text-gray-400 text-sm">
                                                                                        {employee.accountId.substring(0, 6)}...{employee.accountId.substring(employee.accountId.length - 4)}
                                                                                    </span>
                                                                                </div>
                                                                            </td>
                                                                            <td className="p-4 text-right">
                                                                                <span className="font-medium text-indigo-300">{employee.salary.$numberDecimal}</span>
                                                                            </td>
                                                                        </motion.tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    ) : (
                                                        <div className="bg-[#1A1E2E] p-10 text-center text-gray-400">
                                                            <div className="flex flex-col items-center justify-center">
                                                                <div className="h-16 w-16 bg-[#232A45] rounded-full flex items-center justify-center mb-4">
                                                                    <svg className="w-8 h-8 text-indigo-400 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                                    </svg>
                                                                </div>
                                                                <p className="mb-4">No employee data available</p>
                                                                <motion.button
                                                                    onClick={fetchEmployees}
                                                                    className="px-4 py-2 rounded-lg border border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                                                                    whileHover={{ scale: 1.05 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                >
                                                                    Load Employees
                                                                </motion.button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.2 }}
                                            >
                                                <GlowButton
                                                    onClick={handlePayEmployees}
                                                    disabled={isLoading || !account || employees.length === 0 || Object.values(selectedEmployees).every(v => !v)}
                                                    isLoading={isLoading}
                                                    className="group"
                                                >
                                                    {!account ? (
                                                        'Connect Wallet to Continue'
                                                    ) : (
                                                        <div className="flex items-center justify-center space-x-2">
                                                            <CreditCard className="w-5 h-5 group-hover:animate-pulse" />
                                                            <span>Pay Selected Employees</span>
                                                        </div>
                                                    )}
                                                </GlowButton>
                                            </motion.div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="p2p"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <div className="mb-8">
                                                <div className="flex justify-between items-center mb-4">
                                                    <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
                                                        Custom P2P Transfers
                                                    </h2>
                                                    <motion.button
                                                        onClick={addRecipient}
                                                        className="px-4 py-2 text-sm bg-[#1A1E2E] border border-indigo-500/30 hover:border-indigo-500/80 
                                                                rounded-lg text-indigo-400 flex items-center space-x-2 shadow-[0_0_10px_rgba(99,102,241,0.2)]
                                                                hover:shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all duration-300"
                                                        whileHover={{ scale: 1.03 }}
                                                        whileTap={{ scale: 0.97 }}
                                                    >
                                                        <Plus size={14} />
                                                        <span>Add Recipient</span>
                                                    </motion.button>
                                                </div>

                                                {/* Keep the rest of the P2P section the same */}
                                                <div className="overflow-hidden rounded-xl border border-[#2A3152] bg-[#1A1E2E] p-6">
                                                    <div className="space-y-4">
                                                        {recipients.map((recipient, index) => (
                                                            <div
                                                                key={index}
                                                                className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 rounded-xl bg-[#232A45] border border-[#2A3152] hover:border-violet-500/30 transition-all"
                                                            >
                                                                <div className="md:col-span-6">
                                                                    <label className="block text-sm text-gray-400 mb-1">Recipient Address</label>
                                                                    <input
                                                                        type="text"
                                                                        value={recipient.address}
                                                                        onChange={(e) => handleRecipientChange(index, 'address', e.target.value)}
                                                                        placeholder="0x..."
                                                                        className="w-full px-4 py-3 bg-[#1A1E2E] border border-[#2A3152] rounded-xl text-white 
                                                                            focus:ring-2 focus:ring-violet-500/70 focus:border-violet-500/70 transition-all"
                                                                    />
                                                                    {recipientErrors[index].address && (
                                                                        <p className="mt-1 text-red-400 text-xs">{recipientErrors[index].address}</p>
                                                                    )}
                                                                </div>
                                                                <div className="md:col-span-4">
                                                                    <label className="block text-sm text-gray-400 mb-1">Amount ({selectedToken?.symbol})</label>
                                                                    <input
                                                                        type="text"
                                                                        value={recipient.amount}
                                                                        onChange={(e) => handleRecipientChange(index, 'amount', e.target.value)}
                                                                        placeholder="0.0"
                                                                        className="w-full px-4 py-3 bg-[#1A1E2E] border border-[#2A3152] rounded-xl text-white 
                                                                            focus:ring-2 focus:ring-violet-500/70 focus:border-violet-500/70 transition-all"
                                                                    />
                                                                    {recipientErrors[index].amount && (
                                                                        <p className="mt-1 text-red-400 text-xs">{recipientErrors[index].amount}</p>
                                                                    )}
                                                                </div>
                                                                <div className="md:col-span-2 flex items-end">
                                                                    <button
                                                                        onClick={() => removeRecipient(index)}
                                                                        disabled={recipients.length === 1}
                                                                        className={`w-full px-4 py-3 rounded-xl flex items-center justify-center
                                                                            ${recipients.length === 1
                                                                                ? 'bg-[#1A1E2E] text-gray-600 cursor-not-allowed'
                                                                                : 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30'} 
                                                                            transition-all`}
                                                                    >
                                                                        <Trash2 size={18} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {recipients.length > 0 && (
                                                        <div className="mt-6 p-4 rounded-xl bg-[#232A45] border border-[#2A3152]">
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-gray-400">Total Recipients</span>
                                                                <span className="text-indigo-300 font-medium">{recipients.length}</span>
                                                            </div>
                                                            <div className="flex justify-between items-center mt-2">
                                                                <span className="text-gray-400">Total Amount</span>
                                                                <span className="text-white font-medium">
                                                                    {recipients
                                                                        .reduce((sum, recipient) => sum + (parseFloat(recipient.amount) || 0), 0)
                                                                        .toFixed(6)} {selectedToken?.symbol}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.2 }}
                                            >
                                                <GlowButton
                                                    onClick={handleP2PTransfer}
                                                    disabled={isP2PLoading || !account || recipients.length === 0}
                                                    isLoading={isP2PLoading}
                                                    className="group"
                                                >
                                                    {!account ? (
                                                        'Connect Wallet to Continue'
                                                    ) : (
                                                        <div className="flex items-center justify-center space-x-2">
                                                            <CreditCard className="w-5 h-5 group-hover:animate-pulse" />
                                                            <span>Execute P2P Transfers</span>
                                                        </div>
                                                    )}
                                                </GlowButton>
                                            </motion.div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="mt-8 text-center text-gray-500 text-sm flex justify-center items-center space-x-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <span>Powered by</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400 font-medium">
                            secure smart contract technology
                        </span>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}

export default Bulk;