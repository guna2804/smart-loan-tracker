// Repayment Service for MoneyBoard API

import type { CreateRepaymentRequestDto, UpdateRepaymentRequestDto, Repayment, PagedRepaymentResponse } from '../types/repayment';

const API_BASE = "http://localhost:5172/api/loans";

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
    const url = new URL(`${API_BASE}/${loanId}/Repayment`, window.location.origin);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) url.searchParams.append(key, String(value));
    });
    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    const res = await fetch(url.toString(), {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) throw new Error("Failed to fetch repayments");
    return await res.json();
  },

  async createRepayment(loanId: string, data: CreateRepaymentRequestDto): Promise<Repayment> {
    if (!loanId || loanId === 'undefined') {
      throw new Error('Invalid loanId provided');
    }
    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    const res = await fetch(`${API_BASE}/${loanId}/Repayment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create repayment");
    return await res.json();
  },

  async updateRepayment(loanId: string, repaymentId: string, data: UpdateRepaymentRequestDto): Promise<Repayment> {
    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    const res = await fetch(`${API_BASE}/${loanId}/Repayment/${repaymentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update repayment");
    return await res.json();
  },

  async deleteRepayment(loanId: string, repaymentId: string): Promise<void> {
    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    const res = await fetch(`${API_BASE}/${loanId}/Repayment/${repaymentId}`, {
      method: "DELETE",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) throw new Error("Failed to delete repayment");
  },
};