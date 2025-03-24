import React from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  DollarSign,
  Award,
  ArrowLeftRight,
} from "lucide-react";

export default function RecentActivity({ employeeInfo, employeeTokenInfo }) {
  const totalTokens = () => {
    return employeeTokenInfo.reduce((sum, token) => sum + token.allocated, 0);
  };

  const activities = [
    {
      id: 1,
      type: "payment_received",
      title: "Salary Payment",
      amount: `${employeeInfo.salary.$numberDecimal} Dollar`,
      timestamp: "2 hours ago",
      icon: DollarSign,
      color: "from-green-600 to-emerald-600",
    },
    {
      id: 2,
      type: "token_vested",
      title: "Tokens Vested",
      amount: `${totalTokens()} ESOP`,
      timestamp: "2 hours ago",
      icon: Award,
      color: "from-purple-600 to-pink-600",
    },
    {
      id: 3,
      type: "swap",
      title: "Token Swap",
      amount: "Dollar → USDC",
      timestamp: "2 days ago",
      icon: ArrowLeftRight,
      color: "from-blue-600 to-indigo-600",
    },
  ];

  return (
    <div className="bg-crypto-card border border-gray-800 rounded-xl p-6 hover:border-indigo-500/50 transition-all h-[420px] flex flex-col">
      <h2 className="text-xl font-bold mb-6">Recent Activity</h2>

      <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group bg-crypto-dark/50 rounded-xl p-4 border border-gray-800 hover:border-indigo-500/50 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 rounded-lg bg-gradient-to-r ${activity.color} 
                              flex items-center justify-center transform transition-transform 
                              group-hover:scale-110`}
                >
                  <activity.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold group-hover:text-white transition-colors">
                    {activity.title}
                  </div>
                  <div className="text-sm text-gray-400">{activity.amount}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center text-gray-400 text-sm">
                  <Clock className="w-4 h-4 mr-1" />
                  {activity.timestamp}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <button
        className="w-full mt-4 py-3 rounded-xl bg-crypto-dark border border-gray-800 
                       text-gray-400 hover:text-white hover:border-indigo-500/50 transition-all"
      >
        View All Activity
      </button>
    </div>
  );
}
