// Loan Service for MoneyBoard API

const API_BASE = "http://localhost:5172/api/Loan";

export enum InterestType {
  Flat = 0,
  Compound = 1,
}

export enum CompoundingFrequencyType {
  None = 0,
  Monthly = 1,
  Quarterly = 2,
  Yearly = 3,
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
  compoundingFrequency: CompoundingFrequencyType;
  startDate: string;
  endDate?: string;
  repaymentFrequency: RepaymentFrequencyType;
  allowOverpayment: boolean;
  currency: CurrencyType;
  notes?: string;
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
    const url = new URL(API_BASE, window.location.origin);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) url.searchParams.append(key, String(value));
    });
    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    const res = await fetch(url.toString(), {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) throw new Error("Failed to fetch loans");
    return await res.json();
  },

  async getLoan(loanId: string) {
    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    const res = await fetch(`${API_BASE}/${loanId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) throw new Error("Failed to fetch loan");
    return await res.json();
  },

  async createLoan(data: CreateLoanDto) {
    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create loan");
    return await res.json();
  },

  async updateLoan(loanId: string, data: CreateLoanDto) {
    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    const res = await fetch(`${API_BASE}/${loanId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update loan");
    return await res.json();
  },

  async deleteLoan(loanId: string) {
    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    const res = await fetch(`${API_BASE}/${loanId}`, {
      method: "DELETE",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) throw new Error("Failed to delete loan");
    return await res.json();
  },

  async amendLoan(loanId: string, data: CreateLoanDto) {
    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    const res = await fetch(`${API_BASE}/${loanId}/amend`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to amend loan");
    return await res.json();
  },
};
