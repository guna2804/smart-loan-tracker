export interface Loan {
  id: string;
  borrowerName: string;
  lenderName: string;
  amount: number;
  interestRate: number;
  interestType: 'flat' | 'compound';
  startDate: string;
  dueDate: string;
  status: 'active' | 'completed' | 'overdue';
  type: 'lending' | 'borrowing';
  notes?: string;
  remainingAmount: number;
}

export const calculateTotalLoanAmount = (loan: Loan): number => {
  const principal = loan.amount;
  const rate = loan.interestRate / 100;
  const timeInYears = (new Date(loan.dueDate).getTime() - new Date(loan.startDate).getTime()) / (1000 * 60 * 60 * 24 * 365);
  
  if (loan.interestType === 'compound') {
    return principal * Math.pow(1 + rate, timeInYears);
  }
  return principal * (1 + rate * timeInYears);
};

export const validateLoanInputs = (inputs: Partial<Loan>): string[] => {
  const errors: string[] = [];
  
  if (!inputs.amount || inputs.amount <= 0) {
    errors.push('Amount must be greater than 0');
  }
  
  if (!inputs.interestRate || inputs.interestRate <= 0) {
    errors.push('Interest rate must be greater than 0');
  }
  
  if (!inputs.startDate) {
    errors.push('Start date is required');
  }
  
  if (!inputs.dueDate) {
    errors.push('Due date is required');
  } else if (inputs.startDate && new Date(inputs.dueDate) <= new Date(inputs.startDate)) {
    errors.push('Due date must be after start date');
  }
  
  if (inputs.type === 'lending' && !inputs.borrowerName) {
    errors.push('Borrower name is required');
  }
  
  if (inputs.type === 'borrowing' && !inputs.lenderName) {
    errors.push('Lender name is required');
  }
  
  return errors;
};

export const getDefaultLoan = (type: 'lending' | 'borrowing'): Omit<Loan, 'id' | 'status'> => ({
  borrowerName: type === 'lending' ? '' : 'You',
  lenderName: type === 'borrowing' ? '' : 'You',
  amount: 0,
  interestRate: 5,
  interestType: 'flat',
  startDate: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  type,
  notes: '',
  remainingAmount: 0
});