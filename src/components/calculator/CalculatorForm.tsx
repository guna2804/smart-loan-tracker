import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Calculator } from 'lucide-react';
import type { CalculationType, TenureType } from '../../hooks/useEMICalculator';

interface CalculatorFormProps {
  loanAmount: string;
  interestRate: string;
  loanTenure: string;
  tenureType: TenureType;
  calculationType: CalculationType;
  targetEMI: string;
  onInputChange: (field: string, value: string) => void;
  onTypeChange: (type: CalculationType) => void;
  onCustomCalculate?: () => void;
}

export const CalculatorForm = ({
  loanAmount,
  interestRate,
  loanTenure,
  tenureType,
  calculationType,
  targetEMI,
  onInputChange,
  onTypeChange,
  onCustomCalculate
}: CalculatorFormProps) => {
  return (
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
            onValueChange={onTypeChange}
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
              <Label>Loan Amount ($)</Label>
              <Input
                type="number"
                value={loanAmount}
                onChange={(e) => onInputChange('loanAmount', e.target.value)}
                placeholder="100000"
              />
            </div>
          </>
        )}

        {calculationType !== 'emi' && (
          <div className="space-y-2">
            <Label>Target EMI ($)</Label>
            <Input
              type="number"
              value={targetEMI}
              onChange={(e) => onInputChange('targetEMI', e.target.value)}
              placeholder="1000"
            />
          </div>
        )}

        {calculationType !== 'loan-amount' && (
          <div className="space-y-2">
            <Label>Loan Amount ($)</Label>
            <Input
              type="number"
              value={loanAmount}
              onChange={(e) => onInputChange('loanAmount', e.target.value)}
              placeholder="100000"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label>Interest Rate (% per annum)</Label>
          <Input
            type="number"
            step="0.1"
            value={interestRate}
            onChange={(e) => onInputChange('interestRate', e.target.value)}
            placeholder="8.5"
          />
        </div>

        {calculationType !== 'tenure' && (
          <div className="space-y-2">
            <Label>Loan Tenure</Label>
            <div className="flex space-x-2">
              <Input
                type="number"
                value={loanTenure}
                onChange={(e) => onInputChange('loanTenure', e.target.value)}
                placeholder="12"
                className="flex-1"
              />
              <Select 
                value={tenureType} 
                onValueChange={(value) => onInputChange('tenureType', value)}
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

        {onCustomCalculate && calculationType !== 'emi' && (
          <button 
            onClick={onCustomCalculate}
            className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-2 px-4 rounded-md hover:from-blue-700 hover:to-green-700 disabled:opacity-50"
            disabled={!targetEMI}
          >
            Calculate
          </button>
        )}
      </CardContent>
    </Card>
  );
};