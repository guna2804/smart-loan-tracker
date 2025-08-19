import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";
import { 
  Calculator, 
  TrendingUp, 
  Calendar,
  DollarSign,
  PieChart,
  Download,
  RefreshCw
} from "lucide-react";

interface EMIResult {
  emi: number;
  totalAmount: number;
  totalInterest: number;
  monthlyBreakdown: Array<{
    month: number;
    emi: number;
    principal: number;
    interest: number;
    balance: number;
  }>;
}

const EMICalculator = () => {
  const [loanAmount, setLoanAmount] = useState<string>('100000');
  const [interestRate, setInterestRate] = useState<string>('8.5');
  const [loanTenure, setLoanTenure] = useState<string>('12');
  const [tenureType, setTenureType] = useState<'months' | 'years'>('months');
  const [calculationType, setCalculationType] = useState<'emi' | 'loan-amount' | 'tenure'>('emi');
  const [targetEMI, setTargetEMI] = useState<string>('');
  const [result, setResult] = useState<EMIResult | null>(null);

  const calculateEMI = (principal: number, rate: number, tenure: number): EMIResult => {
    const monthlyRate = rate / (12 * 100);
    const numPayments = tenure;
    
    if (monthlyRate === 0) {
      const emi = principal / numPayments;
      return {
        emi,
        totalAmount: principal,
        totalInterest: 0,
        monthlyBreakdown: Array.from({ length: numPayments }, (_, i) => ({
          month: i + 1,
          emi,
          principal: emi,
          interest: 0,
          balance: principal - (emi * (i + 1))
        }))
      };
    }

    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                (Math.pow(1 + monthlyRate, numPayments) - 1);
    
    const totalAmount = emi * numPayments;
    const totalInterest = totalAmount - principal;

    const monthlyBreakdown = [];
    let remainingBalance = principal;

    for (let i = 1; i <= numPayments; i++) {
      const interestComponent = remainingBalance * monthlyRate;
      const principalComponent = emi - interestComponent;
      remainingBalance -= principalComponent;

      monthlyBreakdown.push({
        month: i,
        emi: emi,
        principal: principalComponent,
        interest: interestComponent,
        balance: Math.max(0, remainingBalance)
      });
    }

    return {
      emi,
      totalAmount,
      totalInterest,
      monthlyBreakdown
    };
  };

  const calculateMaxLoanAmount = (emi: number, rate: number, tenure: number): number => {
    const monthlyRate = rate / (12 * 100);
    if (monthlyRate === 0) return emi * tenure;
    
    return (emi * (Math.pow(1 + monthlyRate, tenure) - 1)) / 
           (monthlyRate * Math.pow(1 + monthlyRate, tenure));
  };

  const calculateTenure = (principal: number, emi: number, rate: number): number => {
    const monthlyRate = rate / (12 * 100);
    if (monthlyRate === 0) return principal / emi;
    
    return Math.log(1 + (principal * monthlyRate) / emi) / Math.log(1 + monthlyRate);
  };

  useEffect(() => {
    const principal = parseFloat(loanAmount) || 0;
    const rate = parseFloat(interestRate) || 0;
    const tenure = tenureType === 'years' ? (parseFloat(loanTenure) || 0) * 12 : parseFloat(loanTenure) || 0;

    if (principal > 0 && rate >= 0 && tenure > 0) {
      if (calculationType === 'emi') {
        setResult(calculateEMI(principal, rate, tenure));
      }
    }
  }, [loanAmount, interestRate, loanTenure, tenureType, calculationType]);

  const handleCalculationTypeChange = (type: 'emi' | 'loan-amount' | 'tenure') => {
    setCalculationType(type);
    setResult(null);
  };

  const handleCustomCalculation = () => {
    const rate = parseFloat(interestRate) || 0;
    const tenure = tenureType === 'years' ? (parseFloat(loanTenure) || 0) * 12 : parseFloat(loanTenure) || 0;

    if (calculationType === 'loan-amount' && targetEMI) {
      const emi = parseFloat(targetEMI);
      const maxLoan = calculateMaxLoanAmount(emi, rate, tenure);
      setLoanAmount(maxLoan.toFixed(0));
      setResult(calculateEMI(maxLoan, rate, tenure));
    } else if (calculationType === 'tenure' && targetEMI) {
      const principal = parseFloat(loanAmount) || 0;
      const emi = parseFloat(targetEMI);
      const requiredTenure = calculateTenure(principal, emi, rate);
      setLoanTenure(Math.ceil(requiredTenure).toString());
      setResult(calculateEMI(principal, rate, Math.ceil(requiredTenure)));
    }
  };

  const resetCalculator = () => {
    setLoanAmount('100000');
    setInterestRate('8.5');
    setLoanTenure('12');
    setTenureType('months');
    setTargetEMI('');
    setResult(null);
  };

  const exportData = () => {
    if (!result) return;
    
    const csvData = [
      ['Month', 'EMI', 'Principal', 'Interest', 'Balance'],
      ...result.monthlyBreakdown.map(row => [
        row.month,
        row.emi.toFixed(2),
        row.principal.toFixed(2),
        row.interest.toFixed(2),
        row.balance.toFixed(2)
      ])
    ];
    
    const csv = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'emi-breakdown.csv';
    a.click();
  };

  const interestPercentage = result ? (result.totalInterest / result.totalAmount) * 100 : 0;
  const principalPercentage = 100 - interestPercentage;

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">EMI Calculator</h1>
          <p className="text-gray-600 mt-1">Calculate loan EMIs and payment schedules</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={resetCalculator}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          {result && (
            <Button variant="outline" onClick={exportData}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calculator Input */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="w-5 h-5 mr-2" />
                Loan Calculator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Calculation Type</Label>
                <Select 
                  value={calculationType} 
                  onValueChange={(value: any) => handleCalculationTypeChange(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="emi">Calculate EMI</SelectItem>
                    <SelectItem value="loan-amount">Calculate Loan Amount</SelectItem>
                    <SelectItem value="tenure">Calculate Tenure</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {calculationType === 'emi' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="loanAmount">Loan Amount ($)</Label>
                    <Input
                      id="loanAmount"
                      type="number"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(e.target.value)}
                      placeholder="100000"
                    />
                  </div>
                </>
              )}

              {(calculationType === 'loan-amount' || calculationType === 'tenure') && (
                <div className="space-y-2">
                  <Label htmlFor="targetEMI">Target EMI ($)</Label>
                  <Input
                    id="targetEMI"
                    type="number"
                    value={targetEMI}
                    onChange={(e) => setTargetEMI(e.target.value)}
                    placeholder="1000"
                  />
                </div>
              )}

              {calculationType !== 'loan-amount' && (
                <div className="space-y-2">
                  <Label htmlFor="loanAmount">Loan Amount ($)</Label>
                  <Input
                    id="loanAmount"
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    placeholder="100000"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="interestRate">Interest Rate (% per annum)</Label>
                <Input
                  id="interestRate"
                  type="number"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  placeholder="8.5"
                />
              </div>

              {calculationType !== 'tenure' && (
                <div className="space-y-2">
                  <Label htmlFor="loanTenure">Loan Tenure</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="loanTenure"
                      type="number"
                      value={loanTenure}
                      onChange={(e) => setLoanTenure(e.target.value)}
                      placeholder="12"
                      className="flex-1"
                    />
                    <Select 
                      value={tenureType} 
                      onValueChange={(value: 'months' | 'years') => setTenureType(value)}
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="months">Months</SelectItem>
                        <SelectItem value="years">Years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {(calculationType === 'loan-amount' || calculationType === 'tenure') && (
                <Button 
                  onClick={handleCustomCalculation} 
                  className="w-full bg-gradient-to-r from-blue-600 to-green-600"
                  disabled={!targetEMI}
                >
                  Calculate
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="lg:col-span-2">
          {result ? (
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

              {/* Interest vs Principal Breakdown */}
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
                        <span>${(result.totalAmount - result.totalInterest).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                      </div>
                      <Progress value={principalPercentage} className="h-3" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Interest ({interestPercentage.toFixed(1)}%)</span>
                        <span>${result.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                      </div>
                      <Progress value={interestPercentage} className="h-3 bg-red-100" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Breakdown */}
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
                    
                    <TabsContent value="detailed">
                      <div className="max-h-96 overflow-y-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50 sticky top-0">
                            <tr>
                              <th className="p-2 text-left">Month</th>
                              <th className="p-2 text-right">EMI</th>
                              <th className="p-2 text-right">Principal</th>
                              <th className="p-2 text-right">Interest</th>
                              <th className="p-2 text-right">Balance</th>
                            </tr>
                          </thead>
                          <tbody>
                            {result.monthlyBreakdown.map((row) => (
                              <tr key={row.month} className="border-t">
                                <td className="p-2">{row.month}</td>
                                <td className="p-2 text-right">${row.emi.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                                <td className="p-2 text-right">${row.principal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                                <td className="p-2 text-right">${row.interest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                                <td className="p-2 text-right">${row.balance.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Calculator className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {calculationType === 'emi' ? 'Enter loan details to calculate EMI' : 
                   calculationType === 'loan-amount' ? 'Enter EMI to calculate maximum loan amount' :
                   'Enter EMI to calculate required tenure'}
                </h3>
                <p className="text-gray-500">
                  Fill in the form on the left to see detailed calculations and payment schedule
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default EMICalculator;