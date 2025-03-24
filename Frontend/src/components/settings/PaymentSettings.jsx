import React from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, Wallet, ArrowUpRight, 
  Clock, Settings, AlertTriangle 
} from 'lucide-react';

export default function PaymentSettings() {
  return (
    <div className="space-y-6">
      {/* Default Payment Method */}
      <div className="bg-crypto-card border border-gray-800 rounded-xl p-6 hover:border-indigo-500/50 transition-all">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 
                          flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Default Payment Method</h2>
              <p className="text-sm text-gray-400">Configure your preferred payment settings</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Primary Currency</label>
            <select className="w-full bg-crypto-dark border border-gray-800 rounded-xl py-2 px-4
                           focus:outline-none focus:border-indigo-500 transition-colors">
              <option value="Dollar">Dollar - Ethereum</option>
              <option value="usdt">USDT - Tether</option>
              <option value="usdc">USDC - USD Coin</option>
              <option value="dai">DAI - Dai</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Gas Fee Strategy</label>
            <select className="w-full bg-crypto-dark border border-gray-800 rounded-xl py-2 px-4
                           focus:outline-none focus:border-indigo-500 transition-colors">
              <option value="standard">Standard</option>
              <option value="fast">Fast</option>
              <option value="instant">Instant</option>
            </select>
          </div>
        </div>

        <div className="mt-6 p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
            <p className="text-sm text-yellow-200/80">
              Gas fees will be automatically calculated based on network conditions. 
              Higher priority transactions may incur additional costs.
            </p>
          </div>
        </div>
      </div>

      {/* Recurring Payments */}
      <div className="bg-crypto-card border border-gray-800 rounded-xl p-6 hover:border-indigo-500/50 transition-all">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 
                          flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Recurring Payments</h2>
              <p className="text-sm text-gray-400">Set up automated payment schedules</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer 
                          peer-checked:after:translate-x-full peer-checked:after:border-white 
                          after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                          after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all
                          peer-checked:bg-indigo-600"></div>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Payment Interval</label>
            <select className="w-full bg-crypto-dark border border-gray-800 rounded-xl py-2 px-4
                           focus:outline-none focus:border-indigo-500 transition-colors">
              <option value="weekly">Weekly</option>
              <option value="biweekly">Bi-weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Payment Day</label>
            <select className="w-full bg-crypto-dark border border-gray-800 rounded-xl py-2 px-4
                           focus:outline-none focus:border-indigo-500 transition-colors">
              <option value="1">1st of month</option>
              <option value="15">15th of month</option>
              <option value="last">Last day of month</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transaction Limits */}
      <div className="bg-crypto-card border border-gray-800 rounded-xl p-6 hover:border-indigo-500/50 transition-all">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 
                        flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Transaction Limits</h2>
            <p className="text-sm text-gray-400">Set maximum transaction amounts</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Daily Limit (Dollar)</label>
            <input 
              type="number"
              className="w-full bg-crypto-dark border border-gray-800 rounded-xl py-2 px-4
                       focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="Enter amount"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Transaction Limit (Dollar)</label>
            <input 
              type="number"
              className="w-full bg-crypto-dark border border-gray-800 rounded-xl py-2 px-4
                       focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="Enter amount"
            />
          </div>
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="bg-crypto-card border border-gray-800 rounded-xl p-6 hover:border-indigo-500/50 transition-all">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 
                        flex items-center justify-center">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Advanced Settings</h2>
            <p className="text-sm text-gray-400">Configure additional payment options</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-crypto-dark rounded-xl border border-gray-800">
            <div>
              <div className="font-semibold">Smart Contract Interaction</div>
              <div className="text-sm text-gray-400">Enable direct contract calls</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer 
                            peer-checked:after:translate-x-full peer-checked:after:border-white 
                            after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                            after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all
                            peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-crypto-dark rounded-xl border border-gray-800">
            <div>
              <div className="font-semibold">Multi-signature Requirement</div>
              <div className="text-sm text-gray-400">Require multiple approvals</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer 
                            peer-checked:after:translate-x-full peer-checked:after:border-white 
                            after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                            after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all
                            peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-crypto-dark rounded-xl border border-gray-800">
            <div>
              <div className="font-semibold">Auto-convert to Stablecoin</div>
              <div className="text-sm text-gray-400">Convert volatile assets automatically</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer 
                            peer-checked:after:translate-x-full peer-checked:after:border-white 
                            after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                            after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all
                            peer-checked:bg-indigo-600"></div>
            </label>
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