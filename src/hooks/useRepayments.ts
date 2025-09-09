import { useState, useCallback } from 'react';
import { repaymentService } from '../services/repaymentService';
import type { Repayment, CreateRepaymentRequestDto, UpdateRepaymentRequestDto, PagedRepaymentResponse, RepaymentSummary } from '../types/repayment';

interface UseRepaymentsReturn {
  repayments: Repayment[];
  summary: RepaymentSummary | null;
  loading: boolean;
  error: string | null;
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  fetchRepayments: (loanId: string, params?: {
    page?: number;
    pageSize?: number;
    sortBy?: string;
    filter?: string;
  }) => Promise<void>;
  fetchSummary: (loanId: string, role?: 'lending' | 'borrowing' | 'all') => Promise<void>;
  createRepayment: (loanId: string, data: CreateRepaymentRequestDto) => Promise<Repayment | null>;
  updateRepayment: (loanId: string, repaymentId: string, data: UpdateRepaymentRequestDto) => Promise<Repayment | null>;
  deleteRepayment: (loanId: string, repaymentId: string) => Promise<boolean>;
  clearError: () => void;
}

export const useRepayments = (): UseRepaymentsReturn => {
  const [repayments, setRepayments] = useState<Repayment[]>([]);
  const [summary, setSummary] = useState<RepaymentSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [totalPages, setTotalPages] = useState(0);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchRepayments = useCallback(async (
    loanId: string,
    params: {
      page?: number;
      pageSize?: number;
      sortBy?: string;
      filter?: string;
    } = {}
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response: PagedRepaymentResponse = await repaymentService.getRepayments(loanId, params);
      setRepayments(response.repayments);
      setTotalCount(response.totalCount);
      setPage(response.page);
      setPageSize(response.pageSize);
      setTotalPages(response.totalPages);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch repayments';
      setError(errorMessage);
      console.error('Error fetching repayments:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSummary = useCallback(async (
    loanId: string,
    role: 'lending' | 'borrowing' | 'all' = 'all'
  ) => {
    setLoading(true);
    setError(null);
    try {
      const summaryData = await repaymentService.getRepaymentSummary(loanId, role);
      setSummary(summaryData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch repayment summary';
      setError(errorMessage);
      console.error('Error fetching repayment summary:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createRepayment = useCallback(async (
    loanId: string,
    data: CreateRepaymentRequestDto
  ): Promise<Repayment | null> => {
    setLoading(true);
    setError(null);
    try {
      const newRepayment = await repaymentService.createRepayment(loanId, data);
      // Optionally refresh the repayments list
      await fetchRepayments(loanId);
      return newRepayment;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create repayment';
      setError(errorMessage);
      console.error('Error creating repayment:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchRepayments]);

  const updateRepayment = useCallback(async (
    loanId: string,
    repaymentId: string,
    data: UpdateRepaymentRequestDto
  ): Promise<Repayment | null> => {
    setLoading(true);
    setError(null);
    try {
      const updatedRepayment = await repaymentService.updateRepayment(loanId, repaymentId, data);
      // Update the repayment in the local state
      setRepayments(prev => prev.map(repayment =>
        repayment.id === repaymentId ? updatedRepayment : repayment
      ));
      return updatedRepayment;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update repayment';
      setError(errorMessage);
      console.error('Error updating repayment:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteRepayment = useCallback(async (
    loanId: string,
    repaymentId: string
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await repaymentService.deleteRepayment(loanId, repaymentId);
      // Remove from local state
      setRepayments(prev => prev.filter(repayment => repayment.id !== repaymentId));
      setTotalCount(prev => prev - 1);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete repayment';
      setError(errorMessage);
      console.error('Error deleting repayment:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    repayments,
    summary,
    loading,
    error,
    totalCount,
    page,
    pageSize,
    totalPages,
    fetchRepayments,
    fetchSummary,
    createRepayment,
    updateRepayment,
    deleteRepayment,
    clearError,
  };
};