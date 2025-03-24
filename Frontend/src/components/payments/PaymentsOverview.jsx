import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, TrendingUp, Clock, CheckCircle } from "lucide-react";

export default function PaymentsOverview({ employees, totalSalary, totalSalaryPaid }) {
  const stats = [
    {
      title: "Total Payroll (This Month)",
      value: `${totalSalary} Dollar`,
      change: "+12%",
      icon: DollarSign,
      color: "from-indigo-600 to-purple-600",
    },
    {
      title: "Total Paid (MTD)",
      value: `${totalSalaryPaid} Dollar`,
      change: "+8%",
      icon: TrendingUp,
      color: "from-green-600 to-emerald-600",
    },
    {
      title: "Payment Success Rate",
      value: "98.5%",
      change: "+1.5%",
      icon: CheckCircle,
      color: "from-blue-600 to-indigo-600",
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-crypto-card border border-gray-800 rounded-xl p-6 hover:border-indigo-500/50 transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-gray-400 text-sm">{stat.title}</h3>
              <div className="text-3xl font-bold mt-1 group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-purple-400 group-hover:bg-clip-text group-hover:text-transparent transition-all">
                {stat.value}
              </div>
            </div>
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center transform transition-transform group-hover:scale-110`}
            >
              <stat.icon className="w-6 h-6 text-white" />
            </div>
          </div>
          <div
            className={`text-sm ${
              stat.isNegative ? "text-red-400" : "text-green-400"
            }`}
          >
            {stat.change} from last month
          </div>
        </motion.div>
      ))}
    </div>
  );
}
