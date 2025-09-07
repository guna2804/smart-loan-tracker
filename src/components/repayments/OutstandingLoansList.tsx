import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Clock, CheckCircle, User } from "lucide-react";
import type { OutstandingLoan } from "../../types/loan";

interface OutstandingLoansListProps {
  outstandingLoans: OutstandingLoan[];
  selectedLoanId: string | null;
  onLoanSelect: (loan: OutstandingLoan) => void;
  onMakeRepayment: (loan: OutstandingLoan) => void;
  filterType: 'all' | 'lending' | 'borrowing';
}

const OutstandingLoansList = ({
  outstandingLoans,
  selectedLoanId,
  onLoanSelect,
  onMakeRepayment,
  filterType
}: OutstandingLoansListProps) => {
  // Filter loans based on the selected filter
  const filteredLoans = outstandingLoans.filter(loan => {
    if (filterType === 'all') return true;
    return loan.loanType === filterType;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          Outstanding Repayments ({filterType === 'all' ? 'All' : filterType === 'lending' ? 'Lending' : 'Borrowing'} loans due today)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {filteredLoans.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="mx-auto h-12 w-12 text-green-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up 🎉</h3>
            <p className="text-gray-500">No loans require repayment today</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLoans.map((loan, index) => (
              <div
                key={loan.id || `outstanding-loan-${index}`}
                className={`flex flex-col lg:flex-row items-start lg:items-center justify-between p-4 rounded-lg transition-colors gap-4 lg:gap-0 cursor-pointer ${
                  selectedLoanId === loan.id ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => onLoanSelect(loan)}
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
                      {loan.loanType === 'lending' ? loan.borrowerName : (loan.lenderName || 'Unknown')}
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
                    <p className="font-bold text-gray-900">₹{loan.outstandingBalance?.toLocaleString('en-IN') || '0'}</p>
                  </div>
                  <div className="text-center lg:text-left">
                    <p className="text-xs text-gray-500">Interest Rate</p>
                    <p className="font-bold text-gray-900">{loan.interestRate}%</p>
                  </div>
                  <div className="text-center lg:text-left">
                    <p className="text-xs text-gray-500">Next Due Date</p>
                    <p className="font-bold text-gray-900">{new Date(loan.nextDueDate).toLocaleDateString('en-IN')}</p>
                  </div>
                </div>

                <div className="w-full lg:w-auto">
                  <Button
                    className="w-full lg:w-auto bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering loan select
                      onMakeRepayment(loan);
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
  );
};

export default OutstandingLoansList;