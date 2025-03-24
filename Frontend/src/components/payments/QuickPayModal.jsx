import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, DollarSign, Users, AlertCircle } from "lucide-react";

export default function QuickPayModal({
  isOpen,
  onClose,
  payEmployees,
  totalSalary,
  network,
  account,
  employees,
}) {
  const [step, setStep] = useState(1);
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-crypto-card w-full max-w-xl mx-4 rounded-2xl border border-gray-800 overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Quick Pay</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Payment Summary */}
            <div className="bg-crypto-dark rounded-xl p-6 border border-gray-800 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-12 h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 
                                flex items-center justify-center"
                  >
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Total Amount</h3>
                    <div className="text-2xl font-bold text-indigo-400">
                      {totalSalary} Dollar
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>{employees.length} Employees</span>
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    {account.substring(0, 20)}...
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="bg-crypto-card/50 rounded-lg p-3">
                  <div className="text-gray-400">Gas Fee (Est.)</div>
                  <div className="font-semibold text-green-400">$0.01</div>
                </div>
                <div className="bg-crypto-card/50 rounded-lg p-3">
                  <div className="text-gray-400">Processing Time</div>
                  <div className="font-semibold">~30 seconds</div>
                </div>
                <div className="bg-crypto-card/50 rounded-lg p-3">
                  <div className="text-gray-400">Network</div>
                  <div className="font-semibold">{network.name}</div>
                </div>
              </div>
            </div>

            {/* Warning */}
            <div className="bg-orange-500/10 rounded-xl p-4 border border-orange-500/20 mb-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="text-orange-200 font-semibold">
                    Important Notice:
                  </p>
                  <p className="text-orange-200/80 mt-1">
                    This action will process payments for all active employees.
                    Please ensure you have sufficient funds in your wallet
                    before proceeding.
                  </p>
                </div>
              </div>
            </div>

            {/* Confirmation Checkbox */}
            <label className="flex items-start space-x-3 mb-6">
              <input
                type="checkbox"
                className="mt-1 rounded border-gray-700 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-400">
                I confirm that I want to process payments for all active
                employees and understand that this action cannot be undone.
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="p-6 border-t border-gray-800">
            <div className="flex items-center justify-end space-x-4">
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-xl border border-gray-800 text-gray-400
                         hover:text-white hover:border-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={payEmployees}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600
                         text-white hover:shadow-lg hover:shadow-indigo-500/20 transition-all"
              >
                Confirm & Pay
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
