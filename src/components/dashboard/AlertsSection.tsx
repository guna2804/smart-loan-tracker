import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../ui/card';
import { Warning as AlertTriangle } from '@mui/icons-material';
import type { Alert } from '../../services/dashboardService';

interface AlertsSectionProps {
  alerts: Alert[];
  className?: string;
}

export const AlertsSection: React.FC<AlertsSectionProps> = ({
  alerts,
  className = ""
}) => {
  const overdueAlerts = alerts && Array.isArray(alerts)
    ? alerts.filter(alert => alert.type === 'overdue')
    : [];

  if (overdueAlerts.length === 0) {
    return null;
  }

  return (
    <Card className={`border-red-200 bg-red-50 ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center space-x-3">
          <AlertTriangle sx={{ fontSize: 24, color: 'error.main' }} />
          <div>
            <h3 className="font-semibold text-red-900">
              Attention Required
            </h3>
            <p className="text-red-700">
              You have {overdueAlerts.length} overdue payment
              {overdueAlerts.length > 1 ? "s" : ""}.
              <Link
                to="/repayments"
                className="underline ml-1 hover:text-red-900"
              >
                Review now
              </Link>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};