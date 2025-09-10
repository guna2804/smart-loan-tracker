// Repayment Service for MoneyBoard API

import type { CreateRepaymentRequestDto, UpdateRepaymentRequestDto, Repayment, PagedRepaymentResponse, RepaymentSummary } from '../types/repayment';
import httpClient from './httpClient';
import { wrapServiceCall } from '../utils/errorUtils';
import { toastService } from '../utils/toastService';

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
    const result = await wrapServiceCall(
      () => httpClient.get(`${API_BASE}/${loanId}/Repayment`, { params }),
      { service: 'repaymentService', operation: 'getRepayments', params: { loanId, ...params } },
      true // Enable retry for fetching repayments
    );

    // Show success toast with API's message
    if (result.data.message) {
      toastService.success("Repayments Retrieved", result.data.message);
    }

    return result.data.data;
  },

  async getRepaymentSummary(
    loanId: string,
    role: 'lending' | 'borrowing' | 'all' = 'all'
  ): Promise<RepaymentSummary> {
    if (!loanId || loanId === 'undefined') {
      throw new Error('Invalid loanId provided');
    }
    const result = await wrapServiceCall(
      () => httpClient.get(`${API_BASE}/${loanId}/repayment/summary`, {
        params: { role }
      }),
      { service: 'repaymentService', operation: 'getRepaymentSummary', params: { loanId, role } },
      true // Enable retry for repayment summary
    );

    // Show success toast with API's message
    if (result.data.message) {
      toastService.success("Repayment Summary Retrieved", result.data.message);
    }

    return result.data.data;
  },

  async createRepayment(loanId: string, data: CreateRepaymentRequestDto): Promise<Repayment> {
    if (!loanId || loanId === 'undefined') {
      throw new Error('Invalid loanId provided');
    }
    const result = await wrapServiceCall(
      () => httpClient.post(`${API_BASE}/${loanId}/Repayment`, data),
      { service: 'repaymentService', operation: 'createRepayment', params: { loanId, ...data } }
    );

    // Show success toast with API's message
    if (result.data.message) {
      toastService.success("Repayment Created", result.data.message);
    }

    return result.data.data;
  },

  async updateRepayment(loanId: string, repaymentId: string, data: UpdateRepaymentRequestDto): Promise<Repayment> {
    const result = await wrapServiceCall(
      () => httpClient.put(`${API_BASE}/${loanId}/Repayment/${repaymentId}`, data),
      { service: 'repaymentService', operation: 'updateRepayment', params: { loanId, repaymentId, ...data } }
    );

    // Show success toast with API's message
    if (result.data.message) {
      toastService.success("Repayment Updated", result.data.message);
    }

    return result.data.data || result.data;
  },

  async deleteRepayment(loanId: string, repaymentId: string): Promise<void> {
    const result = await wrapServiceCall(
      () => httpClient.delete(`${API_BASE}/${loanId}/Repayment/${repaymentId}`),
      { service: 'repaymentService', operation: 'deleteRepayment', params: { loanId, repaymentId } }
    );

    // Show success toast with API's message
    if (result.data.message) {
      toastService.success("Repayment Deleted", result.data.message);
    }

    return result.data.data || result.data;
  },
};