import React from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  ArrowLeftRight,
  PiggyBank,
  Landmark,
  UserPlus,
  Users,
} from "lucide-react";
import { useWeb3 } from "../../context/useWeb3";
import { useNavigate } from "react-router-dom";

export default function QuickActions({ isWalletConnected }) {
  const { provider, signer, account } = useWeb3();
  const navigate = useNavigate();

  const actions = [
    {
      icon: DollarSign,
      label: "Buy/Sell Crypto",
      color: "from-green-600 to-emerald-600",
      onClick: () => console.log("Buy/Sell Crypto clicked"),
    },
    {
      icon: ArrowLeftRight,
      label: "Swap Crypto",
      color: "from-blue-600 to-indigo-600",
      onClick: () => console.log("Swap Crypto clicked"),
    },
    {
      icon: PiggyBank,
      label: "Lending",
      color: "from-purple-600 to-indigo-600",
      onClick: () => navigate("/lending"),
    },
    {
      icon: Landmark,
      label: "Stake",
      color: "from-pink-600 to-purple-600",
      onClick: () => navigate("/stake"),
    },
    {
      icon: Users,
      label: "Pay Employees",
      color: "from-indigo-600 to-purple-600",
      onClick: () => navigate("/bulk"),
    },
    {
      icon: UserPlus,
      label: "Add Employee",
      color: "from-violet-600 to-indigo-600",
      onClick: () => navigate("/employer/employees"),
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {actions.map((action, index) => (
        <motion.button
          key={action.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`group relative p-4 bg-crypto-card rounded-xl border border-gray-800 
                     hover:border-indigo-500/50 transition-all duration-300 ${
                       !isWalletConnected ? "opacity-50 cursor-not-allowed" : ""
                     }`}
          disabled={!isWalletConnected}
          onClick={action.onClick}
        >
          <div
            className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300"
            style={{
              backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`,
            }}
          ></div>

          <div className="flex flex-col items-center space-y-2">
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-r ${action.color} 
                           flex items-center justify-center transform group-hover:scale-110 transition-transform`}
            >
              <action.icon className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
              {action.label}
            </span>
          </div>
        </motion.button>
      ))}
    </div>
  );
}
