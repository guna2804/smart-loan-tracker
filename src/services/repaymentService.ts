// Repayment Service for MoneyBoard API

import type { CreateRepaymentRequestDto, UpdateRepaymentRequestDto, Repayment, PagedRepaymentResponse, RepaymentSummary } from '../types/repayment';
import httpClient from './httpClient';

const API_BASE = '/loans';

export const repaymentService = {
  async getRepayments(
    loanId: string,
    params: {
      page?: number;
      pageSize?: number;
      sortBy?: string;
      filter?: string;
    } = {}
  ): Promise<PagedRepaymentResponse> {
    if (!loanId || loanId === 'undefined') {
      throw new Error('Invalid loanId provided');
    }
    const response = await httpClient.get(`${API_BASE}/${loanId}/Repayment`, { params });
    return response.data;
  },

  async getRepaymentSummary(
    loanId: string,
    role: 'lending' | 'borrowing' | 'all' = 'all'
  ): Promise<RepaymentSummary> {
    if (!loanId || loanId === 'undefined') {
      throw new Error('Invalid loanId provided');
    }
    const response = await httpClient.get(`${API_BASE}/${loanId}/repayment/summary`, {
      params: { role }
    });
    return response.data;
  },

  async createRepayment(loanId: string, data: CreateRepaymentRequestDto): Promise<Repayment> {
    if (!loanId || loanId === 'undefined') {
      throw new Error('Invalid loanId provided');
    }
    try {
      const response = await httpClient.post(`${API_BASE}/${loanId}/Repayment`, data);
      return response.data;
    } catch (error) {
      // Re-throw with better error handling
      const axiosError = error as { response?: { data?: { message?: string }; statusText?: string }; message?: string };
      const errorMessage = axiosError.response?.data?.message || axiosError.message || "Failed to create repayment";
      const customError = new Error(errorMessage);
      (customError as { response?: unknown }).response = axiosError.response;
      throw customError;
    }
  },

  async updateRepayment(loanId: string, repaymentId: string, data: UpdateRepaymentRequestDto): Promise<Repayment> {
    const response = await httpClient.put(`${API_BASE}/${loanId}/Repayment/${repaymentId}`, data);
    return response.data;
  },

  async deleteRepayment(loanId: string, repaymentId: string): Promise<void> {
    await httpClient.delete(`${API_BASE}/${loanId}/Repayment/${repaymentId}`);
  },
};