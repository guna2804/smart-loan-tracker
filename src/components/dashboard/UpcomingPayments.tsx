import React from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { CalendarToday as Calendar } from '@mui/icons-material';
import type { UpcomingPayment } from '../../services/dashboardService';

interface UpcomingPaymentsProps {
  payments: UpcomingPayment[];
  className?: string;
}

export const UpcomingPayments: React.FC<UpcomingPaymentsProps> = ({
  payments,
  className = ""
}) => {
  return (
    <Card className={className}>
      <CardHeader>
        <h3 className="flex items-center text-lg font-semibold">
          <Calendar sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />
          Upcoming Payments
        </h3>
      </CardHeader>
      <CardContent className="space-y-4">
        {payments && payments.length > 0 ? (
          payments.map((payment) => (
            <div
              key={payment.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    payment.direction === "in"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {payment.direction === "in" ? "+" : "-"}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{payment.name}</p>
                  <p className="text-sm text-gray-500">{payment.dueDate}</p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`font-semibold ${
                    payment.direction === "in"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {payment.direction === "in" ? "+" : "-"}₹
                  {(payment.amount || 0).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Calendar sx={{ fontSize: 48, color: 'text.secondary', mx: 'auto', mb: 2 }} />
            <p>No upcoming payments</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};