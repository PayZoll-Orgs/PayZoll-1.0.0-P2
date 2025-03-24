import React from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { TrendingUp, PieChart as PieChartIcon, BarChart2 } from 'lucide-react';

const monthlyData = [
  { month: 'Jan', amount: 125000 },
  { month: 'Feb', amount: 132000 },
  { month: 'Mar', amount: 130000 },
  { month: 'Apr', amount: 135000 },
  { month: 'May', amount: 142000 },
  { month: 'Jun', amount: 145678 }
];

const departmentData = [
  { name: 'Engineering', value: 65000, color: '#6366f1' },
  { name: 'Marketing', value: 35000, color: '#8b5cf6' },
  { name: 'Sales', value: 28000, color: '#a855f7' },
  { name: 'HR', value: 12000, color: '#d946ef' },
  { name: 'Finance', value: 15000, color: '#ec4899' }
];

const paymentMethodData = [
  { method: 'Dollar', amount: 85000 },
  { method: 'USDT', amount: 45000 },
  { method: 'USDC', amount: 25000 }
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-crypto-dark p-3 rounded-lg border border-gray-800">
        <p className="text-white font-semibold">{label}</p>
        <p className="text-indigo-400">${payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

export default function PayrollAnalytics() {
  return (
    <div className="bg-crypto-card border border-gray-800 rounded-xl p-6 hover:border-indigo-500/50 transition-all">
      <h2 className="text-xl font-bold mb-6">Payroll Analytics</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-crypto-dark rounded-xl p-4 border border-gray-800"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 
                          flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">Monthly Trend</h3>
              <p className="text-sm text-gray-400">Last 6 months</p>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis 
                  stroke="#9ca3af"
                  tickFormatter={(value) => `$${(value / 1000)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Department Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-crypto-dark rounded-xl p-4 border border-gray-800"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 
                          flex items-center justify-center">
              <PieChartIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">Department Split</h3>
              <p className="text-sm text-gray-400">Current month</p>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  layout="vertical" 
                  align="right"
                  verticalAlign="middle"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Payment Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-crypto-dark rounded-xl p-4 border border-gray-800"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 
                          flex items-center justify-center">
              <BarChart2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">Payment Methods</h3>
              <p className="text-sm text-gray-400">By currency</p>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={paymentMethodData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="method" stroke="#9ca3af" />
                <YAxis 
                  stroke="#9ca3af"
                  tickFormatter={(value) => `$${(value / 1000)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="amount" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}