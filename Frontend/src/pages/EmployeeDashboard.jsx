import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Wallet,
  LogOut,
  ChevronDown,
  Activity,
  Sparkles
} from "lucide-react";
import QuickPanel from "../components/employee/QuickPanel";
import EmployeeOverview from "../components/employee/EmployeeOverview";
import PaymentSection from "../components/employee/PaymentSection";
import ESOPSection from "../components/employee/ESOPSection";
import AnalyticsSection from "../components/employee/AnalyticsSection";
import RecentActivity from "../components/employee/RecentActivity";
import { useWeb3 } from "../context/useWeb3";
import axios from "axios";
import { backendDomain } from "../constant/domain";
import TokenBridgeSection from "../components/TokenBridgeSection";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function EmployeeDashboard() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { provider, signer, account } = useWeb3();
  const [employeeInfo, setEmployeeInfo] = useState(undefined);
  const [employeeTokenInfo, setEmployeeTokenInfo] = useState(undefined);
  const [employeeHistoryInfo, setEmployeeHistoryInfo] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.setItem("token", null);
    navigate("/auth?mode=login");
  };

  const getEmployeeInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${backendDomain}/employee`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEmployeeInfo(response.data.employee);
    } catch (error) {
      console.error("Error fetching employee info:", error);
    }
  };

  const getEmployeeTokenInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${backendDomain}/employee/token`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEmployeeTokenInfo(response.data.token);
    } catch (error) {
      console.error("Error fetching token info:", error);
    }
  };

  const getEmployeePayrollHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${backendDomain}/employee/payroll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEmployeeHistoryInfo(response.data.payroll);
    } catch (error) {
      console.error("Error fetching payroll history:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([
        getEmployeeInfo(),
        getEmployeeTokenInfo(),
        getEmployeePayrollHistory()
      ]);
      setIsLoading(false);
    };
    fetchData();
  }, [provider, signer]);

  if (isLoading || !employeeInfo || !employeeTokenInfo || !employeeHistoryInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
          className="flex items-center space-x-2"
        >
          <Sparkles className="w-6 h-6 text-indigo-400" />
          <span className="text-xl font-medium text-white">Loading...</span>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(99, 102, 241, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(99, 102, 241, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            animation: 'gradientMove 20s linear infinite'
          }}
        />

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            initial={{ x: 0, y: 0 }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              background: `rgba(99, 102, 241, ${Math.random() * 0.3 + 0.1})`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative">
        {/* Header */}
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800/50"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              {/* Profile Section */}
              <motion.div
                className="flex items-center space-x-4"
                whileHover={{ scale: 1.02 }}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-lg opacity-50" />
                  <div className="relative w-12 h-12 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center ring-2 ring-indigo-500/20">
                    <span className="text-lg font-bold">
                      {employeeInfo.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div>
                  <motion.h1
                    className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    Welcome back, {employeeInfo.name}!
                  </motion.h1>
                  <motion.p
                    className="text-sm text-gray-400"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    {employeeInfo.designation}
                  </motion.p>
                </div>
              </motion.div>

              {/* Actions */}
              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-3 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 transition-colors relative backdrop-blur-sm border border-gray-700/50"
                  >
                    <Bell className="w-5 h-5 text-gray-300" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full ring-2 ring-indigo-500/20" />
                  </button>
                </motion.div>

                {/* Wallet Connection */}
                <AnimatePresence mode="wait">
                  {account ? (
                    <motion.div
                      key="connected"
                      {...fadeInUp}
                      className="px-4 py-2 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50"
                    >
                      <div className="flex items-center space-x-2">
                        <Wallet className="w-4 h-4 text-indigo-400" />
                        <span className="text-sm text-gray-400">Connected</span>
                      </div>
                      <div className="font-mono text-sm text-gray-300 truncate max-w-[150px]">
                        {account}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.button
                      key="connect"
                      {...fadeInUp}
                      onClick={() => setIsWalletConnected(true)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 
                               hover:shadow-lg hover:shadow-indigo-500/20 transition-all flex items-center space-x-2"
                    >
                      <Wallet className="w-4 h-4" />
                      <span>Connect Wallet</span>
                    </motion.button>
                  )}
                </AnimatePresence>

                {/* Logout */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 
                           transition-all flex items-center space-x-2 border border-red-500/20"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <motion.main
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6"
        >
          {/* Quick Panel */}
          <motion.div variants={fadeInUp}>
            <QuickPanel isWalletConnected={account !== undefined} />
          </motion.div>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-12 gap-6">
            {/* Employee Overview */}
            <motion.div
              className="col-span-12 lg:col-span-8"
              variants={fadeInUp}
            >
              <EmployeeOverview
                employeeInfo={employeeInfo}
                employeeTokenInfo={employeeTokenInfo}
                employeeHistoryInfo={employeeHistoryInfo}
              />
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              className="col-span-12 lg:col-span-4"
              variants={fadeInUp}
            >
              <RecentActivity
                employeeInfo={employeeInfo}
                employeeTokenInfo={employeeTokenInfo}
              />
            </motion.div>

            {/* Payment Section */}
            <motion.div
              className="col-span-12 lg:col-span-6"
              variants={fadeInUp}
            >
              <PaymentSection
                employeeHistoryInfo={employeeHistoryInfo}
                employeeInfo={employeeInfo}
              />
            </motion.div>

            {/* ESOP Section */}
            <motion.div
              className="col-span-12 lg:col-span-6"
              variants={fadeInUp}
            >
              <ESOPSection employeeTokenInfo={employeeTokenInfo} />
            </motion.div>

            {/* Token Bridge Section */}
            <motion.div
              className="col-span-12"
              variants={fadeInUp}
            >
              <TokenBridgeSection employeeTokenInfo={employeeTokenInfo} />
            </motion.div>

            {/* Analytics Section */}
            <motion.div
              className="col-span-12"
              variants={fadeInUp}
            >
              <AnalyticsSection />
            </motion.div>
          </div>
        </motion.main>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }

        @keyframes gradientMove {
          0% { background-position: 0 0; }
          100% { background-position: 40px 40px; }
        }
      `}</style>
    </div>
  );
}