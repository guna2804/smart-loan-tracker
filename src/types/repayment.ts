export interface Repayment {
  id: string;
  loanId: string;
  amount: number;
  interestComponent: number;
  principalComponent: number;
  repaymentDate: string;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRepaymentRequestDto {
  amount: number;
  repaymentDate: string;
  notes?: string;
}

export interface UpdateRepaymentRequestDto {
  amount: number;
  repaymentDate: string;
  notes?: string;
}

export interface PagedRepaymentResponse {
  repayments: Repayment[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface RepaymentSummary {
  totalPayments: number;
  totalInterest: number;
  totalPrincipal: number;
}