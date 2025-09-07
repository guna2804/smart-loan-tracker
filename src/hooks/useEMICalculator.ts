import { useState, useCallback } from 'react';
import {
  calculateEMI,
  calculateMaxLoanAmount,
  calculateTenure,
  generateCSVData,
  type EMIResult
} from '../utils/calculationUtils';

export type CalculationType = 'emi' | 'loan-amount' | 'tenure';
export type TenureType = 'months' | 'years';
export type InterestType = 'flat' | 'compound';

interface CalculatorInputs {
  loanAmount: string;
  interestRate: string;
  loanTenure: string;
  tenureType: TenureType;
  calculationType: CalculationType;
  targetEMI: string;
  interestType: InterestType;
}

export const useEMICalculator = () => {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    loanAmount: '100000',
    interestRate: '8.5',
    loanTenure: '12',
    tenureType: 'months',
    calculationType: 'emi',
    targetEMI: '',
    interestType: 'compound'
  });
  
  const [result, setResult] = useState<EMIResult|null>(null);

  const updateInputs = useCallback((newInputs: Partial<CalculatorInputs>) => {
    setInputs(prev => ({ ...prev, ...newInputs }));
    setResult(null);
  }, []);

  const calculate = useCallback(() => {
    try {
      const principal = parseFloat(inputs.loanAmount) || 0;
      const rate = parseFloat(inputs.interestRate) || 0;
      const tenure = inputs.tenureType === 'years'
        ? (parseFloat(inputs.loanTenure) || 0) * 12
        : parseFloat(inputs.loanTenure) || 0;

      if (principal > 0 && rate >= 0 && tenure > 0) {
        if (inputs.calculationType === 'emi') {
          setResult(calculateEMI(principal, rate, tenure, inputs.interestType));
        }
        else if (inputs.calculationType === 'loan-amount' && inputs.targetEMI) {
          const emi = parseFloat(inputs.targetEMI);
          const maxLoan = calculateMaxLoanAmount(emi, rate, tenure, inputs.interestType);
          updateInputs({ loanAmount: maxLoan.toFixed(0) });
          setResult(calculateEMI(maxLoan, rate, tenure, inputs.interestType));
        }
        else if (inputs.calculationType === 'tenure' && inputs.targetEMI) {
          const emi = parseFloat(inputs.targetEMI);
          const requiredTenure = calculateTenure(principal, emi, rate, inputs.interestType);
          updateInputs({ loanTenure: Math.ceil(requiredTenure).toString() });
          setResult(calculateEMI(principal, rate, Math.ceil(requiredTenure), inputs.interestType));
        }
      }
    } catch (error) {
      console.error('EMI calculation error:', error);
      // Could add toast notification here if needed
      setResult(null);
    }
  }, [inputs, updateInputs]);

  const resetCalculator = useCallback(() => {
    updateInputs({
      loanAmount: '100000',
      interestRate: '8.5',
      loanTenure: '12',
      tenureType: 'months',
      calculationType: 'emi',
      targetEMI: '',
      interestType: 'compound'
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

  // Note: EMI calculation is now manual via button click for better UX

  return { 
    inputs,
    result,
    updateInputs,
    calculate,
    resetCalculator,
    exportData
  };
};