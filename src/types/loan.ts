export interface Loan {
  id: string;
  userId: string;
  counterpartyName: string;
  role: string;
  principal: number;
  interestRate: number;
  interestType: number;
  startDate: string;
  endDate?: string;
  repaymentFrequency: number;
  allowOverpayment: boolean;
  currency: number;
  status: number;
  totalAmount: number;
  notes?: string;
  hasRepaymentStarted: boolean;
}

export interface PagedLoanResponse {
  loans: Loan[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface OutstandingLoan {
  loanId: string;
  outstandingBalance: number;
  interestRate: number;
  status: 'Active' | 'Overdue' | 'Completed';
  allowOverpayment: boolean;
  nextDueDate: string;
  emiAmount: number;
  userName: string;
  role: string;
  // Computed fields for component use
  id?: string;
  borrowerName?: string;
  lenderName?: string;
  loanType?: 'lending' | 'borrowing';
}
