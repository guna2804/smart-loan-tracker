import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { Loader2 } from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
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
import { useDashboard } from "../hooks/useDashboard";

const Dashboard = () => {
  const {
    summary,
    recentTransactions,
    upcomingPayments,
    monthlyRepayments,
    loanStatusDistribution,
    alerts,
    loading,
    error,
    fetchSummary,
    fetchRecentTransactions,
    fetchUpcomingPayments,
    fetchMonthlyRepayments,
    fetchLoanStatusDistribution,
    fetchAlerts,
    clearError,
  } = useDashboard();

  useEffect(() => {
    // Fetch all dashboard data on component mount
    fetchSummary();
    fetchRecentTransactions({ limit: 5 });
    fetchUpcomingPayments({ limit: 5 });
    fetchMonthlyRepayments(new Date().getFullYear()); // Pass current year
    fetchLoanStatusDistribution();
    fetchAlerts();
  }, [
    fetchSummary,
    fetchRecentTransactions,
    fetchUpcomingPayments,
    fetchMonthlyRepayments,
    fetchLoanStatusDistribution,
    fetchAlerts,
  ]);

  // Transform data for charts with null checks
  const monthlyRepaymentsData = monthlyRepayments && Array.isArray(monthlyRepayments)
    ? monthlyRepayments.map(item => ({
        month: item.month,
        repayments: item.amount,
      }))
    : [];

  const loanStatusData = loanStatusDistribution && Array.isArray(loanStatusDistribution)
    ? loanStatusDistribution.map(item => ({
        name: item.status,
        value: item.count,
        color: item.status === 'Active' ? '#10b981' : item.status === 'Closed' ? '#6366f1' : '#ef4444',
      }))
    : [];

  // Calculate stats from summary
  const stats = summary ? {
    totalLent: summary.totalLent || 0,
    totalBorrowed: summary.totalBorrowed || 0,
    interestEarned: summary.interestEarned || 0,
    activeLenders: 0,
    activeBorrowers: 0,
    overduePayments: alerts && Array.isArray(alerts) ? alerts.filter(alert => alert.type === 'overdue').length : 0,
  } : {
    totalLent: 0,
    totalBorrowed: 0,
    interestEarned: 0,
    activeLenders: 0,
    activeBorrowers: 0,
    overduePayments: 0,
  };
  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertDescription>
            {error}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                clearError();
                fetchSummary();
              }}
              className="ml-2"
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

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
              ₹{stats.totalLent.toLocaleString()}
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
              ₹{stats.totalBorrowed.toLocaleString()}
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
              ₹{stats.interestEarned.toLocaleString()}
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
            {recentTransactions && Array.isArray(recentTransactions) && recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.direction === "in"
                        ? "bg-green-100 text-green-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {transaction.direction === "in" ? (
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
                    ₹{(transaction.amount || 0).toLocaleString()}
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
            {upcomingPayments && Array.isArray(upcomingPayments) && upcomingPayments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      payment.direction === "in"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {payment.direction === "in" ? "+" : "-"}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{payment.name}</p>
                    <p className="text-sm text-gray-500">{payment.dueDate}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-semibold ${
                      payment.direction === "in"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {payment.direction === "in" ? "+" : "-"}₹
                    {(payment.amount || 0).toLocaleString()}
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
                    {loanStatusData.map((entry) => (
                      <Cell key={`cell-${entry.name}`} fill={entry.color} />
                    ))}
                  </Pie>
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
