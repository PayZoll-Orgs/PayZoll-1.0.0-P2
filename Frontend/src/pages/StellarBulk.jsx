import React, { useState, useEffect } from 'react';
import BigNumber from 'bignumber.js';
import { signTransaction } from '@stellar/freighter-api';
import { useAccount } from '@/hooks/useAccount';
import { Networks } from 'stellar-sdk';
import { Client } from '@stellar/stellar-sdk/contract';
import {
    Coins, ArrowRightLeft, Users, Wallet, Edit, Plus,
    X, Check, AlertTriangle, Loader2, RefreshCw, User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { backendDomain } from '../constant/domain';
import axios from 'axios';

// Constants
const RPC_URL = "https://soroban-testnet.stellar.org/";
const CONTRACT_ADDRESS = 'CAAX52OHYPSYCUFTEO4FHQL345SYQD6D7JAGSPOFNMXXQJXO6DAHN3QR';
const WASM_HASH = "0ebde7a3d59aa065fb48d9cb48922abab601783216b9733f74071b441bb16a2a";
const TOKEN_IDS = {
    native: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC',
    usdc: 'CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA'
};
const DECIMALS = 7;

// Animation variants
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
        transition: { type: "spring", stiffness: 100 }
    }
};

const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { type: "spring", stiffness: 300, damping: 25 }
    },
    exit: {
        opacity: 0,
        scale: 0.9,
        transition: { duration: 0.2 }
    }
};

export default function StellarBulk() {
    const { address } = useAccount();
    const [selectedToken, setSelectedToken] = useState('native');
    const [status, setStatus] = useState('');
    const [statusType, setStatusType] = useState('default'); // 'default', 'success', 'error'
    const [isProcessing, setIsProcessing] = useState(false);
    const [showContent, setShowContent] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [recipients, setRecipients] = useState([]);
    const [selectedRecipients, setSelectedRecipients] = useState({});
    const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);
    const [copied, setCopied] = useState(false);

    // Modal states
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [currentEditRecipient, setCurrentEditRecipient] = useState(null);
    const [newRecipient, setNewRecipient] = useState({ name: '', accountId: '', amount: '' });

    // Add state for pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Calculate the employees to display based on the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedRecipients = recipients.slice(startIndex, endIndex);

    // Calculate total pages
    const totalPages = Math.ceil(recipients.length / itemsPerPage);

    // Function to handle page change
    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    useEffect(() => {
        // Show content with delay for entrance animation
        setTimeout(() => setShowContent(true), 500);
        fetchEmployees();
    }, []);

    const copyToClipboard = () => {
        if (address) {
            navigator.clipboard.writeText(address);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

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

            const fetchedEmployees = response.data.employee;

            // Transform employee data to recipient format
            const employeeRecipients = fetchedEmployees.map(emp => ({
                id: emp._id,
                name: emp.name,
                department: emp.department,
                accountId: emp.accountId || '', // Using wallet address
                amount: emp.salary.$numberDecimal || '0',
                isEmployee: true
            }));

            setEmployees(fetchedEmployees);
            setRecipients(employeeRecipients);

            // Initialize selected recipients
            const initialSelected = {};
            employeeRecipients.forEach(rec => {
                initialSelected[rec.id] = true;
            });
            setSelectedRecipients(initialSelected);
        } catch (error) {
            console.error("Error fetching employee data:", error);
            setStatus('Failed to fetch employee data. Please try again.');
            setStatusType('error');
        } finally {
            setIsLoadingEmployees(false);
        }
    };

    const handleToggleRecipient = (id) => {
        setSelectedRecipients(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const handleSelectAllRecipients = () => {
        const allSelected = {};
        recipients.forEach(rec => {
            allSelected[rec.id] = true;
        });
        setSelectedRecipients(allSelected);
    };

    const handleUnselectAllRecipients = () => {
        const allUnselected = {};
        recipients.forEach(rec => {
            allUnselected[rec.id] = false;
        });
        setSelectedRecipients(allUnselected);
    };

    const openEditModal = (recipient) => {
        setCurrentEditRecipient({ ...recipient });
        setShowEditModal(true);
    };

    const saveEditedRecipient = () => {
        if (!currentEditRecipient) return;

        setRecipients(prev =>
            prev.map(rec =>
                rec.id === currentEditRecipient.id
                    ? { ...rec, ...currentEditRecipient }
                    : rec
            )
        );

        setShowEditModal(false);

        // Show success message
        setStatus(`Updated ${currentEditRecipient.name}'s information successfully`);
        setStatusType('success');
        setTimeout(() => setStatus(''), 3000);
    };

    const openAddModal = () => {
        setNewRecipient({ name: '', accountId: '', amount: '' });
        setShowAddModal(true);
    };

    const addNewRecipient = () => {
        // Validate inputs
        if (!newRecipient.name || !newRecipient.accountId || !newRecipient.amount) {
            setStatus('Please fill in all fields');
            setStatusType('error');
            return;
        }

        const newId = `manual-${Date.now()}`;
        const recipientToAdd = {
            id: newId,
            name: newRecipient.name,
            accountId: newRecipient.accountId,
            amount: newRecipient.amount,
            isEmployee: false
        };

        setRecipients(prev => [...prev, recipientToAdd]);
        setSelectedRecipients(prev => ({
            ...prev,
            [newId]: true
        }));

        setShowAddModal(false);

        // Show success message
        setStatus(`Added ${newRecipient.name} as a recipient`);
        setStatusType('success');
        setTimeout(() => setStatus(''), 3000);
    };

    const removeRecipient = (id) => {
        // Only allow removing manually added recipients
        setRecipients(prev => prev.filter(rec => rec.id !== id));

        // Remove from selected as well
        const newSelected = { ...selectedRecipients };
        delete newSelected[id];
        setSelectedRecipients(newSelected);

        // Show success message
        setStatus('Recipient removed successfully');
        setStatusType('success');
        setTimeout(() => setStatus(''), 3000);
    };

    const truncateAddress = (addr) => {
        if (!addr) return '';
        return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
    };

    const submitTransfer = async () => {
        // Get only selected recipients
        const selectedRecipientsData = recipients.filter(rec => selectedRecipients[rec.id]);

        // Validate inputs
        if (!address) {
            setStatus('Wallet not connected');
            setStatusType('error');
            return;
        }

        if (selectedRecipientsData.length === 0) {
            setStatus('Please select at least one recipient');
            setStatusType('error');
            return;
        }

        if (selectedRecipientsData.some(r => !r.accountId || !r.amount)) {
            setStatus('Some recipients have missing address or amount information');
            setStatusType('error');
            return;
        }

        if (selectedRecipientsData.some(r => parseFloat(r.amount) <= 0)) {
            setStatus('All amounts must be greater than 0');
            setStatusType('error');
            return;
        }

        setIsProcessing(true);
        setStatus('Processing payments...');
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
            const recipientsList = selectedRecipientsData.map(r => r.accountId);
            const amountsList = selectedRecipientsData.map(r =>
                new BigNumber(r.amount)
                    .times(new BigNumber(10).pow(DECIMALS))
                    .toFixed(0)
            );

            const copyToClipboard = () => {
                if (address) {
                    navigator.clipboard.writeText(address);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                }
            };


            // Invoke the bulk_transfer function on the contract
            const bulkTransferTx = await client.bulk_transfer({
                sender,
                token_id,
                recipients: recipientsList,
                amounts: amountsList,
            });

            // Sign and send the transaction
            const { result } = await bulkTransferTx.signAndSend();
            console.log("Bulk transfer result:", result);
            setStatus(`Successfully sent payments to ${selectedRecipientsData.length} recipients!`);
            setStatusType('success');
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
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: `
                            linear-gradient(to right, rgba(99, 102, 241, 0.1) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(99, 102, 241, 0.1) 1px, transparent 1px)
                        `,
                        backgroundSize: '40px 40px',
                    }}
                />

                {/* Floating coins */}
                {[...Array(8)].map((_, i) => (
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
                        <Coins className="w-8 h-8 text-blue-500" />
                    </motion.div>
                ))}
            </div>

            {/* Gradient orb */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
            </div>

            <div className={`relative z-10 container mx-auto max-w-7xl min-h-screen flex flex-col items-center justify-center py-10 px-4 transition-opacity duration-1000 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
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
                                <span className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 opacity-50" />
                            </span>
                        </h1>
                        <p className="mt-2 text-gray-400">Process employee payments and other transfers in one transaction</p>
                    </motion.div>
                </motion.div>

                {/* Main Content */}
                <motion.div
                    className="w-full"
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
                                    <h2 className="text-xl font-semibold text-white">Payment Dashboard</h2>
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

                        {/* Token Selection */}
                        <div className="p-6 border-b border-gray-800/50">
                            <motion.div variants={itemVariants} className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300">Select Payment Token</label>
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
                        </div>

                        {/* Recipients Section */}
                        <div className="p-6 space-y-6">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-lg font-medium text-white">Payment Recipients</h3>
                                    <p className="text-sm text-gray-400 mt-1">
                                        {recipients.filter(r => selectedRecipients[r.id]).length} of {recipients.length} recipients selected
                                    </p>
                                </div>

                                <div className="flex space-x-2 text-sm">
                                    <button
                                        onClick={handleSelectAllRecipients}
                                        className="px-3 py-1.5 bg-blue-900/30 hover:bg-blue-900/50 rounded-lg border border-blue-500/30 text-blue-400 transition-colors"
                                    >
                                        Select All
                                    </button>
                                    <button
                                        onClick={handleUnselectAllRecipients}
                                        className="px-3 py-1.5 bg-gray-800/50 hover:bg-gray-800/80 rounded-lg border border-gray-700/50 text-gray-400 transition-colors"
                                    >
                                        Unselect All
                                    </button>
                                    <button
                                        onClick={fetchEmployees}
                                        className="px-3 py-1.5 flex items-center gap-1 bg-indigo-900/30 hover:bg-indigo-900/50 rounded-lg border border-indigo-500/30 text-indigo-400 transition-colors"
                                    >
                                        <RefreshCw className="w-3 h-3" />
                                        Refresh
                                    </button>
                                    <button
                                        onClick={openAddModal}
                                        className="px-3 py-1.5 flex items-center gap-1 bg-purple-900/30 hover:bg-purple-900/50 rounded-lg border border-purple-500/30 text-purple-400 transition-colors"
                                    >
                                        <Plus className="w-3 h-3" />
                                        Add New
                                    </button>
                                </div>
                            </div>

                            {isLoadingEmployees ? (
                                <div className="flex items-center justify-center p-12">
                                    <div className="flex flex-col items-center space-y-4">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                        >
                                            <Loader2 className="w-8 h-8 text-blue-400" />
                                        </motion.div>
                                        <p className="text-gray-400">Loading recipients...</p>
                                    </div>
                                </div>
                            ) : recipients.length === 0 ? (
                                <div className="bg-gray-800/30 rounded-xl p-8 text-center">
                                    <Users className="mx-auto h-12 w-12 text-gray-500 mb-3" />
                                    <h3 className="text-lg font-medium text-white mb-2">No Recipients Found</h3>
                                    <p className="text-gray-400 mb-4">There are no employees or recipients available for payment.</p>
                                    <button
                                        onClick={openAddModal}
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Recipient
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3 min-h-96 max-h-100 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
                                    <AnimatePresence initial={false}>
                                        {paginatedRecipients.map((recipient) => (
                                            <motion.div
                                                key={recipient.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, x: -10 }}
                                                layout
                                                className={`flex items-center p-4 rounded-xl border transition-colors ${selectedRecipients[recipient.id]
                                                    ? 'bg-blue-900/20 border-blue-500/30'
                                                    : 'bg-gray-800/30 border-gray-700/50'
                                                    }`}
                                            >
                                                <div className="flex-shrink-0 mr-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedRecipients[recipient.id] || false}
                                                        onChange={() => handleToggleRecipient(recipient.id)}
                                                        className="h-5 w-5 rounded-md border-gray-700 bg-gray-800 text-blue-500 focus:ring-blue-500/25"
                                                    />
                                                </div>

                                                <div className="min-w-0 flex-1 grid grid-cols-1 sm:grid-cols-4 gap-2">
                                                    <div>
                                                        <p className="text-sm font-medium text-white truncate">
                                                            {recipient.name}
                                                            {recipient.isEmployee && (
                                                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-900/50 text-indigo-300">
                                                                    Employee
                                                                </span>
                                                            )}
                                                        </p>
                                                        {recipient.department && (
                                                            <p className="text-xs text-gray-400">{recipient.department}</p>
                                                        )}
                                                    </div>

                                                    <div className="sm:col-span-2">
                                                        <p className="text-xs text-gray-400">Account ID</p>
                                                        <p className="text-sm text-gray-300 truncate">
                                                            {recipient.accountId || 'Not specified'}
                                                        </p>
                                                    </div>

                                                    <div className="text-right">
                                                        <p className="text-xs text-gray-400">Amount</p>
                                                        <div className="flex items-center justify-end">
                                                            <p className="text-sm font-medium text-white">
                                                                {parseFloat(recipient.amount).toLocaleString(undefined, {
                                                                    minimumFractionDigits: 2,
                                                                    maximumFractionDigits: 2
                                                                })}
                                                            </p>
                                                            <span className="ml-1 text-xs text-gray-400">
                                                                {selectedToken === 'native' ? 'XLM' : 'USDC'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="ml-4 flex-shrink-0 flex items-center space-x-2">
                                                    <button
                                                        onClick={() => openEditModal(recipient)}
                                                        className="p-2 rounded-lg bg-gray-800/80 hover:bg-gray-700/80 text-gray-400 hover:text-gray-300 transition-colors"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>

                                                    {!recipient.isEmployee && (
                                                        <button
                                                            onClick={() => removeRecipient(recipient.id)}
                                                            className="p-2 rounded-lg bg-red-900/20 hover:bg-red-900/40 text-red-400 transition-colors"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            )}

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-center space-x-4 mt-4">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`px-4 py-2 rounded-lg ${currentPage === 1 ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                                    >
                                        Previous
                                    </button>
                                    <span className="text-gray-400">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`px-4 py-2 rounded-lg ${currentPage === totalPages ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </div>

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
                                            <p className="text-gray-300 text-sm break-all mt-0.5">{status}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Submit Button */}
                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={submitTransfer}
                            disabled={
                                isProcessing ||
                                !address ||
                                recipients.filter(r => selectedRecipients[r.id]).length === 0
                            }
                            className={`w-full p-4 rounded-xl font-medium transition-all duration-200 
                                ${isProcessing || !address || recipients.filter(r => selectedRecipients[r.id]).length === 0
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
                                    <span>Processing {recipients.filter(r => selectedRecipients[r.id]).length} Payments...</span>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center space-x-2">
                                    <Wallet className="w-5 h-5" />
                                    <span>{address ? `Send Payments to ${recipients.filter(r => selectedRecipients[r.id]).length} Recipients` : 'Connect Wallet to Process Payments'}</span>
                                </div>
                            )}
                        </motion.button>
                    </div>
                </motion.div>

                {/* Footer */}
                <motion.div variants={itemVariants} className="mt-8 text-center">
                    <p className="text-sm text-gray-500">
                        Powered by Stellar Network | Running on Testnet
                    </p>
                </motion.div>
            </div>

            {/* Edit Recipient Modal */}
            <AnimatePresence>
                {showEditModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="bg-gray-900 border border-gray-800 rounded-xl shadow-2xl max-w-lg w-full"
                        >
                            <div className="flex items-center justify-between p-5 border-b border-gray-800">
                                <h3 className="text-lg font-medium text-white">Edit Recipient</h3>
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="p-1 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-5 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                                    <input
                                        type="text"
                                        value={currentEditRecipient?.name || ''}
                                        onChange={(e) => setCurrentEditRecipient({ ...currentEditRecipient, name: e.target.value })}
                                        className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Stellar Account ID</label>
                                    <input
                                        type="text"
                                        value={currentEditRecipient?.accountId || ''}
                                        onChange={(e) => setCurrentEditRecipient({ ...currentEditRecipient, accountId: e.target.value })}
                                        className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Amount</label>
                                    <input
                                        type="number"
                                        value={currentEditRecipient?.amount || ''}
                                        onChange={(e) => setCurrentEditRecipient({ ...currentEditRecipient, amount: e.target.value })}
                                        className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center justify-end space-x-3 p-5 border-t border-gray-800">
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={saveEditedRecipient}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Add Recipient Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="bg-gray-900 border border-gray-800 rounded-xl shadow-2xl max-w-lg w-full"
                        >
                            <div className="flex items-center justify-between p-5 border-b border-gray-800">
                                <h3 className="text-lg font-medium text-white">Add New Recipient</h3>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="p-1 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-5 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                                    <input
                                        type="text"
                                        value={newRecipient.name}
                                        onChange={(e) => setNewRecipient({ ...newRecipient, name: e.target.value })}
                                        className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                                        placeholder="Recipient Name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Stellar Account ID</label>
                                    <input
                                        type="text"
                                        value={newRecipient.accountId}
                                        onChange={(e) => setNewRecipient({ ...newRecipient, accountId: e.target.value })}
                                        className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                                        placeholder="G..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Amount</label>
                                    <input
                                        type="number"
                                        value={newRecipient.amount}
                                        onChange={(e) => setNewRecipient({ ...newRecipient, amount: e.target.value })}
                                        className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center justify-end space-x-3 p-5 border-t border-gray-800">
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={addNewRecipient}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
                                >
                                    Add Recipient
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}