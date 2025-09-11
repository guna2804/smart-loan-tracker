import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Clock } from "lucide-react";
import { loanService } from "../../services/loanService";
import { repaymentService } from "../../services/repaymentService";
import { useToast } from "../../hooks/use-toast";
import type { Repayment, CreateRepaymentRequestDto } from "../../types/repayment";
import type { OutstandingLoan } from "../../types/loan";

interface ApiError {
  response?: {
    data?: {
      code?: string;
      message?: string;
    } | string;
  };
  message?: string;
}
import RepaymentFilters from "./RepaymentFilters";
import RepaymentSummary from "./RepaymentSummary";
import OutstandingLoansList from "./OutstandingLoansList";
import RepaymentList from "./RepaymentList";
import RepaymentForm from "./RepaymentForm";
import RepaymentActions from "./RepaymentActions";


const RepaymentLog = () => {
  const { toast } = useToast();
  const [currentRepayments, setCurrentRepayments] = useState<Repayment[]>([]);
  const [availableLoans, setAvailableLoans] = useState<OutstandingLoan[]>([]);
  const [outstandingLoans, setOutstandingLoans] = useState<OutstandingLoan[]>([]);
  const [selectedLoanId, setSelectedLoanId] = useState<string | null>(null);
  const [selectedLoan, setSelectedLoan] = useState<OutstandingLoan | null>(null);
  const [loadingLoans, setLoadingLoans] = useState(true);
  const [loadingRepayments, setLoadingRepayments] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summaryData, setSummaryData] = useState<{totalPayments: number; totalInterest: number; totalPrincipal: number} | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'lending' | 'borrowing'>('all');
  const [filterPaymentType, setFilterPaymentType] = useState<'all' | 'full' | 'partial'>('all');

  const [formData, setFormData] = useState({
    loanId: '',
    amount: '',
    notes: ''
  });

  const fetchOutstandingLoans = async () => {
    try {
      setLoadingLoans(true);
      const response = await loanService.getOutstandingLoansSilent({ page: 1, pageSize: 25 });
      const rawLoans = response?.loans || [];
      const loans = rawLoans.map(loan => ({
        ...loan,
        id: loan.loanId,
        loanType: (loan.role === 'Lender' ? 'lending' : 'borrowing') as 'lending' | 'borrowing',
      }));
      setOutstandingLoans(loans);
      setAvailableLoans(loans); // Use outstanding loans for form selection
      if (loans.length > 0 && loans[0].id) {
        setSelectedLoanId(loans[0].id);
        setSelectedLoan(loans[0]);
        await fetchRepaymentsForLoan(loans[0].id);
      } else {
        setSelectedLoanId(null);
        setSelectedLoan(null);
        setCurrentRepayments([]);
      }
    } catch (err) {
      setError('Failed to load outstanding loans');
      console.error(err);
      setOutstandingLoans([]);
      setSelectedLoanId(null);
      setSelectedLoan(null);
      setCurrentRepayments([]);
    } finally {
      setLoadingLoans(false);
    }
  };

  const fetchRepaymentsForLoan = async (loanId: string) => {
    if (!loanId || loanId === 'undefined') {
      console.warn('Invalid loanId, skipping repayment fetch');
      setCurrentRepayments([]);
      setLoadingRepayments(false);
      return;
    }
    try {
      setLoadingRepayments(true);
      const repaymentResponse = await repaymentService.getRepaymentsSilent(loanId, { page: 1, pageSize: 25 });
      setCurrentRepayments(repaymentResponse.repayments);
    } catch (err) {
      console.error(`Failed to fetch repayments for loan ${loanId}`, err);
      setCurrentRepayments([]);
    } finally {
      setLoadingRepayments(false);
    }
  };

  const fetchRepaymentSummary = async (loanId: string, role: 'lending' | 'borrowing' | 'all' = 'all') => {
    if (!loanId || loanId === 'undefined') {
      console.warn('Invalid loanId, skipping summary fetch');
      setSummaryData({ totalPayments: 0, totalInterest: 0, totalPrincipal: 0 });
      return;
    }
    try {
      setLoadingSummary(true);
      const summary = await repaymentService.getRepaymentSummarySilent(loanId, role);
      setSummaryData(summary);
    } catch (err) {
      console.error(`Failed to fetch repayment summary for loan ${loanId}`, err);
      setSummaryData({ totalPayments: 0, totalInterest: 0, totalPrincipal: 0 });
      // Show error notification
      toast({
        title: "Error",
        description: "Failed to load repayment summary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleLoanSelect = async (loan: OutstandingLoan) => {
    if (!loan.id) {
      console.warn('Loan has no valid id');
      return;
    }
    setSelectedLoanId(loan.id);
    setSelectedLoan(loan);
    await fetchRepaymentsForLoan(loan.id);
    await fetchRepaymentSummary(loan.id, 'all');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch outstanding loans
        await fetchOutstandingLoans();
      } catch (err) {
        setError('Failed to load data');
        console.error(err);
      }
    };

    fetchData();
  }, []);

  // Fetch summary when filter changes
  useEffect(() => {
    if (selectedLoanId) {
      const role = filterType === 'lending' ? 'lending' : filterType === 'borrowing' ? 'borrowing' : 'all';
      fetchRepaymentSummary(selectedLoanId, role);
    }
  }, [filterType, selectedLoanId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedLoan = availableLoans.find(loan => loan.id === formData.loanId);
    if (!selectedLoan) {
      console.warn('Selected loan not found in available loans');
      return;
    }

    try {
      const repaymentData: CreateRepaymentRequestDto = {
        amount: parseFloat(formData.amount),
        repaymentDate: new Date().toISOString(),
        notes: formData.notes || undefined,
      };

      const newRepayment = await repaymentService.createRepayment(formData.loanId, repaymentData);

      // Add to local state if it's for the current selected loan
      if (formData.loanId === selectedLoanId) {
        setCurrentRepayments([newRepayment, ...currentRepayments]);
      }

      // Refetch data to ensure UI is updated with latest backend state
      await fetchOutstandingLoans();
      if (selectedLoanId) {
        await fetchRepaymentsForLoan(selectedLoanId);
        await fetchRepaymentSummary(selectedLoanId, 'all');
      }

      // Close modal and reset form on successful submission
      setIsDialogOpen(false);
      setFormData({
        loanId: '',
        amount: '',
        notes: ''
      });

      // Show success toast
      toast({
        title: "Success",
        description: "Payment recorded successfully!",
        variant: "default",
      });

    } catch (err) {
      console.error('Failed to create repayment', err);

      // Extract error message from API response
      let errorMessage = "Failed to record payment. Please try again.";

      if (err && typeof err === 'object') {
        const errorObj = err as ApiError;
        if (errorObj?.response?.data) {
          const errorData = errorObj.response.data;
          if (typeof errorData === 'object' && errorData.message) {
            errorMessage = errorData.message;
          } else if (typeof errorData === 'string') {
            errorMessage = errorData;
          }
        } else if (errorObj?.message) {
          errorMessage = errorObj.message;
        }
      }

      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };


  if (loadingLoans) {
    return (
      <div className="p-4 sm:p-6 md:p-8 space-y-8 max-w-full">
        <div className="text-center py-12">
          <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Loading outstanding loans...</h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 md:p-8 space-y-8 max-w-full">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-red-900 mb-2">Error: {error}</h3>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8 max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Repayment Log 
          </h1>
            {/* <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Repayment Log {selectedLoan ? `for ${selectedLoan.loanType === 'lending' ? selectedLoan.borrowerName : (selectedLoan.lenderName || 'Unknown')}` : ''}
          </h1> */}
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Track loan repayments and payments</p>
        </div>
        <RepaymentActions selectedLoan={selectedLoan} onAddPayment={() => setIsDialogOpen(true)} />
      </div>

      {/* Filters and Summary */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex flex-col justify-center lg:w-1/4">
          <RepaymentFilters
            filterType={filterType}
            setFilterType={setFilterType}
            filterPaymentType={filterPaymentType}
            setFilterPaymentType={setFilterPaymentType}
          />
        </div>
        <div className="flex-1">
          <RepaymentSummary
            summaryData={summaryData}
            loading={loadingSummary}
            filterType={filterType}
          />
        </div>
      </div>

      <OutstandingLoansList
        outstandingLoans={outstandingLoans}
        selectedLoanId={selectedLoanId}
        onLoanSelect={handleLoanSelect}
        onMakeRepayment={(loan) => {
          setFormData({
            loanId: loan.id,
            amount: loan.emiAmount.toString(),
            notes: ''
          });
          setIsDialogOpen(true);
        }}
        filterType={filterType}
      />

      <RepaymentList
        filteredRepayments={currentRepayments}
        loadingRepayments={loadingRepayments}
        onAddPayment={() => setIsDialogOpen(true)}
        selectedLoan={selectedLoan}
        filterType={filterType}
      />

      <RepaymentForm
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        selectedLoan={selectedLoan}
      />
    </div>
  );
};

export default RepaymentLog;
