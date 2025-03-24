import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Briefcase, Wallet, Calendar, PhoneCall, Mail } from "lucide-react";

export default function AddEmployeeModal({ isOpen, onClose, onAddEmployee }) {
  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    // Extract form values
    const employeeData = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      designation: formData.get("designation"),
      phoneNumber: formData.get("phoneNumber"),
      walletAddress: formData.get("walletAddress"),
      monthlySalary: formData.get("monthlySalary"),
      email: formData.get("email"),
      status: formData.get("status"),
    };

    // Validate all fields are filled
    const allFieldsFilled = Object.values(employeeData).every(
      (value) => value.trim() !== ""
    );

    if (!allFieldsFilled) {
      alert("Please fill out all fields.");
      return;
    }

    // Call the onAddEmployee function with the employee data
    if (onAddEmployee) {
      onAddEmployee(employeeData);
    }

    // Close the modal
    onClose();
  };

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
              <h2 className="text-xl font-bold">Add New Employee</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form className="p-6 space-y-6" onSubmit={handleSubmit}>
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-indigo-400">
                Personal Information
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    First Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="firstName"
                      className="w-full bg-crypto-dark border border-gray-800 rounded-xl py-2 pl-10 pr-4
                               focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="John"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Last Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="lastName"
                      className="w-full bg-crypto-dark border border-gray-800 rounded-xl py-2 pl-10 pr-4
                               focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="Doe"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Work Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-indigo-400">
                Work Information
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Designation
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="designation"
                      className="w-full bg-crypto-dark border border-gray-800 rounded-xl py-2 pl-10 pr-4
                               focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="Senior Developer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      className="w-full bg-crypto-dark border border-gray-800 rounded-xl py-2 pl-10 pr-4
                               focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="john@abc.com"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-indigo-400">
                Payment Information
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Wallet Address
                  </label>
                  <div className="relative">
                    <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="walletAddress"
                      className="w-full bg-crypto-dark border border-gray-800 rounded-xl py-2 pl-10 pr-4
                               focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="0x..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Monthly Salary (Dollar)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      Ξ
                    </span>
                    <input
                      type="number"
                      step="0.000000000000001"
                      name="monthlySalary"
                      className="w-full bg-crypto-dark border border-gray-800 rounded-xl py-2 pl-10 pr-4
                               focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-indigo-400">
                Additional Information
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <PhoneCall className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="phoneNumber"
                      placeholder="+1234567890"
                      className="w-full bg-crypto-dark border border-gray-800 rounded-xl py-2 pl-10 pr-4
                               focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Employee Status
                  </label>
                  <div className="relative">
                    <select
                      name="status"
                      className="w-full bg-crypto-dark border border-gray-800 rounded-xl py-2 px-4
                                    focus:outline-none focus:border-indigo-500 transition-colors appearance-none"
                    >
                      <option value="">Select Status</option>
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="onLeave">On Leave</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-800">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 rounded-xl border border-gray-800 text-gray-400 hover:border-gray-600
                           hover:text-white transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 transition-colors text-white"
              >
                Add Employee
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
