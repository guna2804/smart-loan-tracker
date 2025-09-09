import { useState, useCallback } from 'react';
import { loanService, type Loan, type CreateLoanDto, type PagedLoanResponse } from '../services/loanService';
import type { OutstandingLoan } from '../types/loan';

interface UseLoansReturn {
  loans: Loan[];
  outstandingLoans: OutstandingLoan[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  fetchLoans: (params?: {
    role?: string;
    status?: string;
    page?: number;
    pageSize?: number;
  }) => Promise<void>;
  fetchOutstandingLoans: (params?: {
    page?: number;
    pageSize?: number;
  }) => Promise<void>;
  createLoan: (data: CreateLoanDto) => Promise<Loan | null>;
  updateLoan: (loanId: string, data: CreateLoanDto) => Promise<Loan | null>;
  deleteLoan: (loanId: string) => Promise<boolean>;
  amendLoan: (loanId: string, data: CreateLoanDto) => Promise<Loan | null>;
  getLoan: (loanId: string) => Promise<Loan | null>;
  clearError: () => void;
}

export const useLoans = (): UseLoansReturn => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [outstandingLoans, setOutstandingLoans] = useState<OutstandingLoan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [totalPages, setTotalPages] = useState(0);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchLoans = useCallback(async (params: {
    role?: string;
    status?: string;
    page?: number;
    pageSize?: number;
  } = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response: PagedLoanResponse = await loanService.getLoans(params);
      setLoans(response.loans);
      setTotalCount(response.totalCount);
      setPage(response.page);
      setPageSize(response.pageSize);
      setTotalPages(response.totalPages);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch loans';
      setError(errorMessage);
      console.error('Error fetching loans:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOutstandingLoans = useCallback(async (params: {
    page?: number;
    pageSize?: number;
  } = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await loanService.getOutstandingLoans(params);
      setOutstandingLoans(response.loans);
      setTotalCount(response.totalCount);
      setPage(response.page);
      setPageSize(response.pageSize);
      setTotalPages(response.totalPages);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch outstanding loans';
      setError(errorMessage);
      console.error('Error fetching outstanding loans:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createLoan = useCallback(async (data: CreateLoanDto): Promise<Loan | null> => {
    setLoading(true);
    setError(null);
    try {
      const newLoan = await loanService.createLoan(data);
      // Optionally refresh the loans list
      await fetchLoans();
      return newLoan;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create loan';
      setError(errorMessage);
      console.error('Error creating loan:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchLoans]);

  const updateLoan = useCallback(async (loanId: string, data: CreateLoanDto): Promise<Loan | null> => {
    setLoading(true);
    setError(null);
    try {
      const updatedLoan = await loanService.updateLoan(loanId, data);
      // Update the loan in the local state
      setLoans(prev => prev.map(loan => loan.id === loanId ? updatedLoan : loan));
      return updatedLoan;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update loan';
      setError(errorMessage);
      console.error('Error updating loan:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteLoan = useCallback(async (loanId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await loanService.deleteLoan(loanId);
      // Remove from local state
      setLoans(prev => prev.filter(loan => loan.id !== loanId));
      setTotalCount(prev => prev - 1);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete loan';
      setError(errorMessage);
      console.error('Error deleting loan:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const amendLoan = useCallback(async (loanId: string, data: CreateLoanDto): Promise<Loan | null> => {
    setLoading(true);
    setError(null);
    try {
      const amendedLoan = await loanService.amendLoan(loanId, data);
      // Update the loan in the local state
      setLoans(prev => prev.map(loan => loan.id === loanId ? amendedLoan : loan));
      return amendedLoan;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to amend loan';
      setError(errorMessage);
      console.error('Error amending loan:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getLoan = useCallback(async (loanId: string): Promise<Loan | null> => {
    setLoading(true);
    setError(null);
    try {
      const loan = await loanService.getLoan(loanId);
      return loan;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch loan';
      setError(errorMessage);
      console.error('Error fetching loan:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loans,
    outstandingLoans,
    loading,
    error,
    totalCount,
    page,
    pageSize,
    totalPages,
    fetchLoans,
    fetchOutstandingLoans,
    createLoan,
    updateLoan,
    deleteLoan,
    amendLoan,
    getLoan,
    clearError,
  };
};