import React from "react";
import { motion } from "framer-motion";
import {
  Wallet,
  DollarSign,
  Award,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

export default function EmployeeOverview({
  employeeInfo,
  employeeTokenInfo,
  employeeHistoryInfo,
}) {
  const totalTokens = () => {
    return employeeTokenInfo.reduce((sum, token) => sum + token.allocated, 0);
  };

  const totalEarning = () => {
    return employeeHistoryInfo.reduce(
      (sum, history) => sum + parseFloat(history.amount.$numberDecimal),
      0
    );
  };

  return (
    <div className="bg-crypto-card border border-gray-800 rounded-xl p-6 hover:border-indigo-500/50 transition-all h-[420px] flex flex-col">
      <h2 className="text-xl font-bold mb-6">Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-auto">
        {/* Total Earnings */}
        <div className="bg-crypto-dark rounded-xl p-4 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div
              className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 
                          flex items-center justify-center"
            >
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-center text-green-400 text-sm">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              +12.5%
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-gray-400 text-sm">Total Earnings</div>
            <div className="text-2xl font-bold">{totalEarning().toFixed(6)} Dollar</div>
            <div className="text-sm text-gray-400">≈ 45.5 USD</div>
          </div>
        </div>

        {/* Pending Payments */}
        <div className="bg-crypto-dark rounded-xl p-4 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div
              className="w-10 h-10 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 
                          flex items-center justify-center"
            >
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-center text-yellow-400 text-sm">
              Pending
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-gray-400 text-sm">Next Payment</div>
            <div className="text-2xl font-bold">
              {employeeInfo.salary.$numberDecimal} Dollar
            </div>
            <div className="text-sm text-gray-400">Due in 5 days</div>
          </div>
        </div>

        {/* ESOP Tokens */}
        <div className="bg-crypto-dark rounded-xl p-4 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div
              className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 
                          flex items-center justify-center"
            >
              <Award className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-center text-green-400 text-sm">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              +8.3%
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-gray-400 text-sm">ESOP Tokens</div>
            <div className="text-2xl font-bold">{totalTokens()}</div>
            <div className="text-sm text-gray-400">{totalTokens()} vested</div>
          </div>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="mt-6 space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Vesting Progress</span>
            <span className="text-indigo-400">60%</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full w-[60%] bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"
              style={{ transition: "width 1s ease-in-out" }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Performance Metrics</span>
            <span className="text-green-400">85%</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full w-[85%] bg-gradient-to-r from-green-600 to-emerald-600 rounded-full"
              style={{ transition: "width 1s ease-in-out" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
