import { RepaymentStatus } from '../types/repayment';

// Dashboard Service for MoneyBoard API

import httpClient from './httpClient';
import { wrapServiceCall } from '../utils/errorUtils';
import { toastService } from '../utils/toastService';

const API_BASE = '/dashboard';

// Types for dashboard data
export interface DashboardSummary {
  totalLent: number;
  lentChangePercent: number;
  totalBorrowed: number;
  borrowedChangePercent: number;
  interestEarned: number;
  interestChangePercent: number;
}

export interface RecentTransaction {
  id: string;
  name: string;
  dueDate: string;
  amount: number;
  status: RepaymentStatus;
  direction: 'in' | 'out';
}

export interface UpcomingPayment {
  id: string;
  name: string;
  dueDate: string;
  amount: number;
  direction: 'in' | 'out';
}

export interface MonthlyRepaymentData {
  month: string;
  amount: number;
  year: number;
}

export interface LoanStatusDistribution {
  status: string;
  count: number;
  percentage: number;
}

export interface Alert {
  id: string;
  type: 'overdue' | 'due_soon' | 'payment_reminder';
  message: string;
  loanId?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

export interface PagedResponse<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const dashboardService = {
  async getSummary(): Promise<DashboardSummary> {
    const result = await wrapServiceCall(
      () => httpClient.get(`${API_BASE}/summary`),
      { service: 'dashboardService', operation: 'getSummary' },
      true // Enable retry for summary data
    );

    // Show success toast with API's message
    if (result.data.message) {
      toastService.success("Dashboard Summary Retrieved", result.data.message);
    }

    return result.data.data;
  },

  async getRecentTransactions(params: { limit?: number; page?: number } = {}): Promise<PagedResponse<RecentTransaction>> {
    const result = await wrapServiceCall(
      () => httpClient.get(`${API_BASE}/recent-transactions`, { params }),
      { service: 'dashboardService', operation: 'getRecentTransactions', params }
    );

    const apiData = result.data.data;

    const normalizeStatus = (status: string): RepaymentStatus => {
      const lower = status.toLowerCase();
      if (lower === 'early') return RepaymentStatus.Early;
      if (lower === 'ontime') return RepaymentStatus.OnTime;
      if (lower === 'late') return RepaymentStatus.Late;
      return RepaymentStatus.Late; // default to Late for unknown
    };

    const normalizedTransactions = (apiData.transactions || []).map(t => ({
      ...t,
      status: normalizeStatus(t.status)
    }));

    const data = {
      data: normalizedTransactions,
      totalCount: apiData.pagination?.total || 0,
      page: apiData.pagination?.page || 1,
      pageSize: apiData.pagination?.limit || 5,
      totalPages: Math.ceil((apiData.pagination?.total || 0) / (apiData.pagination?.limit || 5))
    };

    // Show success toast with API's message
    if (result.data.message) {
      toastService.success("Recent Transactions Retrieved", result.data.message);
    }

    return data;
  },

  async getUpcomingPayments(params: { limit?: number; page?: number } = {}): Promise<PagedResponse<UpcomingPayment>> {
    const result = await wrapServiceCall(
      () => httpClient.get(`${API_BASE}/upcoming-payments`, { params }),
      { service: 'dashboardService', operation: 'getUpcomingPayments', params }
    );

    const apiData = result.data.data;
    const data = {
      data: apiData.upcomingPayments || [],
      totalCount: apiData.pagination?.total || 0,
      page: apiData.pagination?.page || 1,
      pageSize: apiData.pagination?.limit || 5,
      totalPages: Math.ceil((apiData.pagination?.total || 0) / (apiData.pagination?.limit || 5))
    };

    // Show success toast with API's message
    if (result.data.message) {
      toastService.success("Upcoming Payments Retrieved", result.data.message);
    }

    return data;
  },

  async getMonthlyRepayments(year?: number): Promise<MonthlyRepaymentData[]> {
    const result = await wrapServiceCall(
      () => httpClient.get(`${API_BASE}/monthly-repayments`, {
        params: year ? { year } : {}
      }),
      { service: 'dashboardService', operation: 'getMonthlyRepayments', params: { year } }
    );

    // Show success toast with API's message
    if (result.data.message) {
      toastService.success("Monthly Repayments Retrieved", result.data.message);
    }

    const apiData = result.data.data;
    return apiData.monthlyRepayments || [];
  },

  async getLoanStatusDistribution(): Promise<LoanStatusDistribution[]> {
    const result = await wrapServiceCall(
      () => httpClient.get(`${API_BASE}/loan-status-distribution`),
      { service: 'dashboardService', operation: 'getLoanStatusDistribution' },
      true // Enable retry for status distribution
    );

    const apiData = result.data.data;
    const distribution = apiData.distribution || {};
    const data = [
      { status: 'Active', count: distribution.active || 0, percentage: 0 },
      { status: 'Closed', count: distribution.closed || 0, percentage: 0 },
      { status: 'Overdue', count: distribution.overdue || 0, percentage: 0 }
    ];

    // Show success toast with API's message
    if (result.data.message) {
      toastService.success("Loan Status Distribution Retrieved", result.data.message);
    }

    return data;
  },

  async getAlerts(): Promise<Alert[]> {
    const result = await wrapServiceCall(
      () => httpClient.get(`${API_BASE}/alerts`),
      { service: 'dashboardService', operation: 'getAlerts' },
      true // Enable retry for alerts
    );

    // Show success toast with API's message
    if (result.data.message) {
      toastService.success("Alerts Retrieved", result.data.message);
    }

    const apiData = result.data.data;
    return apiData.alerts || [];
  },
};