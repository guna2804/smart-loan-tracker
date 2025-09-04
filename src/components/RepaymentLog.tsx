import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import {
  Plus,
  Calendar,
  DollarSign,
  User,
  CheckCircle,
  Clock,
  Filter,
  Download
} from "lucide-react";
import { loanService } from "../services/loanService";
import { repaymentService } from "../services/repaymentService";
import type { Repayment, CreateRepaymentRequestDto } from "../types/repayment";
import type { OutstandingLoan } from "../types/loan";


const RepaymentLog = () => {
  const [currentRepayments, setCurrentRepayments] = useState<Repayment[]>([]);
  const [availableLoans, setAvailableLoans] = useState<OutstandingLoan[]>([]);
  const [outstandingLoans, setOutstandingLoans] = useState<OutstandingLoan[]>([]);
  const [selectedLoanId, setSelectedLoanId] = useState<string | null>(null);
  const [selectedLoan, setSelectedLoan] = useState<OutstandingLoan | null>(null);
  const [loadingLoans, setLoadingLoans] = useState(true);
  const [loadingRepayments, setLoadingRepayments] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      const response = await loanService.getOutstandingLoans({ page: 1, pageSize: 25 });
      const rawLoans = response?.loans || [];
      const loans = rawLoans.map(loan => ({
        ...loan,
        id: loan.loanId,
        loanType: (loan.role === 'Lender' ? 'lending' : 'borrowing') as 'lending' | 'borrowing',
        borrowerName: loan.role === 'Lender' ? 'Borrower' : loan.userName,
        lenderName: loan.role === 'Lender' ? loan.userName : 'Lender',
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
      const repaymentResponse = await repaymentService.getRepayments(loanId, { page: 1, pageSize: 25 });
      setCurrentRepayments(repaymentResponse.repayments);
    } catch (err) {
      console.error(`Failed to fetch repayments for loan ${loanId}`, err);
      setCurrentRepayments([]);
    } finally {
      setLoadingRepayments(false);
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
      resetForm();
    } catch (err) {
      console.error('Failed to create repayment', err);
      setError('Failed to record payment');
    }
  };

  const resetForm = () => {
    setFormData({
      loanId: '',
      amount: '',
      notes: ''
    });
    setIsDialogOpen(false);
  };


  const filteredRepayments = currentRepayments.filter(repayment => {
    // Since repayment object doesn't have loanType or paymentType, keep all for now
    return true;
  });

  const totalRepayments = filteredRepayments.reduce((sum, repayment) => sum + (repayment.amount || 0), 0);
  const totalInterest = filteredRepayments.reduce((sum, repayment) => sum + (repayment.interestComponent || 0), 0);
  const totalPrincipal = filteredRepayments.reduce((sum, repayment) => sum + (repayment.principalComponent || 0), 0);

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
            Repayment Log {selectedLoan ? `for ${selectedLoan.loanType === 'lending' ? selectedLoan.borrowerName : selectedLoan.lenderName}` : ''}
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Track loan repayments and payments</p>
        </div>
  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <Button variant="outline" className="flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Record New Payment</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="amount">Payment Amount ($)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    disabled={!selectedLoan?.allowOverpayment}
                    required
                  />
                  {!selectedLoan?.allowOverpayment && (
                    <p className="text-sm text-gray-500">Amount is fixed to EMI amount</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Add any notes about this payment..."
                  />
                </div>

                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-gradient-to-r from-blue-600 to-green-600">
                    Record Payment
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters and Summary */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <Label htmlFor="filterType">Filter by Type</Label>
            </div>
            <Select value={filterType} onValueChange={(value: 'all' | 'lending' | 'borrowing') => setFilterType(value)}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="lending">Lending</SelectItem>
                <SelectItem value="borrowing">Borrowing</SelectItem>
              </SelectContent>
            </Select>
            <div className="mt-3">
              <Label htmlFor="filterPaymentType">Payment Type</Label>
              <Select value={filterPaymentType} onValueChange={(value: 'all' | 'full' | 'partial') => setFilterPaymentType(value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payments</SelectItem>
                  <SelectItem value="full">Full Payments</SelectItem>
                  <SelectItem value="partial">Partial Payments</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
              <div>
                <p className="text-sm text-green-800">Total Payments</p>
                <p className="text-2xl font-bold text-green-900">${totalRepayments?.toLocaleString() || '0'}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
              <div>
                <p className="text-sm text-blue-800">Total Interest</p>
                <p className="text-2xl font-bold text-blue-900">${totalInterest?.toLocaleString() || '0'}</p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
              <div>
                <p className="text-sm text-purple-800">Total Principal</p>
                <p className="text-2xl font-bold text-purple-900">${totalPrincipal?.toLocaleString() || '0'}</p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

            {/* Outstanding Repayments Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Outstanding Repayments (Loans due today)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(outstandingLoans || []).length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="mx-auto h-12 w-12 text-green-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up 🎉</h3>
              <p className="text-gray-500">No loans require repayment today</p>
            </div>
          ) : (
            <div className="space-y-4">
              {(outstandingLoans || []).map((loan, index) => (
                <div
                  key={loan.id || `outstanding-loan-${index}`}
                  className={`flex flex-col lg:flex-row items-start lg:items-center justify-between p-4 rounded-lg transition-colors gap-4 lg:gap-0 cursor-pointer ${
                    selectedLoanId === loan.id ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                  onClick={() => handleLoanSelect(loan)}
                >
                  <div className="flex items-center space-x-3 sm:space-x-4 w-full lg:w-auto">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      loan.loanType === 'lending'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      <User className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {loan.loanType === 'lending' ? loan.borrowerName : loan.lenderName}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <Badge
                          variant={loan.status === 'Overdue' ? 'destructive' : 'secondary'}
                          className={loan.status === 'Overdue' ? 'bg-red-100 text-red-800' : ''}
                        >
                          {loan.status}
                        </Badge>
                        <Badge variant="outline">
                          {loan.allowOverpayment ? 'Allowed' : 'Not Allowed'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full lg:w-auto lg:flex lg:items-center lg:space-x-6">
                    <div className="text-center lg:text-left">
                      <p className="text-xs text-gray-500">Outstanding Balance</p>
                      <p className="font-bold text-gray-900">${loan.outstandingBalance?.toLocaleString() || '0'}</p>
                    </div>
                    <div className="text-center lg:text-left">
                      <p className="text-xs text-gray-500">Interest Rate</p>
                      <p className="font-bold text-gray-900">{loan.interestRate}%</p>
                    </div>
                    <div className="text-center lg:text-left">
                      <p className="text-xs text-gray-500">Next Due Date</p>
                      <p className="font-bold text-gray-900">{new Date(loan.nextDueDate).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="w-full lg:w-auto">
                    <Button
                      className="w-full lg:w-auto bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering loan select
                        setFormData({
                          loanId: loan.id,
                          amount: loan.emiAmount.toString(),
                          notes: ''
                        });
                        setIsDialogOpen(true);
                      }}
                    >
                      Make Repayment
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Repayment List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Payment History ({filteredRepayments.length} transactions)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingRepayments ? (
            <div className="text-center py-12">
              <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Loading repayments...</h3>
            </div>
          ) : filteredRepayments.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
              <p className="text-gray-500 mb-4">Start by recording your first payment</p>
              <Button onClick={() => setIsDialogOpen(true)} className="bg-gradient-to-r from-blue-600 to-green-600">
                <Plus className="w-4 h-4 mr-2" />
                Add Payment
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRepayments.map((repayment, index) => (
                <div key={repayment.id || `repayment-${index}`} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors gap-4 sm:gap-0">
                  <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Payment #{repayment.id.slice(-8)}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {new Date(repayment.repaymentDate).toLocaleDateString()}
                        {repayment.notes && (
                          <span className="ml-2">• {repayment.notes}</span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right w-full sm:w-auto">
                    <div className="font-bold text-base sm:text-lg text-gray-900">
                      ${repayment.amount?.toLocaleString() || '0'}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500">
                      Principal: ${repayment.principalComponent?.toLocaleString() || '0'}
                      {(repayment.interestComponent || 0) > 0 && (
                        <span className="ml-2">Interest: ${repayment.interestComponent?.toLocaleString() || '0'}</span>
                      )}
                    </div>
                  </div>

                  <div className="text-center w-full sm:w-auto">
                    <Badge variant="default">
                      Completed
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RepaymentLog;
