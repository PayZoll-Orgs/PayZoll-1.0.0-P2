import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  MoreVertical,
  Edit2,
  Trash2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Filter,
  Download,
} from "lucide-react";
import { testNetwork } from "../../constant/network";
import axios from "axios";
import { backendDomain } from "../../constant/domain";

// const employees = [
//   {
//     id: 1,
//     name: 'John Doe',
//     employeeId: 'EMP001',
//     department: 'Engineering',
//     designation: 'Senior Developer',
//     salary: '5.5 Dollar',
//     walletAddress: '0x1234...5678',
//     status: 'Active'
//   },
//   {
//     id: 2,
//     name: 'Jane Smith',
//     employeeId: 'EMP002',
//     department: 'Marketing',
//     designation: 'Marketing Manager',
//     salary: '4.8 Dollar',
//     walletAddress: '0x8765...4321',
//     status: 'Active'
//   },
//   {
//     id: 3,
//     name: 'Mike Johnson',
//     employeeId: 'EMP003',
//     department: 'Sales',
//     designation: 'Sales Director',
//     salary: '6.2 Dollar',
//     walletAddress: '0x9876...5432',
//     status: 'Active'
//   }
// ];

export default function EmployeeTable({
  filterDepartment,
  filterStatus,
  searchQuery,
  employees,
  deleteEmployeeById,
}) {
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [showFilters, setShowFilters] = useState(false);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-crypto-card border border-gray-800 rounded-xl overflow-hidden hover:border-indigo-500/50 transition-all"
    >
      {/* Header Actions */}
      <div className="p-4 border-b border-gray-800 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-crypto-dark rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>

          <select className="bg-crypto-dark border border-gray-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-500">
            <option value="10">10 per page</option>
            <option value="25">25 per page</option>
            <option value="50">50 per page</option>
          </select>
        </div>

        <button className="flex items-center space-x-2 px-4 py-2 bg-crypto-dark rounded-lg text-gray-400 hover:text-white transition-colors">
          <Download className="w-4 h-4" />
          <span>Export</span>
        </button>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="p-4 border-b border-gray-800 bg-crypto-dark/50"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select className="bg-crypto-dark border border-gray-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-500">
              <option value="all">All Departments</option>
              <option value="engineering">Engineering</option>
              <option value="marketing">Marketing</option>
              <option value="sales">Sales</option>
            </select>

            <select className="bg-crypto-dark border border-gray-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-500">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="onLeave">On Leave</option>
            </select>

            <div className="flex items-center space-x-4">
              <input
                type="number"
                placeholder="Min Dollar"
                className="w-full bg-crypto-dark border border-gray-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-500"
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Max Dollar"
                className="w-full bg-crypto-dark border border-gray-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-crypto-dark/90 backdrop-blur-sm">
            <tr>
              {[
                { field: "name", label: "Employee Name" },
                { field: "employeeId", label: "Employee ID" },
                { field: "dateOfJoining", label: "Date Of Joining" },
                { field: "designation", label: "Designation" },
                { field: "salary", label: "Salary (Dollar)" },
                { field: "walletAddress", label: "Wallet Address" },
                { field: "status", label: "Status" },
                { field: "actions", label: "Actions" },
              ].map(({ field, label }) => (
                <th
                  key={field}
                  className="px-6 py-4 text-left text-sm font-medium text-gray-400"
                  onClick={() => field !== "actions" && handleSort(field)}
                >
                  <div className="flex items-center space-x-2 cursor-pointer">
                    <span>{label}</span>
                    <SortIcon field={field} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {employees.map((employee) => (
              <tr
                key={employee._id}
                className="hover:bg-crypto-dark/30 transition-colors group"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center">
                      {employee.name.charAt(0)}
                    </div>
                    <a
                      href="#"
                      className="text-white hover:text-indigo-400 transition-colors"
                    >
                      {employee.name}
                    </a>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                  {employee._id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                  {employee.dateOfJoining}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                  {employee.designation}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                  {employee.salary.$numberDecimal} Dollar
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400">{employee.accountId}</span>
                    <a
                      href={`${testNetwork}/${employee.accountId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-4 h-4 text-indigo-400 cursor-pointer" />
                    </a>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 rounded-full text-sm bg-green-400/10 text-green-400`}
                  >
                    {"Active"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-gray-400 hover:text-white transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      className="text-gray-400 hover:text-red-400 transition-colors"
                      onClick={() => deleteEmployeeById(employee._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-gray-800 bg-crypto-dark/90 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">
            Showing {employees.length} employees
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">
              Previous
            </button>
            <button className="px-4 py-2 text-sm bg-indigo-500 text-white rounded-lg">
              1
            </button>
            <button className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">
              2
            </button>
            <button className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">
              3
            </button>
            <button className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
