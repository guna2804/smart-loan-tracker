import { useEffect } from "react";
import { useDashboard } from "../hooks/useDashboard";
import { Alert, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import {
  DashboardHeader,
  StatsCards,
  RecentTransactions,
  UpcomingPayments,
  ChartsSection,
  AlertsSection
} from "./dashboard/index";

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


  // Calculate stats from summary
  const stats = summary ? {
    totalLent: summary.totalLent || 0,
    totalBorrowed: summary.totalBorrowed || 0,
    interestEarned: summary.interestEarned || 0,
    lentChangePercent: summary.lentChangePercent || 0,
    borrowedChangePercent: summary.borrowedChangePercent || 0,
    interestChangePercent: summary.interestChangePercent || 0,
    overduePayments: alerts && Array.isArray(alerts) ? alerts.filter(alert => alert.type === 'overdue').length : 0,
  } : {
    totalLent: 0,
    totalBorrowed: 0,
    interestEarned: 0,
    lentChangePercent: 0,
    borrowedChangePercent: 0,
    interestChangePercent: 0,
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
      <DashboardHeader />

      <StatsCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentTransactions transactions={recentTransactions} />
        <UpcomingPayments payments={upcomingPayments} />
      </div>

      <ChartsSection
        monthlyRepayments={monthlyRepayments}
        loanStatusDistribution={loanStatusDistribution}
      />

      <AlertsSection alerts={alerts} />
    </div>
  );
};

export default Dashboard;
