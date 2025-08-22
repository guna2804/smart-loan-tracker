import { useState, useCallback } from 'react';
import type { Loan } from '../utils/loanUtils';
import { validateLoanInputs, getDefaultLoan } from '../utils/loanUtils';
import { v4 as uuidv4 } from 'uuid';

export const useLoanTracker = (initialLoans: Loan[] = []) => {
  const [loans, setLoans] = useState<Loan[]>(initialLoans);
  const [activeTab, setActiveTab] = useState<'lending' | 'borrowing'>('lending');

  const addLoan = useCallback((newLoan: Omit<Loan, 'id' | 'status'>) => {
    const errors = validateLoanInputs(newLoan);
    if (errors.length > 0) {
      throw new Error(errors.join('\n'));
    }

    const loanToAdd: Loan = {
      ...newLoan,
      id: uuidv4(),
      status: 'active'
    };

    setLoans(prev => [...prev, loanToAdd]);
  }, []);

  const updateLoan = useCallback((updatedLoan: Loan) => {
    const errors = validateLoanInputs(updatedLoan);
    if (errors.length > 0) {
      throw new Error(errors.join('\n'));
    }

    setLoans(prev => prev.map(loan => 
      loan.id === updatedLoan.id ? updatedLoan : loan
    ));
  }, []);

  const deleteLoan = useCallback((id: string) => {
    setLoans(prev => prev.filter(loan => loan.id !== id));
  }, []);

  const getNewLoanDefaults = useCallback(() => {
    return getDefaultLoan(activeTab);
  }, [activeTab]);

  return {
    loans,
    activeTab,
    setActiveTab,
    addLoan,
    updateLoan,
    deleteLoan,
    getNewLoanDefaults,
    filteredLoans: loans.filter(l => l.type === activeTab)
  };
};