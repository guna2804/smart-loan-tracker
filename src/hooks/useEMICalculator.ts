import { useState, useEffect, useCallback } from 'react';
import {
  calculateEMI,
  calculateMaxLoanAmount,
  calculateTenure,
  generateCSVData,
  type EMIResult
} from '../utils/calculationUtils';

export type CalculationType = 'emi' | 'loan-amount' | 'tenure';
export type TenureType = 'months' | 'years';

interface CalculatorInputs {
  loanAmount: string;
  interestRate: string;
  loanTenure: string;
  tenureType: TenureType;
  calculationType: CalculationType;
  targetEMI: string;
}

export const useEMICalculator = () => {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    loanAmount: '100000',
    interestRate: '8.5',
    loanTenure: '12',
    tenureType: 'months',
    calculationType: 'emi',
    targetEMI: ''
  });
  
  const [result, setResult] = useState<EMIResult|null>(null);

  const updateInputs = useCallback((newInputs: Partial<CalculatorInputs>) => {
    setInputs(prev => ({ ...prev, ...newInputs }));
    setResult(null);
  }, []);

  const calculate = useCallback(() => {
    const principal = parseFloat(inputs.loanAmount) || 0;
    const rate = parseFloat(inputs.interestRate) || 0;
    const tenure = inputs.tenureType === 'years' 
      ? (parseFloat(inputs.loanTenure) || 0) * 12 
      : parseFloat(inputs.loanTenure) || 0;

    if (principal > 0 && rate >= 0 && tenure > 0) {
      if (inputs.calculationType === 'emi') {
        setResult(calculateEMI(principal, rate, tenure));
      }
      else if (inputs.calculationType === 'loan-amount' && inputs.targetEMI) {
        const emi = parseFloat(inputs.targetEMI);
        const maxLoan = calculateMaxLoanAmount(emi, rate, tenure);
        updateInputs({ loanAmount: maxLoan.toFixed(0) });
        setResult(calculateEMI(maxLoan, rate, tenure));
      }
      else if (inputs.calculationType === 'tenure' && inputs.targetEMI) {
        const emi = parseFloat(inputs.targetEMI);
        const requiredTenure = calculateTenure(principal, emi, rate);
        updateInputs({ loanTenure: Math.ceil(requiredTenure).toString() });
        setResult(calculateEMI(principal, rate, Math.ceil(requiredTenure)));
      }
    }
  }, [inputs, updateInputs]);

  const resetCalculator = useCallback(() => {
    updateInputs({
      loanAmount: '100000',
      interestRate: '8.5',
      loanTenure: '12',
      tenureType: 'months',
      calculationType: 'emi',
      targetEMI: ''
    });
    setResult(null);
  }, [updateInputs]);

  const exportData = useCallback(() => {
    if (!result) return;
    
    const csv = generateCSVData(result.monthlyBreakdown);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'emi-breakdown.csv';
    a.click();
  }, [result]);

  // Auto-calculate when inputs change for EMI mode
  useEffect(() => {
    if (inputs.calculationType === 'emi') {
      calculate();
    }
  }, [
    inputs.loanAmount,
    inputs.interestRate, 
    inputs.loanTenure,
    inputs.tenureType,
    inputs.calculationType,
    calculate
  ]);

  return { 
    inputs,
    result,
    updateInputs,
    calculate,
    resetCalculator,
    exportData
  };
};