import React, { useEffect, useState } from "react";
import { formatEther } from "ethers";
import { Wallet, ArrowUpRight, Plus, RefreshCcw } from "lucide-react";
import { useWeb3 } from "../../context/useWeb3";

export default function PayrollBudget({ totalSalary }) {
  const { provider, signer, account } = useWeb3();
  const [balance, setBalance] = useState(0);

  const fetchAccountBalance = async () => {
    if (provider) {
      setBalance(formatEther(await provider.getBalance(account)));
    }
  };

  useEffect(() => {
    fetchAccountBalance();
  }, [provider, signer, account]);
  return (
    <div className="bg-crypto-card border border-gray-800 rounded-xl p-6 hover:border-indigo-500/50 transition-all">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Payroll Budget</h2>
        <button
          className="text-gray-400 hover:text-white transition-colors"
          onClick={() => window.location.reload()}
        >
          <RefreshCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Wallet Balance */}
      <div className="bg-crypto-dark rounded-xl p-6 border border-gray-800 mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <div
            className="w-12 h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 
                        flex items-center justify-center"
          >
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-sm text-gray-400">Available Balance</div>
            <div className="text-2xl font-bold text-white">{balance} Dollar</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-crypto-card/50 rounded-lg p-3">
            <div className="text-gray-400">Required</div>
            <div className="font-semibold text-indigo-400">
              {totalSalary} Dollar
            </div>
          </div>
          <div className="bg-crypto-card/50 rounded-lg p-3">
            <div className="text-gray-400">Surplus</div>
            <div className="font-semibold text-green-400 overflow-x-auto">
              {balance - totalSalary} Dollar
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button
          className="group bg-crypto-dark hover:bg-crypto-dark/70 border border-gray-800 
                         hover:border-indigo-500/50 rounded-xl p-4 transition-all"
        >
          <div className="flex items-center justify-center space-x-2">
            <Plus className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
            <span className="text-gray-400 group-hover:text-white transition-colors">
              Add Funds
            </span>
          </div>
        </button>

        <button
          className="group bg-crypto-dark hover:bg-crypto-dark/70 border border-gray-800 
                         hover:border-indigo-500/50 rounded-xl p-4 transition-all"
        >
          <div className="flex items-center justify-center space-x-2">
            <ArrowUpRight className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
            <span className="text-gray-400 group-hover:text-white transition-colors">
              Withdraw
            </span>
          </div>
        </button>
      </div>

      {/* Connected Wallet */}
      <div className="mt-6 p-4 bg-crypto-dark/50 rounded-xl border border-gray-800">
        <div className="flex items-center justify-between overflow-x-auto">
          <div>
            <div className="text-sm text-gray-400">Connected Wallet</div>
            <div className="font-mono text-sm mt-1">{account}</div>
          </div>
          {/* <button className="text-indigo-400 hover:text-indigo-300 transition-colors text-sm">
            Change
          </button> */}
        </div>
      </div>
    </div>
  );
}
