import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Progress } from '../ui/progress';
import { Tabs, Tab, Box } from '@mui/material';
import { Calendar, IndianRupee, TrendingUp, PieChart } from 'lucide-react';
import type { EMIResult } from '../../utils/calculationUtils';

interface ResultsDisplayProps {
  result: EMIResult | null;
  loanAmount: string;
  interestRate: string;
  loanTenure: string;
  tenureType: 'months' | 'years';
  error: string;
}

export const ResultsDisplay = ({
  result,
  loanAmount,
  interestRate,
  loanTenure,
  tenureType,
  error
}: ResultsDisplayProps) => {
  const [activeTab, setActiveTab] = useState('summary');

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  const interestPercentage = result ? (result.totalInterest / result.totalAmount) * 100 : 0;
  const principalPercentage = result ? 100 - interestPercentage : 0;

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      {result && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-800">Monthly EMI</p>
                  <p className="text-2xl font-bold text-blue-900">
                    ₹{result.emi.toLocaleString(undefined, { maximumFractionDigits: 0 })}
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
                    ₹{result.totalAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                </div>
                <IndianRupee className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-800">Total Interest</p>
                  <p className="text-2xl font-bold text-red-900">
                    ₹{result.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Payment Breakdown */}
      {result && (
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
                  <span>₹{(result.totalAmount - result.totalInterest).toLocaleString()}</span>
                </div>
                <Progress value={principalPercentage} className="h-3" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Interest ({interestPercentage.toFixed(1)}%)</span>
                  <span>₹{result.totalInterest.toLocaleString()}</span>
                </div>
                <Progress value={interestPercentage} className="h-3 bg-red-100" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Schedule */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              sx={{
                minHeight: 40,
                '& .MuiTabs-indicator': {
                  height: 2,
                },
              }}
            >
              <Tab
                value="summary"
                label="Summary"
                sx={{
                  minHeight: 32,
                  borderRadius: 0.5,
                  px: 3,
                  py: 1.5,
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  textTransform: 'none',
                  '&.Mui-selected': {
                    bgcolor: 'background.paper',
                    color: 'text.primary',
                    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
                  },
                }}
              />
              <Tab
                value="detailed"
                label="Detailed Schedule"
                sx={{
                  minHeight: 32,
                  borderRadius: 0.5,
                  px: 3,
                  py: 1.5,
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  textTransform: 'none',
                  '&.Mui-selected': {
                    bgcolor: 'background.paper',
                    color: 'text.primary',
                    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
                  },
                }}
              />
            </Tabs>

            <Box sx={{ mt: 2 }}>
              {activeTab === "summary" && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Loan Amount</p>
                    <p className="text-lg font-semibold">₹{parseFloat(loanAmount).toLocaleString()}</p>
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
              )}
              {activeTab === "detailed" && (
                <div className="space-y-4">
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
                              ₹{row.emi.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-right">
                              ₹{row.principal.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-right">
                              ₹{row.interest.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-right">
                              ₹{row.balance.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="text-sm text-gray-600 text-center">
                    Showing {result.monthlyBreakdown.length} monthly payments
                  </div>
                </div>
              )}
            </Box>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
