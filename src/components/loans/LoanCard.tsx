import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Calendar, DollarSign, User, TrendingUp, TrendingDown, Edit, Trash2 } from 'lucide-react';
import type { Loan } from '../../utils/loanUtils';

interface LoanCardProps {
  loan: Loan;
  onEdit: () => void;
  onDelete: () => void;
}

export const LoanCard = ({ loan, onEdit, onDelete }: LoanCardProps) => {
  const Icon = loan.type === 'lending' ? TrendingUp : TrendingDown;
  const badgeVariant = loan.status === 'overdue' ? 'destructive' : 'default';

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              loan.type === 'lending' 
                ? 'bg-green-100 text-green-600' 
                : 'bg-blue-100 text-blue-600'
            }`}>
              <User className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {loan.type === 'lending' ? loan.borrowerName : loan.lenderName}
              </h3>
              <p className="text-sm text-gray-500">
                {loan.type === 'lending' ? 'Borrower' : 'Lender'}
              </p>
            </div>
          </div>

          <div className="text-right space-y-1">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-gray-400" />
              <span className="font-bold text-lg">${loan.amount.toLocaleString()}</span>
            </div>
            <div className="text-sm text-gray-500">
              {loan.interestRate}% {loan.interestType}
            </div>
          </div>

          <div className="text-center">
            <Badge variant={badgeVariant}>
              {loan.status}
            </Badge>
            <div className="text-xs text-gray-500 mt-1">
              Due: {new Date(loan.dueDate).toLocaleDateString()}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onDelete}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Start:</span>
            <div className="font-medium">
              {new Date(loan.startDate).toLocaleDateString()}
            </div>
          </div>
          <div>
            <span className="text-gray-500">Remaining:</span>
            <div className="font-medium">
              ${loan.remainingAmount.toLocaleString()}
            </div>
          </div>
          <div>
            <span className="text-gray-500">Total Due:</span>
            <div className="font-medium">
              ${(loan.amount + (loan.amount * loan.interestRate/100)).toLocaleString()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};