import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet, ArrowUpRight, ArrowDownRight, 
  RefreshCcw, AlertTriangle, ExternalLink 
} from 'lucide-react';

export default function WalletSettings({ isWalletConnected }) {
  const [showChangeWallet, setShowChangeWallet] = useState(false);

  const wallets = [
    {
      id: 1,
      name: 'MetaMask',
      address: '0x1234...5678',
      balance: '12.5 Dollar',
      primary: true
    },
    {
      id: 2,
      name: 'WalletConnect',
      address: '0x8765...4321',
      balance: '5.2 Dollar',
      primary: false
    }
  ];

  const recentTransactions = [
    {
      id: 1,
      type: 'outgoing',
      amount: '2.5 Dollar',
      timestamp: '2 hours ago',
      status: 'completed',
      hash: '0xabcd...efgh'
    },
    {
      id: 2,
      type: 'incoming',
      amount: '5.0 Dollar',
      timestamp: '1 day ago',
      status: 'completed',
      hash: '0xijkl...mnop'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Connected Wallets */}
      <div className="bg-crypto-card border border-gray-800 rounded-xl p-6 hover:border-indigo-500/50 transition-all">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 
                          flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Connected Wallets</h2>
              <p className="text-sm text-gray-400">Manage your blockchain wallets</p>
            </div>
          </div>
          <button
            onClick={() => setShowChangeWallet(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600
                     text-white hover:shadow-lg hover:shadow-indigo-500/20 transition-all"
          >
            Connect New Wallet
          </button>
        </div>

        <div className="space-y-4">
          {wallets.map((wallet) => (
            <div
              key={wallet.id}
              className="bg-crypto-dark rounded-xl p-4 border border-gray-800 hover:border-indigo-500/50 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 
                                flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">{wallet.name}</span>
                      {wallet.primary && (
                        <span className="text-xs px-2 py-1 rounded-full bg-indigo-500/10 text-indigo-400">
                          Primary
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-400 font-mono mt-1">
                      {wallet.address}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{wallet.balance}</div>
                  <button className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction Limits */}
      <div className="bg-crypto-card border border-gray-800 rounded-xl p-6 hover:border-indigo-500/50 transition-all">
        <h2 className="text-xl font-bold mb-6">Transaction Limits</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Daily Transaction Limit</label>
            <div className="relative">
              <input
                type="number"
                className="w-full bg-crypto-dark border border-gray-800 rounded-xl py-2 px-4
                         focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="Enter amount in Dollar"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">Dollar</span>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Single Transaction Limit</label>
            <div className="relative">
              <input
                type="number"
                className="w-full bg-crypto-dark border border-gray-800 rounded-xl py-2 px-4
                         focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="Enter amount in Dollar"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">Dollar</span>
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
            <p className="text-sm text-yellow-200/80">
              Transaction limits help protect your funds. Once set, transactions exceeding these limits
              will require additional confirmation.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-crypto-card border border-gray-800 rounded-xl p-6 hover:border-indigo-500/50 transition-all">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Recent Transactions</h2>
          <button className="text-indigo-400 hover:text-indigo-300 transition-colors">
            View All
          </button>
        </div>

        <div className="space-y-4">
          {recentTransactions.map((tx) => (
            <div
              key={tx.id}
              className="bg-crypto-dark rounded-xl p-4 border border-gray-800 hover:border-indigo-500/50 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center
                                bg-gradient-to-r ${
                                  tx.type === 'incoming'
                                    ? 'from-green-600 to-emerald-600'
                                    : 'from-red-600 to-orange-600'
                                }`}>
                    {tx.type === 'incoming' ? (
                      <ArrowDownRight className="w-5 h-5 text-white" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div>
                    <div className="font-semibold">
                      {tx.type === 'incoming' ? 'Received' : 'Sent'} {tx.amount}
                    </div>
                    <div className="text-sm text-gray-400">{tx.timestamp}</div>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-white transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Backup & Recovery */}
      <div className="bg-crypto-card border border-gray-800 rounded-xl p-6 hover:border-indigo-500/50 transition-all">
        <h2 className="text-xl font-bold mb-6">Backup & Recovery</h2>

        <div className="space-y-4">
          <div className="bg-crypto-dark rounded-xl p-4 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">Download Backup</div>
                <div className="text-sm text-gray-400">Last backup: 2 days ago</div>
              </div>
              <button className="px-4 py-2 rounded-xl bg-indigo-500/10 text-indigo-400
                             hover:bg-indigo-500/20 transition-all">
                Download
              </button>
            </div>
          </div>

          <div className="bg-crypto-dark rounded-xl p-4 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">Recovery Phrase</div>
                <div className="text-sm text-gray-400">View or update recovery phrase</div>
              </div>
              <button className="px-4 py-2 rounded-xl bg-indigo-500/10 text-indigo-400
                             hover:bg-indigo-500/20 transition-all">
                Manage
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          className="px-6 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600
                   text-white hover:shadow-lg hover:shadow-indigo-500/20 transition-all"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}