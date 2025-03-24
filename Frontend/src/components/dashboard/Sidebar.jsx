import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  BadgeDollarSign,
  Award,
  Settings,
  LogOut,
  Bot,
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/employer/dashboard" },
  { icon: Users, label: "Employees", path: "/employer/employees" },
  // { icon: BadgeDollarSign, label: "Payments", path: "/employer/payments" },
  { icon: BadgeDollarSign, label: "Payments", path: "/bulk" },
  // { icon: Award, label: "ESOPS/RSU", path: "/employer/esops" },
  // { icon: Settings, label: "Settings", path: "/employer/settings" },
];

export default function Sidebar({
  isWalletConnected,
  onConnectWallet,
  account,
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.setItem("token", null);
    navigate("/auth?mode=login");
  };
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-crypto-card border-r border-gray-800">
      <div className="flex flex-col h-full">
        {/* Company Name */}
        <div className="p-6 border-b border-gray-800 flex flex-col gap-y-3">
          <Link to="/employer/dashboard" className="block">
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              PayZoll
            </h1>
          </Link>
          {/* <Link
            to="https://web-agent-client.onrender.com"
            className="text-center font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-full hover:shadow-lg hover:shadow-indigo-500/20 transition-all"
          >
            PayZoll Agent
          </Link> */}
          {/* <Link
            to="./botintro"
            className="text-center font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-full hover:shadow-lg hover:shadow-indigo-500/20 transition-all"
          >
            PayZoll Agent
          </Link> */}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all group relative ${isActive
                  ? "text-white bg-indigo-500/10 border border-indigo-500/50"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 rounded-xl"
                  />
                )}
                <item.icon
                  className={`w-5 h-5 ${isActive ? "text-indigo-400" : "group-hover:text-indigo-400"
                    }`}
                />
                <span className="relative">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Wallet Connection */}
        <div className="p-4 border-t border-gray-800">
          {isWalletConnected ? (
            <div className="bg-crypto-dark/50 p-4 rounded-xl border border-indigo-500/20">
              <div className="text-sm text-gray-400">Connected Wallet</div>
              <div className="text-indigo-400 font-mono text-sm truncate">
                {account}
              </div>
            </div>
          ) : (
            <button
              onClick={onConnectWallet}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-xl
                       hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-200 flex items-center justify-center"
            >
              Connect Wallet
            </button>
          )}
        </div>

        {/* Logout */}
        <button
          className="flex items-center space-x-3 px-8 py-6 text-gray-400 hover:text-white transition-colors border-t border-gray-800"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
