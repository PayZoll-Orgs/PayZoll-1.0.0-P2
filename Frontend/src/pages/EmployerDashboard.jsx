import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "../components/dashboard/Sidebar";
import QuickActions from "../components/dashboard/QuickActions";
import OverviewMetrics from "../components/dashboard/OverviewMetrics";
import GraphSection from "../components/dashboard/GraphSection";
import BalanceSection from "../components/dashboard/BalanceSection";
import RecentActivity from "../components/dashboard/RecentActivity";
import { useWeb3 } from "../context/useWeb3";

export default function EmployerDashboard() {
  const { provider, signer, account } = useWeb3();

  useEffect(() => {
    const pingServer = async () => {
      try {
        const response = await fetch('https://payzoll-1-0-0-p2-backend-stellar.onrender.com/ping', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: `Hello from account ${account}` }),
        });
        const data = await response.json();
        console.log('Server response:', data);
      } catch (error) {
        console.error('Error pinging server:', error);
      }
    };

    pingServer();
  });

  return (
    <div className="min-h-screen bg-crypto-dark text-white flex">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-grid-pattern opacity-[0.02]"></div>
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-radial from-indigo-900/20 via-transparent to-transparent"></div>
      </div>

      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-[500px] h-[500px] rounded-full"
            initial={{ opacity: 0.1 }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.2, 1],
              x: [0, 100, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              background: `radial-gradient(circle, ${i === 0
                ? "rgba(99,102,241,0.1)"
                : i === 1
                  ? "rgba(139,92,246,0.1)"
                  : "rgba(168,85,247,0.1)"
                } 0%, transparent 70%)`,
              left: `${i * 30}%`,
              top: `${i * 20}%`,
            }}
          />
        ))}
      </div>

      {/* Sidebar */}
      <Sidebar
        isWalletConnected={account != undefined}
        onConnectWallet={() => console.log("TODO")}
        account={account}
      />

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 relative">
        <div className="max-w-[1600px] mx-auto space-y-6">
          {/* Quick Actions */}
          <QuickActions isWalletConnected={account != undefined} />

          {/* Main Grid Layout */}
          <div className="grid grid-cols-12 gap-6">
            {/* First Row: Metrics and Balance */}
            <motion.div
              className="col-span-12 lg:col-span-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <OverviewMetrics type="employees" />
            </motion.div>

            <motion.div
              className="col-span-12 lg:col-span-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <OverviewMetrics type="amount" />
            </motion.div>

            <motion.div
              className="col-span-12 lg:col-span-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <BalanceSection isWalletConnected={account != undefined} />
            </motion.div>

            {/* Second Row: Graph and Recent Activity */}
            <motion.div
              className="col-span-12 lg:col-span-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <GraphSection />
            </motion.div>

            <motion.div
              className="col-span-12 lg:col-span-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <RecentActivity />
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
