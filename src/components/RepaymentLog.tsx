import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
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

interface Repayment {
  id: string;
  loanId: string;
  borrowerName: string;
  lenderName: string;
  amount: number;
  paymentDate: string;
  paymentType: 'full' | 'partial';
  notes?: string;
  loanType: 'lending' | 'borrowing';
  interestAmount: number;
  principalAmount: number;
}

const RepaymentLog = () => {
  const [repayments, setRepayments] = useState<Repayment[]>([
    {
      id: '1',
      loanId: '1',
      borrowerName: 'John Doe',
      lenderName: 'You',
      amount: 800,
      paymentDate: '2025-07-15',
      paymentType: 'partial',
      notes: 'Monthly installment payment',
      loanType: 'lending',
      interestAmount: 150,
      principalAmount: 650
    },
    {
      id: '2',
      loanId: '2',
      borrowerName: 'You',
      lenderName: 'Jane Smith',
      amount: 400,
      paymentDate: '2025-07-20',
      paymentType: 'partial',
      notes: 'Partial payment for business loan',
      loanType: 'borrowing',
      interestAmount: 50,
      principalAmount: 350
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'lending' | 'borrowing'>('all');
  const [filterPaymentType, setFilterPaymentType] = useState<'all' | 'full' | 'partial'>('all');

  const [formData, setFormData] = useState({
    loanId: '',
    amount: '',
    paymentDate: '',
    paymentType: 'partial' as 'full' | 'partial',
    notes: '',
    interestAmount: '',
    principalAmount: ''
  });

  // Mock loan data for selection
  const availableLoans = [
    { id: '1', borrowerName: 'John Doe', lenderName: 'You', type: 'lending' as const, remainingAmount: 4200 },
    { id: '2', borrowerName: 'You', lenderName: 'Jane Smith', type: 'borrowing' as const, remainingAmount: 2100 }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedLoan = availableLoans.find(loan => loan.id === formData.loanId);
    if (!selectedLoan) return;

    const newRepayment: Repayment = {
      id: Date.now().toString(),
      loanId: formData.loanId,
      borrowerName: selectedLoan.borrowerName,
      lenderName: selectedLoan.lenderName,
      amount: parseFloat(formData.amount),
      paymentDate: formData.paymentDate,
      paymentType: formData.paymentType,
      notes: formData.notes,
      loanType: selectedLoan.type,
      interestAmount: parseFloat(formData.interestAmount) || 0,
      principalAmount: parseFloat(formData.principalAmount) || parseFloat(formData.amount)
    };

    setRepayments([newRepayment, ...repayments]);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      loanId: '',
      amount: '',
      paymentDate: '',
      paymentType: 'partial',
      notes: '',
      interestAmount: '',
      principalAmount: ''
    });
    setIsDialogOpen(false);
  };

  const handleAmountChange = (amount: string) => {
    setFormData({
      ...formData,
      amount,
      principalAmount: amount // Auto-fill principal amount
    });
  };

  const filteredRepayments = repayments.filter(repayment => {
    const typeMatch = filterType === 'all' || repayment.loanType === filterType;
    const paymentTypeMatch = filterPaymentType === 'all' || repayment.paymentType === filterPaymentType;
    return typeMatch && paymentTypeMatch;
  });

  const totalRepayments = filteredRepayments.reduce((sum, repayment) => sum + repayment.amount, 0);
  const totalInterest = filteredRepayments.reduce((sum, repayment) => sum + repayment.interestAmount, 0);
  const totalPrincipal = filteredRepayments.reduce((sum, repayment) => sum + repayment.principalAmount, 0);

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Repayment Log</h1>
          <p className="text-gray-600 mt-1">Track all loan repayments and payments</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Payment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Record New Payment</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="loanId">Select Loan</Label>
                    <Select 
                      value={formData.loanId} 
                      onValueChange={(value) => setFormData({...formData, loanId: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a loan" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableLoans.map((loan) => (
                          <SelectItem key={loan.id} value={loan.id}>
                            {loan.type === 'lending' ? `${loan.borrowerName} (Lending)` : `${loan.lenderName} (Borrowing)`}
                            - ${loan.remainingAmount.toLocaleString()} remaining
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paymentDate">Payment Date</Label>
                    <Input
                      id="paymentDate"
                      type="date"
                      value={formData.paymentDate}
                      onChange={(e) => setFormData({...formData, paymentDate: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Payment Amount ($)</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => handleAmountChange(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paymentType">Payment Type</Label>
                    <Select 
                      value={formData.paymentType} 
                      onValueChange={(value: 'full' | 'partial') => 
                        setFormData({...formData, paymentType: value})
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="partial">Partial Payment</SelectItem>
                        <SelectItem value="full">Full Payment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="principalAmount">Principal Amount ($)</Label>
                    <Input
                      id="principalAmount"
                      type="number"
                      step="0.01"
                      value={formData.principalAmount}
                      onChange={(e) => setFormData({...formData, principalAmount: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="interestAmount">Interest Amount ($)</Label>
                    <Input
                      id="interestAmount"
                      type="number"
                      step="0.01"
                      value={formData.interestAmount}
                      onChange={(e) => setFormData({...formData, interestAmount: e.target.value})}
                      placeholder="0.00"
                    />
                  </div>
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

                <div className="flex justify-end space-x-3">
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
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <Label htmlFor="filterType">Filter by Type</Label>
            </div>
            <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
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
              <Select value={filterPaymentType} onValueChange={(value: any) => setFilterPaymentType(value)}>
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
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-800">Total Payments</p>
                <p className="text-2xl font-bold text-green-900">${totalRepayments.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-800">Total Interest</p>
                <p className="text-2xl font-bold text-blue-900">${totalInterest.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-800">Total Principal</p>
                <p className="text-2xl font-bold text-purple-900">${totalPrincipal.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Repayment List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Payment History ({filteredRepayments.length} transactions)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredRepayments.length === 0 ? (
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
              {filteredRepayments.map((repayment) => (
                <div key={repayment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      repayment.loanType === 'lending' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {repayment.loanType === 'lending' ? repayment.borrowerName : repayment.lenderName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(repayment.paymentDate).toLocaleDateString()} • 
                        <Badge variant="outline" className="ml-2">
                          {repayment.paymentType}
                        </Badge>
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-lg text-gray-900">
                      ${repayment.amount.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      Principal: ${repayment.principalAmount.toLocaleString()}
                      {repayment.interestAmount > 0 && (
                        <span className="ml-2">Interest: ${repayment.interestAmount.toLocaleString()}</span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <Badge variant={repayment.loanType === 'lending' ? 'default' : 'secondary'}>
                      {repayment.loanType === 'lending' ? 'Received' : 'Paid'}
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