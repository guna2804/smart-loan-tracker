import { useState, useCallback } from 'react';
import { dashboardService } from '../services/dashboardService';
import { useGlobalLoader } from '../contexts/GlobalLoaderContext';
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
  const { showLoader, hideLoader } = useGlobalLoader();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<RecentTransaction[]>([]);
  const [upcomingPayments, setUpcomingPayments] = useState<UpcomingPayment[]>([]);
  const [monthlyRepayments, setMonthlyRepayments] = useState<MonthlyRepaymentData[]>([]);
  const [loanStatusDistribution, setLoanStatusDistribution] = useState<LoanStatusDistribution[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchSummary = useCallback(async () => {
    showLoader('Loading dashboard summary...');
    setError(null);
    try {
      const data = await dashboardService.getSummary();
      setSummary(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch dashboard summary';
      setError(errorMessage);
    } finally {
      hideLoader();
    }
  }, [showLoader, hideLoader]);

  const fetchRecentTransactions = useCallback(async (params: { limit?: number; page?: number } = {}) => {
    showLoader('Loading recent transactions...');
    setError(null);
    try {
      const response: PagedResponse<RecentTransaction> = await dashboardService.getRecentTransactions(params);
      setRecentTransactions(response.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch recent transactions';
      setError(errorMessage);
    } finally {
      hideLoader();
    }
  }, [showLoader, hideLoader]);

  const fetchUpcomingPayments = useCallback(async (params: { limit?: number; page?: number } = {}) => {
    showLoader('Loading upcoming payments...');
    setError(null);
    try {
      const response: PagedResponse<UpcomingPayment> = await dashboardService.getUpcomingPayments(params);
      setUpcomingPayments(response.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch upcoming payments';
      setError(errorMessage);
    } finally {
      hideLoader();
    }
  }, [showLoader, hideLoader]);

  const fetchMonthlyRepayments = useCallback(async (year?: number) => {
    showLoader('Loading monthly repayments...');
    setError(null);
    try {
      const data = await dashboardService.getMonthlyRepayments(year);
      setMonthlyRepayments(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch monthly repayments';
      setError(errorMessage);
    } finally {
      hideLoader();
    }
  }, [showLoader, hideLoader]);

  const fetchLoanStatusDistribution = useCallback(async () => {
    showLoader('Loading loan status distribution...');
    setError(null);
    try {
      const data = await dashboardService.getLoanStatusDistribution();
      setLoanStatusDistribution(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch loan status distribution';
      setError(errorMessage);
    } finally {
      hideLoader();
    }
  }, [showLoader, hideLoader]);

  const fetchAlerts = useCallback(async () => {
    showLoader('Loading alerts...');
    setError(null);
    try {
      const data = await dashboardService.getAlerts();
      setAlerts(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch alerts';
      setError(errorMessage);
    } finally {
      hideLoader();
    }
  }, [showLoader, hideLoader]);

  return {
    summary,
    recentTransactions,
    upcomingPayments,
    monthlyRepayments,
    loanStatusDistribution,
    alerts,
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