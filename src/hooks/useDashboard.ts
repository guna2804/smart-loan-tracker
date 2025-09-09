import { useState, useCallback } from 'react';
import { dashboardService } from '../services/dashboardService';
import type {
  DashboardSummary,
  RecentTransaction,
  UpcomingPayment,
  MonthlyRepaymentData,
  LoanStatusDistribution,
  Alert,
  PagedResponse
} from '../services/dashboardService';

interface UseDashboardReturn {
  summary: DashboardSummary | null;
  recentTransactions: RecentTransaction[];
  upcomingPayments: UpcomingPayment[];
  monthlyRepayments: MonthlyRepaymentData[];
  loanStatusDistribution: LoanStatusDistribution[];
  alerts: Alert[];
  loading: boolean;
  error: string | null;
  fetchSummary: () => Promise<void>;
  fetchRecentTransactions: (params?: { limit?: number; page?: number }) => Promise<void>;
  fetchUpcomingPayments: (params?: { limit?: number; page?: number }) => Promise<void>;
  fetchMonthlyRepayments: (year?: number) => Promise<void>;
  fetchLoanStatusDistribution: () => Promise<void>;
  fetchAlerts: () => Promise<void>;
  clearError: () => void;
}

export const useDashboard = (): UseDashboardReturn => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<RecentTransaction[]>([]);
  const [upcomingPayments, setUpcomingPayments] = useState<UpcomingPayment[]>([]);
  const [monthlyRepayments, setMonthlyRepayments] = useState<MonthlyRepaymentData[]>([]);
  const [loanStatusDistribution, setLoanStatusDistribution] = useState<LoanStatusDistribution[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dashboardService.getSummary();
      setSummary(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch dashboard summary';
      setError(errorMessage);
      console.error('Error fetching dashboard summary:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRecentTransactions = useCallback(async (params: { limit?: number; page?: number } = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response: PagedResponse<RecentTransaction> = await dashboardService.getRecentTransactions(params);
      setRecentTransactions(response.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch recent transactions';
      setError(errorMessage);
      console.error('Error fetching recent transactions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUpcomingPayments = useCallback(async (params: { limit?: number; page?: number } = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response: PagedResponse<UpcomingPayment> = await dashboardService.getUpcomingPayments(params);
      setUpcomingPayments(response.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch upcoming payments';
      setError(errorMessage);
      console.error('Error fetching upcoming payments:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMonthlyRepayments = useCallback(async (year?: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await dashboardService.getMonthlyRepayments(year);
      setMonthlyRepayments(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch monthly repayments';
      setError(errorMessage);
      console.error('Error fetching monthly repayments:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLoanStatusDistribution = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dashboardService.getLoanStatusDistribution();
      setLoanStatusDistribution(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch loan status distribution';
      setError(errorMessage);
      console.error('Error fetching loan status distribution:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dashboardService.getAlerts();
      setAlerts(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch alerts';
      setError(errorMessage);
      console.error('Error fetching alerts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
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
  };
};