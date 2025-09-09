// Loan Service for MoneyBoard API

import type { OutstandingLoan } from '../types/loan';
import httpClient from './httpClient';

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
    const response = await httpClient.get(API_BASE, { params });
    return response.data;
  },

  async getLoan(loanId: string) {
    const response = await httpClient.get(`${API_BASE}/${loanId}`);
    return response.data;
  },

  async createLoan(data: CreateLoanDto) {
    const response = await httpClient.post(API_BASE, data);
    return response.data;
  },

  async updateLoan(loanId: string, data: CreateLoanDto) {
    const response = await httpClient.put(`${API_BASE}/${loanId}`, data);
    return response.data;
  },

  async deleteLoan(loanId: string) {
    const response = await httpClient.delete(`${API_BASE}/${loanId}`);
    return response.data;
  },

  async amendLoan(loanId: string, data: CreateLoanDto) {
    const response = await httpClient.post(`${API_BASE}/${loanId}/amend`, data);
    return response.data;
  },

  async getOutstandingLoans(
    params: {
      page?: number;
      pageSize?: number;
    } = {}
  ): Promise<{ loans: OutstandingLoan[]; totalCount: number; page: number; pageSize: number; totalPages: number }> {
    const response = await httpClient.get(`${API_BASE}/with-outstanding`, { params });
    return response.data;
  },
};
