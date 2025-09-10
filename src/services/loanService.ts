// Loan Service for MoneyBoard API

import type { OutstandingLoan } from '../types/loan';
import httpClient from './httpClient';
import { wrapServiceCall } from '../utils/errorUtils';
import { toastService } from '../utils/toastService';

const API_BASE = '/Loan';

export enum InterestType {
  Flat = 0,
  Compound = 1,
}



export enum RepaymentFrequencyType {
  Monthly = 0,
  Quarterly = 1,
  Yearly = 2,
  LumpSum = 3,
}

export enum CurrencyType {
  USD = 0,
  EUR = 1,
  INR = 2,
}

export interface CreateLoanDto {
  counterpartyName?: string;
  role?: string;
  principal: number;
  interestRate: number;
  interestType: InterestType;
  startDate: string;
  endDate?: string;
  repaymentFrequency: RepaymentFrequencyType;
  allowOverpayment: boolean;
  currency: CurrencyType;
  notes?: string;
}

export interface PagedLoanResponse {
  loans: Loan[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface Loan {
  id: string;
  userId: string;
  counterpartyName: string;
  role: string;
  principal: number;
  interestRate: number;
  interestType: InterestType;
  startDate: string;
  endDate?: string;
  repaymentFrequency: RepaymentFrequencyType;
  allowOverpayment: boolean;
  currency: CurrencyType;
  status: number;
  totalAmount: number;
  notes?: string;
  hasRepaymentStarted: boolean;
}

export const loanService = {
  async getLoans(
    params: {
      role?: string;
      status?: string;
      page?: number;
      pageSize?: number;
    } = {}
  ) {
    const result = await wrapServiceCall(
      () => httpClient.get(API_BASE, { params }),
      { service: 'loanService', operation: 'getLoans', params },
      true // Enable retry for fetching loans
    );

    // Show success toast with API's message
    if (result.data.message) {
      toastService.success("Loans Retrieved", result.data.message);
    }

    return result.data.data;
  },

  async getLoan(loanId: string) {
    const result = await wrapServiceCall(
      () => httpClient.get(`${API_BASE}/${loanId}`),
      { service: 'loanService', operation: 'getLoan', params: { loanId } },
      true // Enable retry for fetching single loan
    );

    // Show success toast with API's message
    if (result.data.message) {
      toastService.success("Loan Retrieved", result.data.message);
    }

    return result.data.data;
  },

  async createLoan(data: CreateLoanDto) {
    const result = await wrapServiceCall(
      () => httpClient.post(API_BASE, data),
      { service: 'loanService', operation: 'createLoan', params: data }
    );

    // Show success toast with API's message
    if (result.data.message) {
      toastService.success("Loan Created", result.data.message);
    }

    return result.data.data;
  },

  async updateLoan(loanId: string, data: CreateLoanDto) {
    const result = await wrapServiceCall(
      () => httpClient.put(`${API_BASE}/${loanId}`, data),
      { service: 'loanService', operation: 'updateLoan', params: { loanId, ...data } }
    );

    // Show success toast with API's message
    if (result.data.message) {
      toastService.success("Loan Updated", result.data.message);
    }

    return result.data.data;
  },

  async deleteLoan(loanId: string) {
    const result = await wrapServiceCall(
      () => httpClient.delete(`${API_BASE}/${loanId}`),
      { service: 'loanService', operation: 'deleteLoan', params: { loanId } }
    );

    // Show success toast with API's message
    if (result.data.message) {
      toastService.success("Loan Deleted", result.data.message);
    }

    return result.data.data || result.data;
  },

  async amendLoan(loanId: string, data: CreateLoanDto) {
    const result = await wrapServiceCall(
      () => httpClient.post(`${API_BASE}/${loanId}/amend`, data),
      { service: 'loanService', operation: 'amendLoan', params: { loanId, ...data } }
    );

    // Show success toast with API's message
    if (result.data.message) {
      toastService.success("Loan Amended", result.data.message);
    }

    return result.data.data || result.data;
  },

  async getOutstandingLoans(
    params: {
      page?: number;
      pageSize?: number;
    } = {}
  ): Promise<{ loans: OutstandingLoan[]; totalCount: number; page: number; pageSize: number; totalPages: number }> {
    const result = await wrapServiceCall(
      () => httpClient.get(`${API_BASE}/with-outstanding`, { params }),
      { service: 'loanService', operation: 'getOutstandingLoans', params },
      true // Enable retry for outstanding loans
    );

    // Show success toast with API's message
    if (result.data.message) {
      toastService.success("Outstanding Loans Retrieved", result.data.message);
    }

    return result.data.data || result.data;
  },
};
