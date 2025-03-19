import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CHAINS } from '../constant/chain';
import { useWeb3 } from '../context/useWeb3';
import axios from 'axios'; // Add this import
import Sidebar from "../components/dashboard/Sidebar";

// Define native token placeholder (using zero address)
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

function Bulk() {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployees, setSelectedEmployees] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);

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

    // Fetch employees from API (simulated)
    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        setIsLoadingEmployees(true);

        try {
            // In a real app, replace this with actual API call:
            // const response = await axios.get('/api/employees');
            // const data = response.data;

            // Simulating API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Use dummy data instead of API call for now
            setEmployees(dummyEmployeeData);

            // Initialize all employees as selected
            const initialSelected = {};
            dummyEmployeeData.forEach(emp => {
                initialSelected[emp.id] = true;
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
            newSelected[emp.id] = isChecked;
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
        e.preventDefault();
        await switchNetwork(parseInt(e.target.value));
    };

    const onTokenChange = (e) => {
        handleTokenChange(e.target.value);
    };

    const handlePayEmployees = async () => {
        setIsLoading(true);

        try {
            // Filter selected employees
            const selectedEmps = employees.filter(emp => selectedEmployees[emp.id]);

            if (selectedEmps.length === 0) {
                throw new Error("Please select at least one employee to pay");
            }

            // Extract addresses and amounts
            const recipientAddresses = selectedEmps.map(emp => emp.walletAddress);
            const amounts = selectedEmps.map(emp => emp.salary);

            // Execute bulk transfer
            const result = await sendBulkTransfer(recipientAddresses, amounts);

            if (result && result.success) {
                // Show success message or additional info
            }
        } catch (error) {
            console.error("Error paying employees:", error);
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

    return (<>
        <Sidebar
            isWalletConnected={account != undefined}
            onConnectWallet={() => console.log("TODO")}
            account={account}
        />
        <div className="min-h-screen bg-[#0A0F1C] py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="max-w-6xl mx-auto" // Increased width for table
            >
                <div className="text-center mb-12">
                    <motion.h1
                        className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-400"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        Bulk Payroll Dashboard
                    </motion.h1>
                    <motion.p
                        className="mt-3 text-gray-400"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        Process employee payments in a single transaction
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

                            {/* Employee Table Section */}
                            <motion.div variants={fadeInUp} className="mb-8">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold text-gray-200">Employee Payroll</h2>
                                    <button
                                        onClick={fetchEmployees}
                                        disabled={isLoadingEmployees}
                                        className="px-3 py-1 text-sm bg-indigo-600 hover:bg-indigo-700 rounded-md text-white"
                                    >
                                        {isLoadingEmployees ? 'Loading...' : 'Refresh'}
                                    </button>
                                </div>

                                <div className="overflow-x-auto">
                                    {isLoadingEmployees ? (
                                        <div className="flex justify-center p-8">
                                            <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    ) : employees.length > 0 ? (
                                        <table className="w-full bg-[#1C2333] rounded-xl overflow-hidden">
                                            <thead>
                                                <tr className="bg-[#141C2E] text-left">
                                                    <th className="p-4 text-gray-300 font-medium">
                                                        <div className="flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-violet-500 focus:ring-violet-500"
                                                                checked={employees.every(emp => selectedEmployees[emp.id])}
                                                                onChange={handleSelectAll}
                                                            />
                                                            <span className="ml-2">Select All</span>
                                                        </div>
                                                    </th>
                                                    <th className="p-4 text-gray-300 font-medium">Name</th>
                                                    <th className="p-4 text-gray-300 font-medium">Department</th>
                                                    <th className="p-4 text-gray-300 font-medium">Wallet Address</th>
                                                    <th className="p-4 text-gray-300 font-medium">Salary ({selectedToken?.symbol || 'ETH'})</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {employees.map((employee) => (
                                                    <tr key={employee.id} className="border-t border-gray-800">
                                                        <td className="p-4">
                                                            <input
                                                                type="checkbox"
                                                                className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-violet-500 focus:ring-violet-500"
                                                                checked={selectedEmployees[employee.id] || false}
                                                                onChange={() => handleSelectEmployee(employee.id)}
                                                            />
                                                        </td>
                                                        <td className="p-4 text-gray-200">{employee.name}</td>
                                                        <td className="p-4 text-gray-200">{employee.department}</td>
                                                        <td className="p-4 font-mono text-gray-300">
                                                            {employee.walletAddress.substring(0, 6)}...{employee.walletAddress.substring(employee.walletAddress.length - 4)}
                                                        </td>
                                                        <td className="p-4 text-gray-200">{employee.salary}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <div className="bg-[#1C2333] rounded-xl p-10 text-center text-gray-400">
                                            No employee data available
                                        </div>
                                    )}
                                </div>
                            </motion.div>

                            {/* Pay Button */}
                            <motion.div variants={fadeInUp}>
                                <button
                                    onClick={handlePayEmployees}
                                    disabled={isLoading || !account || employees.length === 0 || Object.values(selectedEmployees).every(v => !v)}
                                    className={`w-full py-4 px-6 rounded-xl font-medium text-white 
                                        ${isLoading || !account || employees.length === 0 || Object.values(selectedEmployees).every(v => !v)
                                            ? 'bg-gray-700 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700'
                                        } transition-all duration-200 transform hover:scale-[1.02]`}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center space-x-2">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>Processing Payment...</span>
                                        </div>
                                    ) : !account ? 'Connect Wallet to Continue' : 'Pay Selected Employees'}
                                </button>
                            </motion.div>
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
    </>
    );
}

export default Bulk;