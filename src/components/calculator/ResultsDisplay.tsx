import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Calendar, DollarSign, TrendingUp, PieChart } from 'lucide-react';
import type { EMIResult } from '../../utils/calculationUtils';

interface ResultsDisplayProps {
  result: EMIResult;
  loanAmount: string;
  interestRate: string;
  loanTenure: string;
  tenureType: 'months' | 'years';
  onExport: () => void;
}

export const ResultsDisplay = ({
  result,
  loanAmount,
  interestRate,
  loanTenure,
  tenureType,
  onExport
}: ResultsDisplayProps) => {
  const interestPercentage = (result.totalInterest / result.totalAmount) * 100;
  const principalPercentage = 100 - interestPercentage;
  // Note: onExport is intentionally not used in this component as it's handled by parent

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-800">Monthly EMI</p>
                <p className="text-2xl font-bold text-blue-900">
                  ${result.emi.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-800">Total Amount</p>
                <p className="text-2xl font-bold text-green-900">
                  ${result.totalAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-800">Total Interest</p>
                <p className="text-2xl font-bold text-red-900">
                  ${result.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <PieChart className="w-5 h-5 mr-2" />
            Payment Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Principal ({principalPercentage.toFixed(1)}%)</span>
                <span>${(result.totalAmount - result.totalInterest).toLocaleString()}</span>
              </div>
              <Progress value={principalPercentage} className="h-3" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Interest ({interestPercentage.toFixed(1)}%)</span>
                <span>${result.totalInterest.toLocaleString()}</span>
              </div>
              <Progress value={interestPercentage} className="h-3 bg-red-100" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="summary">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="detailed">Detailed Schedule</TabsTrigger>
            </TabsList>
            
            <TabsContent value="summary" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Loan Amount</p>
                  <p className="text-lg font-semibold">${parseFloat(loanAmount).toLocaleString()}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Interest Rate</p>
                  <p className="text-lg font-semibold">{interestRate}%</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Tenure</p>
                  <p className="text-lg font-semibold">
                    {tenureType === 'years' ? `${loanTenure} years` : `${loanTenure} months`}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Total Payments</p>
                  <p className="text-lg font-semibold">{result.monthlyBreakdown.length}</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="detailed" className="space-y-4">
              <div className="max-h-[500px] overflow-auto border border-gray-300 rounded-lg">
                <table className="w-full border-collapse">
                  <thead className="sticky top-0 bg-gray-50">
                    <tr>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Month</th>
                      <th className="border border-gray-300 px-4 py-3 text-right font-semibold">EMI</th>
                      <th className="border border-gray-300 px-4 py-3 text-right font-semibold">Principal</th>
                      <th className="border border-gray-300 px-4 py-3 text-right font-semibold">Interest</th>
                      <th className="border border-gray-300 px-4 py-3 text-right font-semibold">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.monthlyBreakdown.map((row) => (
                      <tr key={row.month} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">{row.month}</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">
                          ${row.emi.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-right">
                          ${row.principal.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-right">
                          ${row.interest.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-right">
                          ${row.balance.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="text-sm text-gray-600 text-center">
                Showing {result.monthlyBreakdown.length} monthly payments
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
