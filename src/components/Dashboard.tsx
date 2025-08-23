import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  AlertTriangle,
  Plus,
  IndianRupee,
} from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  // Mock data - replace with real data from your backend
  const stats = {
    totalLent: 15000,
    totalBorrowed: 8500,
    interestEarned: 1200,
    activeLenders: 5,
    activeBorrowers: 3,
    overduePayments: 2,
  };

  const recentTransactions = [
    {
      id: 1,
      name: "John Doe",
      type: "lending",
      amount: 5000,
      dueDate: "2025-08-15",
      status: "active",
    },
    {
      id: 2,
      name: "Jane Smith",
      type: "borrowing",
      amount: 2500,
      dueDate: "2025-08-10",
      status: "overdue",
    },
    {
      id: 3,
      name: "Mike Johnson",
      type: "lending",
      amount: 3000,
      dueDate: "2025-08-20",
      status: "active",
    },
  ];

  const upcomingPayments = [
    {
      id: 1,
      name: "Sarah Wilson",
      amount: 1200,
      dueDate: "2025-08-05",
      type: "receive",
    },
    {
      id: 2,
      name: "Bank Loan",
      amount: 850,
      dueDate: "2025-08-07",
      type: "pay",
    },
  ];

  // Chart data (mock)
  // Chart data (mock)
  const monthlyRepaymentsData = [
    { month: "Jan", repayments: 1200 },
    { month: "Feb", repayments: 1500 },
    { month: "Mar", repayments: 1100 },
    { month: "Apr", repayments: 1800 },
    { month: "May", repayments: 1700 },
    { month: "Jun", repayments: 1600 },
    { month: "Jul", repayments: 2000 },
    { month: "Aug", repayments: 1900 },
  ];

  const loanStatusData = [
    { name: "Active", value: 8, color: "#10b981" },
    { name: "Closed", value: 4, color: "#6366f1" },
    { name: "Overdue", value: 2, color: "#ef4444" },
  ];
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
          <p className="text-gray-600 mt-1">Here's your financial overview</p>
        </div>

        <Link to="/loans">
          <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
            <Plus className="w-4 h-4 mr-2" />
            Add New Loan
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">
              Total Lent
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              ${stats.totalLent.toLocaleString()}
            </div>
            <p className="text-xs text-green-600 mt-1">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">
              Total Borrowed
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">
              ${stats.totalBorrowed.toLocaleString()}
            </div>
            <p className="text-xs text-blue-600 mt-1">-5% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">
              Interest Earned
            </CardTitle>
            <IndianRupee className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              ${stats.interestEarned.toLocaleString()}
            </div>
            <p className="text-xs text-purple-600 mt-1">+8% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2 text-gray-600" />
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === "lending"
                        ? "bg-green-100 text-green-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {transaction.type === "lending" ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {transaction.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Due: {transaction.dueDate}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    ${transaction.amount.toLocaleString()}
                  </p>
                  <Badge
                    variant={
                      transaction.status === "overdue"
                        ? "destructive"
                        : "default"
                    }
                  >
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Payments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-gray-600" />
              Upcoming Payments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingPayments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      payment.type === "receive"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {payment.type === "receive" ? "+" : "-"}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{payment.name}</p>
                    <p className="text-sm text-gray-500">{payment.dueDate}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-semibold ${
                      payment.type === "receive"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {payment.type === "receive" ? "+" : "-"}$
                    {payment.amount.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              Monthly Repayments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Bar Chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyRepaymentsData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="repayments" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              Loan Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Donut Chart */}
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={loanStatusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    {loanStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend verticalAlign="bottom" height={36} />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alert for Overdue Payments */}
      {stats.overduePayments > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <div>
                <h3 className="font-semibold text-red-900">
                  Attention Required
                </h3>
                <p className="text-red-700">
                  You have {stats.overduePayments} overdue payment
                  {stats.overduePayments > 1 ? "s" : ""}.
                  <Link
                    to="/repayments"
                    className="underline ml-1 hover:text-red-900"
                  >
                    Review now
                  </Link>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
