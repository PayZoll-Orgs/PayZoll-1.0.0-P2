import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  PiggyBank,
  TrendingUp,
  History,
  Wallet,
  ChevronDown,
  ArrowRight,
  AlertTriangle,
  Search,
  X,
} from "lucide-react";
import Sidebar from "../components/dashboard/Sidebar";
import { useWeb3 } from "../context/useWeb3";
import axios from "axios";
import { backendDomain } from "../constant/domain";
import RenderModal from "../components/Models/modal";
import { formatEther } from "ethers";
import { depositEther, withdrawEther } from "../blockchain/scripts/Lending";

const assets = [
  {
    symbol: "Dollar",
    name: "Ethereum",
    lendingRate: "3.5%",
    borrowingRate: "5.2%",
    totalSupply: "1,234.56 Dollar",
    totalBorrowed: "789.12 Dollar",
    walletBalance: "2.5 Dollar",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    lendingRate: "8.2%",
    borrowingRate: "10.5%",
    totalSupply: "2,500,000 USDC",
    totalBorrowed: "1,800,000 USDC",
    walletBalance: "5,000 USDC",
  },
  {
    symbol: "DAI",
    name: "Dai",
    lendingRate: "7.8%",
    borrowingRate: "9.8%",
    totalSupply: "1,800,000 DAI",
    totalBorrowed: "1,200,000 DAI",
    walletBalance: "3,000 DAI",
  },
];

const lendingTHead = [
  "Date & Time",
  "Asset",
  "Type",
  "Amount",
  "Interest Gain",
  "Action",
];
const borrowTHead = [
  "Date & Time",
  "Asset",
  "Type",
  "Collateral Amount",
  "Borrow Amount",
  "Action",
];

const lendingPanel = [
  "Asset",
  "Lending APY",
  "Borrowing APY",
  "Account",
  "Balance (Dollar)",
  "Input Amount",
  "Actions",
];

const borrowingPanel = [
  "Asset",
  "Lending APY",
  "Borrowing APY",
  "Available Dollar",
  "Collateral Amount (10%)",
  "Actions",
];

export default function LendingPage() {
  const [activeTab, setActiveTab] = useState("lend");
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const { provider, signer, account, balance } = useWeb3();
  const [lendingHistory, setLendingHistory] = useState([]);
  const [borrowingHistory, setBorrowingHistory] = useState([]);
  const [lendingModal, setLendingModal] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const totalAssestLent = () => {
    return lendingHistory.reduce(
      (sum, item) => sum + parseFloat(item.amount),
      0
    );
  };

  const totalAssestborrow = () => {
    return borrowingHistory.reduce(
      (sum, item) => sum + parseFloat(item.borrowAmount),
      0
    );
  };

  const getBorrowingHistory = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${backendDomain}/borrowing`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setBorrowingHistory(response.data.response);
  };

  const getLendingHistory = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${backendDomain}/lending`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setLendingHistory(response.data.data);
  };

  const lendToEmployer = async (amount) => {
    const token = localStorage.getItem("token");

    await axios.post(
      `${backendDomain}/lending`,
      {
        amount,
        status: true,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    await depositEther(signer, amount);
    window.location.reload();
  };

  const borrowToEmployer = async (
    borrowAmount,
    collateralAmount,
    lendingId
  ) => {
    const token = localStorage.getItem("token");

    await axios.post(
      `${backendDomain}/borrowing`,
      {
        borrowAmount,
        collateralAmount,
        lendingId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    await depositEther(signer, Number(borrowAmount) + Number(collateralAmount));
    window.location.reload();
  };

  const withdraw = async (id, amount) => {
    const token = localStorage.getItem("token");
    await axios.post(
      `${backendDomain}/lending/withdraw`,
      { id },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    await withdrawEther(signer, amount);
    window.location.reload();
  };

  const repay = async (id, borrowAmount) => {
    const token = localStorage.getItem("token");
    await axios.post(
      `${backendDomain}/borrowing/repay`,
      { id },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    await depositEther(signer, borrowAmount);
    window.location.reload();
  };

  const withdrawCollateral = async (borrowId, lendingId, amount) => {
    const token = localStorage.getItem("token");
    await axios.post(
      `${backendDomain}/borrowing/withdraw`,
      { borrowId, lendingId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    await withdrawEther(signer, amount)
    window.location.reload();
  };

  useEffect(() => {
    getBorrowingHistory();
    getLendingHistory();
  }, []);

  if (activeModal) {
    return (
      <RenderModal
        activeModal={activeModal}
        setActiveModal={setActiveModal}
      ></RenderModal>
    );
  }

  return (
    <div className="min-h-screen bg-crypto-dark text-white flex">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-grid-pattern opacity-[0.02]"></div>
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-radial from-indigo-900/20 via-transparent to-transparent"></div>
      </div>

      {/* Sidebar */}
      <Sidebar
        isWalletConnected={account !== undefined}
        onConnectWallet={() => setIsWalletConnected(true)}
        account={account}
      />

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 relative">
        <div className="max-w-[1600px] mx-auto space-y-6">
          {/* Hero Section */}
          <div className="bg-crypto-card border border-gray-800 rounded-xl p-8 hover:border-indigo-500/50 transition-all">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Lend & Borrow Seamlessly
                </h1>
                <p className="text-gray-400 mt-2">
                  Put your assets to work or access funds instantly, powered by
                  blockchain
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setActiveTab("lend")}
                  className={`px-6 py-2 rounded-xl transition-all ${
                    activeTab === "lend"
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                      : "bg-crypto-dark border border-gray-800 text-gray-400 hover:text-white"
                  }`}
                >
                  Start Lending
                </button>
                <button
                  onClick={() => setActiveTab("borrow")}
                  className={`px-6 py-2 rounded-xl transition-all ${
                    activeTab === "borrow"
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                      : "bg-crypto-dark border border-gray-800 text-gray-400 hover:text-white"
                  }`}
                >
                  Start Borrowing
                </button>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-crypto-dark rounded-xl p-6 border border-gray-800">
                <div className="flex items-center space-x-3 mb-2">
                  <PiggyBank className="w-5 h-5 text-indigo-400" />
                  <span className="text-gray-400">Total Assets Lent</span>
                </div>
                <div className="text-2xl font-bold">
                  {totalAssestLent()} Dollar
                </div>
                <div className="text-green-400 text-sm">+12.5% this month</div>
              </div>

              <div className="bg-crypto-dark rounded-xl p-6 border border-gray-800">
                <div className="flex items-center space-x-3 mb-2">
                  <Wallet className="w-5 h-5 text-purple-400" />
                  <span className="text-gray-400">Total Assets Borrowed</span>
                </div>
                <div className="text-2xl font-bold">
                  {totalAssestborrow()} Dollar
                </div>
                <div className="text-red-400 text-sm">-5.2% this month</div>
              </div>

              <div className="bg-crypto-dark rounded-xl p-6 border border-gray-800">
                <div className="flex items-center space-x-3 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <span className="text-gray-400">
                    Total Interest Earned (Interest Rate: 10%)
                  </span>
                </div>
                <div className="text-2xl font-bold">$3,250</div>
                <div className="text-green-400 text-sm">+8.3% this month</div>
              </div>
            </div>
          </div>

          {/* Assets Panel */}
          <div className="bg-crypto-card border border-gray-800 rounded-xl p-6 hover:border-indigo-500/50 transition-all">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Available Assets</h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search assets..."
                  className="bg-crypto-dark border border-gray-800 rounded-xl py-2 pl-10 pr-4
                           focus:outline-none focus:border-indigo-500 transition-all w-64"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-crypto-dark/90 backdrop-blur-sm">
                  <tr>
                    {activeTab === "lend"
                      ? lendingPanel.map((item) => (
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                            {item}
                          </th>
                        ))
                      : borrowingPanel.map((item) => (
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                            {item}
                          </th>
                        ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {activeTab === "lend" ? (
                    <tr className="group hover:bg-crypto-dark/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 
                                        flex items-center justify-center"
                          >
                            {"E"}
                          </div>
                          <div>
                            <div className="font-semibold">{"Ethereum"}</div>
                            <div className="text-sm text-gray-400">{"Dollar"}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-green-400">
                        {"3.2%"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-purple-400">
                        {"5.2%"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                        {account}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                        {balance ? formatEther(balance) : 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                        <div className="relative flex items-center">
                          <input
                            type="text"
                            placeholder="Enter amount"
                            value={inputValue}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 text-sm text-gray-700 bg-gray-800 border border-gray-700 rounded-lg 
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => {
                            lendToEmployer(inputValue);
                          }}
                          className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600
                                   text-white hover:shadow-lg hover:shadow-indigo-500/20 transition-all"
                        >
                          {"Lend"}
                        </button>
                      </td>
                    </tr>
                  ) : (
                    lendingHistory.map((item, index) => (
                      <tr className="group hover:bg-crypto-dark/30 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <div
                              className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 
                                        flex items-center justify-center"
                            >
                              {"E"}
                            </div>
                            <div>
                              <div className="font-semibold">{"Ethereum"}</div>
                              <div className="text-sm text-gray-400">
                                {"Dollar"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-green-400">
                          {"3.2%"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-purple-400">
                          {"5.2%"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                          {item.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                          {item.amount * 0.1}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.status ? (
                            <button
                              onClick={() =>
                                borrowToEmployer(
                                  item.amount,
                                  item.amount * 0.1,
                                  item._id
                                )
                              }
                              className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600
                                   text-white hover:shadow-lg hover:shadow-indigo-500/20 transition-all"
                            >
                              {"Borrow"}
                            </button>
                          ) : (
                            <span>Not Available</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Portfolio Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Lending Portfolio */}
            <div className="bg-crypto-card border border-gray-800 rounded-xl p-6 hover:border-indigo-500/50 transition-all">
              <h3 className="text-xl font-bold mb-4">Your Lending Portfolio</h3>
              <div className="space-y-4">
                <div className="bg-crypto-dark rounded-xl p-4 border border-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">Total Value Locked</span>
                    <span className="font-bold">$50,000</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Interest Earned</span>
                    <span className="text-green-400">$1,250</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Borrowing Portfolio */}
            <div className="bg-crypto-card border border-gray-800 rounded-xl p-6 hover:border-indigo-500/50 transition-all">
              <h3 className="text-xl font-bold mb-4">
                Your Borrowing Portfolio
              </h3>
              <div className="space-y-4">
                <div className="bg-crypto-dark rounded-xl p-4 border border-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">Total Debt</span>
                    <span className="font-bold">$25,000</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Interest Owed</span>
                    <span className="text-red-400">$450</span>
                  </div>
                </div>

                {/* Health Factor */}
                <div className="bg-crypto-dark rounded-xl p-4 border border-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">Health Factor</span>
                    <span className="text-green-400">1.85</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full w-[85%] bg-gradient-to-r from-green-600 to-emerald-600 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction History */}
          <div className="bg-crypto-card border border-gray-800 rounded-xl p-6 hover:border-indigo-500/50 transition-all">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Transaction History</h3>
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveTab("lend")}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeTab === "lend"
                      ? "bg-indigo-500/10 text-indigo-400"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Lending
                </button>
                <button
                  onClick={() => setActiveTab("borrow")}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeTab === "borrow"
                      ? "bg-indigo-500/10 text-indigo-400"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Borrowing
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-crypto-dark/90 backdrop-blur-sm">
                  <tr>
                    {activeTab === "lend"
                      ? lendingTHead.map((item) => (
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                            {item}
                          </th>
                        ))
                      : borrowTHead.map((item) => (
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                            {item}
                          </th>
                        ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {/* Sample transaction rows */}
                  {activeTab === "lend" &&
                    lendingHistory.map((item, index) => (
                      <tr
                        className="group hover:bg-crypto-dark/30 transition-colors"
                        key={item._id}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                          {item.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">Dollar</td>
                        <td className="px-6 py-4 whitespace-nowrap text-indigo-400">
                          {activeTab}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.amount} Dollar
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.amount} Dollar
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.status ? (
                            <button
                              className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600
                                   text-white hover:shadow-lg hover:shadow-indigo-500/20 transition-all"
                              onClick={() => withdraw(item._id, item.amount)}
                            >
                              Withdraw
                            </button>
                          ) : (
                            <span>Can't Withdraw this time </span>
                          )}
                        </td>
                      </tr>
                    ))}

                  {activeTab === "borrow" &&
                    borrowingHistory.map((item) => (
                      <tr
                        className="group hover:bg-crypto-dark/30 transition-colors"
                        key={item._id}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                          {item.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">Dollar</td>
                        <td className="px-6 py-4 whitespace-nowrap text-indigo-400">
                          {activeTab}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.collateralAmount} Dollar
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.borrowAmount} Dollar
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.borrowAmount == 0 ? (
                            <button
                              onClick={() =>
                                withdrawCollateral(item._id, item.lendingId, item.borrowAmount * 0.1)
                              }
                              className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600
                               text-white hover:shadow-lg hover:shadow-indigo-500/20 transition-all"
                            >
                              Withdraw Your Collateral
                            </button>
                          ) : (
                            <button
                              onClick={() => repay(item._id, item.borrowAmount)}
                              className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600
                               text-white hover:shadow-lg hover:shadow-indigo-500/20 transition-all"
                            >
                              Repay Your Dollar
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
