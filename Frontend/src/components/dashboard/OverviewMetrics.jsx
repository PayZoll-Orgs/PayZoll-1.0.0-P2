import React, { useEffect, useState } from "react";
import { Users, DollarSign } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import axios from "axios";
import { backendDomain } from "../../constant/domain";

const colorPalette = [
  "#6366f1", "#8b5cf6", "#a855f7", "#d946ef", "#ec4899",
  "#f43f5e", "#f97316", "#fb923c", "#facc15", "#84cc16",
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-crypto-dark p-3 rounded-lg border border-gray-800">
        <p className="text-white font-semibold">{payload[0].name}</p>
        <p className="text-indigo-400">{`${payload[0].value} Employees`}</p>
      </div>
    );
  }
  return null;
};

export default function OverviewMetrics({ type }) {
  const [employees, setEmployees] = useState([]);
  const [totalSalary, setTotalSalary] = useState(0);
  const [departmentData, setDepartmentData] = useState([]);

  const getAllEmployees = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${backendDomain}/admin/get-all-empolyees`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(response);
    const employees = response.data.employee
    setEmployees(employees);

    const departmentMap = employees.reduce((acc, emp) => {
      const department = emp.designation || "Unknown"; // Use "Unknown" if designation is missing
      if (!acc[department]) {
        acc[department] = 0;
      }
      acc[department]++;
      return acc;
    }, {});

    // Convert the map to an array and assign colors
    const data = Object.entries(departmentMap).map(([name, value], index) => ({
      name,
      value,
      color: colorPalette[index % colorPalette.length], // Assign colors cyclically
    }));

    setDepartmentData(data);
  };

  const getTotalSalary = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${backendDomain}/admin/get-total-salary`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setTotalSalary(response.data.totalSalary);
  };

  useEffect(() => {
    getAllEmployees();
    getTotalSalary();
  }, []);

  if (type === "employees") {
    return (
      <div className="bg-crypto-card border border-gray-800 rounded-xl p-6 h-[420px] hover:border-indigo-500/50 transition-all hover:shadow-lg hover:shadow-indigo-500/10 group">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-gray-400 mb-2">Total Employees</h3>
            <div className="text-4xl font-bold group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-purple-400 group-hover:bg-clip-text group-hover:text-transparent transition-all">
              {employees.length}
            </div>
            <div className="text-green-400 text-sm mt-1">
              +12% from last month
            </div>
          </div>
          <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center transform transition-transform group-hover:scale-110">
            <Users className="w-8 h-8 text-white" />
          </div>
        </div>

        <div className="h-44 relative">
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
            </PieChart>
          </ResponsiveContainer>

          {/* Glowing effect behind the chart */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4 h-[80px] overflow-y-auto custom-scrollbar pr-2">
          {departmentData.map((dept, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-crypto-dark/50 transition-colors"
            >
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: dept.color }}
              />
              <span className="text-sm text-gray-400 truncate">
                {dept.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-crypto-card border border-gray-800 rounded-xl p-6 h-[420px] hover:border-indigo-500/50 transition-all hover:shadow-lg hover:shadow-indigo-500/10 group">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-gray-400 mb-2">Total Amount to be Paid</h3>
          <div className="text-4xl font-bold group-hover:bg-gradient-to-r group-hover:from-green-400 group-hover:to-emerald-400 group-hover:bg-clip-text group-hover:text-transparent transition-all">
            {totalSalary} Dollar
          </div>
          <div className="text-green-400 text-sm mt-1">
            75% already processed
          </div>
        </div>
        <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 flex items-center justify-center transform transition-transform group-hover:scale-110">
          <DollarSign className="w-8 h-8 text-white" />
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Amount Paid</span>
            <span className="text-green-400">$109,258</span>
          </div>
          <div className="h-3 bg-gray-800 rounded-full overflow-hidden group-hover:bg-gray-700/50 transition-colors">
            <div
              className="h-full w-[75%] bg-gradient-to-r from-green-600 to-emerald-600 rounded-full group-hover:from-green-500 group-hover:to-emerald-500 transition-colors"
              style={{
                animation: "progressAnimation 1.5s ease-out",
              }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Amount Pending</span>
            <span className="text-yellow-400">$36,420</span>
          </div>
          <div className="h-3 bg-gray-800 rounded-full overflow-hidden group-hover:bg-gray-700/50 transition-colors">
            <div
              className="h-full w-[25%] bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full group-hover:from-yellow-500 group-hover:to-orange-500 transition-colors"
              style={{
                animation: "progressAnimation 1.5s ease-out",
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-crypto-dark rounded-xl p-4 border border-gray-800 hover:border-indigo-500/30 transition-all hover:bg-crypto-dark/70 group-hover:shadow-lg group-hover:shadow-indigo-500/5">
            <div className="text-sm text-gray-400 mb-1">Next Payout</div>
            <div className="text-lg font-semibold">Jan 31, 2024</div>
          </div>
          <div className="bg-crypto-dark rounded-xl p-4 border border-gray-800 hover:border-indigo-500/30 transition-all hover:bg-crypto-dark/70 group-hover:shadow-lg group-hover:shadow-indigo-500/5">
            <div className="text-sm text-gray-400 mb-1">Processing Time</div>
            <div className="text-lg font-semibold">~2 hours</div>
          </div>
        </div>
      </div>
    </div>
  );
}
