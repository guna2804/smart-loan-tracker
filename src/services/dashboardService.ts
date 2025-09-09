// Dashboard Service for MoneyBoard API

import httpClient from './httpClient';

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
  status: string;
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
    const response = await httpClient.get(`${API_BASE}/summary`);
    return response.data;
  },

  async getRecentTransactions(params: { limit?: number; page?: number } = {}): Promise<PagedResponse<RecentTransaction>> {
    const response = await httpClient.get(`${API_BASE}/recent-transactions`, { params });
    return {
      data: response.data.transactions || [],
      totalCount: response.data.pagination?.total || 0,
      page: response.data.pagination?.page || 1,
      pageSize: response.data.pagination?.limit || 5,
      totalPages: Math.ceil((response.data.pagination?.total || 0) / (response.data.pagination?.limit || 5))
    };
  },

  async getUpcomingPayments(params: { limit?: number; page?: number } = {}): Promise<PagedResponse<UpcomingPayment>> {
    const response = await httpClient.get(`${API_BASE}/upcoming-payments`, { params });
    return {
      data: response.data.upcomingPayments || [],
      totalCount: response.data.pagination?.total || 0,
      page: response.data.pagination?.page || 1,
      pageSize: response.data.pagination?.limit || 5,
      totalPages: Math.ceil((response.data.pagination?.total || 0) / (response.data.pagination?.limit || 5))
    };
  },

  async getMonthlyRepayments(year?: number): Promise<MonthlyRepaymentData[]> {
    const response = await httpClient.get(`${API_BASE}/monthly-repayments`, {
      params: year ? { year } : {}
    });
    return response.data.monthlyRepayments || [];
  },

  async getLoanStatusDistribution(): Promise<LoanStatusDistribution[]> {
    const response = await httpClient.get(`${API_BASE}/loan-status-distribution`);
    const distribution = response.data.distribution || {};
    return [
      { status: 'Active', count: distribution.active || 0, percentage: 0 },
      { status: 'Closed', count: distribution.closed || 0, percentage: 0 },
      { status: 'Overdue', count: distribution.overdue || 0, percentage: 0 }
    ];
  },

  async getAlerts(): Promise<Alert[]> {
    const response = await httpClient.get(`${API_BASE}/alerts`);
    return response.data.alerts || [];
  },
};