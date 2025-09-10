import React from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Badge } from '../ui/badge';
import { RepaymentStatus } from '../../types/repayment';
import { People as Users, TrendingUp, TrendingDown } from '@mui/icons-material';
import type { RecentTransaction } from '../../services/dashboardService';

interface RecentTransactionsProps {
  transactions: RecentTransaction[];
  className?: string;
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
  className = ""
}) => {
  return (
    <Card className={className}>
      <CardHeader>
        <h3 className="flex items-center text-lg font-semibold">
          <Users sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />
          Recent Transactions
        </h3>
      </CardHeader>
      <CardContent className="space-y-4">
        {transactions && transactions.length > 0 ? (
          transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.direction === "in"
                      ? "bg-green-100 text-green-600"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {transaction.direction === "in" ? (
                    <TrendingUp sx={{ fontSize: 16 }} />
                  ) : (
                    <TrendingDown sx={{ fontSize: 16 }} />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {transaction.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Due: {transaction.dueDate}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  ₹{(transaction.amount || 0).toLocaleString()}
                </p>
                <Badge
                  variant="secondary"
                  className={
                    transaction.status === RepaymentStatus.Early
                      ? "bg-green-100 text-green-800 border-green-200"
                      : transaction.status === RepaymentStatus.OnTime
                      ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                      : "bg-red-100 text-red-800 border-red-200"
                  }
                >
                  {transaction.status}
                </Badge>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Users sx={{ fontSize: 48, color: 'text.secondary', mx: 'auto', mb: 2 }} />
            <p>No recent transactions</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};