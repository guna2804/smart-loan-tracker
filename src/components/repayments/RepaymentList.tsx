import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Calendar, Clock, Plus, User } from "lucide-react";
import type { Repayment } from "../../types/repayment";
import type { OutstandingLoan } from "../../types/loan";
import RepaymentItem from "./RepaymentItem";

interface RepaymentListProps {
  filteredRepayments: Repayment[];
  loadingRepayments: boolean;
  onAddPayment: () => void;
  selectedLoan: OutstandingLoan | null;
  filterType: 'all' | 'lending' | 'borrowing';
}

const RepaymentList = ({
  filteredRepayments,
  loadingRepayments,
  onAddPayment,
  selectedLoan,
  filterType
}: RepaymentListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Payment History ({filteredRepayments.length} transactions)
        </CardTitle>
        {selectedLoan && (
          <div className="flex items-center space-x-2 mt-2">
            <User className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              Showing payments for: <span className="font-medium text-gray-900">
                {selectedLoan.loanType === 'lending' ? selectedLoan.borrowerName : (selectedLoan.lenderName || 'Unknown')}
              </span>
            </span>
            <Badge variant="outline" className="text-xs">
              {selectedLoan.loanType === 'lending' ? 'Lending' : 'Borrowing'}
            </Badge>
            <span className="text-sm text-gray-600 ml-2">
              • Outstanding: <span className="font-medium text-gray-900">₹{selectedLoan.outstandingBalance?.toLocaleString('en-IN') || '0'}</span>
            </span>
          </div>
        )}
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
            <Button onClick={onAddPayment} className="bg-gradient-to-r from-blue-600 to-green-600">
              <Plus className="w-4 h-4 mr-2" />
              Add Payment
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRepayments.map((repayment, index) => (
              <RepaymentItem key={repayment.id || `repayment-${index}`} repayment={repayment} index={index} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RepaymentList;