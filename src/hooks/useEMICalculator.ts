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
  const [error, setError] = useState<string>('');

  const updateInputs = useCallback((newInputs: Partial<CalculatorInputs>) => {
    setInputs(prev => ({ ...prev, ...newInputs }));
    setResult(null);
    setError('');
  }, []);

  const calculate = useCallback(() => {
    try {
      const principal = parseFloat(inputs.loanAmount);
      const rate = parseFloat(inputs.interestRate);
      const tenure = inputs.tenureType === 'years'
        ? (parseFloat(inputs.loanTenure) || 0) * 12
        : parseFloat(inputs.loanTenure) || 0;
      const targetEMI = parseFloat(inputs.targetEMI);

      // Validation checks
      if (isNaN(principal) || principal <= 0) {
        setError('Please enter a valid loan amount greater than 0.');
        setResult(null);
        return;
      }

      if (isNaN(rate) || rate < 0 || rate > 50) {
        setError('Please enter a valid interest rate between 0% and 50%.');
        setResult(null);
        return;
      }

      if (isNaN(tenure) || tenure <= 0 || tenure > 360) {
        setError('Please enter a valid tenure between 1 and 360 months.');
        setResult(null);
        return;
      }

      if (inputs.calculationType !== 'emi' && (isNaN(targetEMI) || targetEMI <= 0)) {
        setError('Please enter a valid target EMI amount greater than 0.');
        setResult(null);
        return;
      }

      // Clear any previous errors
      setError('');

      if (inputs.calculationType === 'emi') {
        setResult(calculateEMI(principal, rate, tenure, inputs.interestType));
      }
      else if (inputs.calculationType === 'loan-amount' && inputs.targetEMI) {
        const emi = targetEMI;
        const maxLoan = calculateMaxLoanAmount(emi, rate, tenure, inputs.interestType);
        updateInputs({ loanAmount: maxLoan.toFixed(0) });
        setResult(calculateEMI(maxLoan, rate, tenure, inputs.interestType));
      }
      else if (inputs.calculationType === 'tenure' && inputs.targetEMI) {
        const emi = targetEMI;
        const requiredTenure = calculateTenure(principal, emi, rate, inputs.interestType);
        if (requiredTenure <= 0 || requiredTenure > 360) {
          setError('Unable to calculate tenure with the given parameters. Please adjust your inputs.');
          setResult(null);
          return;
        }
        updateInputs({ loanTenure: Math.ceil(requiredTenure).toString() });
        setResult(calculateEMI(principal, rate, Math.ceil(requiredTenure), inputs.interestType));
      }
    } catch (error) {
      console.error('EMI calculation error:', error);
      setError('An error occurred during calculation. Please check your inputs and try again.');
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
    setError('');
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
    error,
    updateInputs,
    calculate,
    resetCalculator,
    exportData
  };
};