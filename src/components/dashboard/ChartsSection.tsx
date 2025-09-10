import React from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { ChartContainer, ChartBar, ChartPie } from '../ui/chart';
import type { MonthlyRepaymentData, LoanStatusDistribution } from '../../services/dashboardService';

interface ChartsSectionProps {
  monthlyRepayments: MonthlyRepaymentData[];
  loanStatusDistribution: LoanStatusDistribution[];
  className?: string;
}

export const ChartsSection: React.FC<ChartsSectionProps> = ({
  monthlyRepayments,
  loanStatusDistribution,
  className = ""
}) => {

  // Transform data for charts
  const monthlyRepaymentsData = React.useMemo(() => {
    if (!monthlyRepayments || !Array.isArray(monthlyRepayments) || monthlyRepayments.length === 0) {
      return [];
    }
    const transformed = monthlyRepayments
      .map((item, index) => ({
        month: String(item.month || `Month ${index + 1}`),
        repayments: Number(item.amount || 0),
      }))
      .filter(item => item.repayments > 0);
    return transformed;
  }, [monthlyRepayments]);

  const loanStatusData = React.useMemo(() => {
    if (!loanStatusDistribution || !Array.isArray(loanStatusDistribution) || loanStatusDistribution.length === 0) {
      return [];
    }
    const transformed = loanStatusDistribution
      .map(item => ({
        id: String(item.status || 'Unknown'),
        label: String(item.status || 'Unknown'),
        value: Number(item.count || 0),
        color: item.status === 'Active' ? '#10b981' : item.status === 'Closed' ? '#6366f1' : '#ef4444',
      }))
      .filter(item => item.value > 0);
    return transformed;
  }, [loanStatusDistribution]);

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 ${className}`}>
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">
            Monthly Repayments
          </h3>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            {monthlyRepaymentsData.length > 0 ? (
              <ChartContainer config={{}} className="h-full">
                <ChartBar data={monthlyRepaymentsData} config={{}} />
              </ChartContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <p className="text-lg font-medium">No repayment data</p>
                  <p className="text-sm">Monthly repayment data will appear here once available</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">
            Loan Status Distribution
          </h3>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            {loanStatusData.length > 0 ? (
              <ChartContainer config={{}} className="h-full">
                <ChartPie data={loanStatusData} config={{}} />
              </ChartContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <p className="text-lg font-medium">No loan data</p>
                  <p className="text-sm">Loan status distribution will appear here once loans are added</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
