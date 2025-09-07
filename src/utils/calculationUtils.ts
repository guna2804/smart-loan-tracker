interface EMIBreakdown {
  month: number;
  emi: number;
  principal: number;
  interest: number;
  balance: number;
}

export interface EMIResult {
  emi: number;
  totalAmount: number;
  totalInterest: number;
  monthlyBreakdown: EMIBreakdown[];
}

export const calculateEMI = (
  principal: number,
  rate: number,
  tenure: number,
  interestType: 'flat' | 'compound' = 'compound'
): EMIResult => {
  // Input validation and edge case handling
  if (principal <= 0 || tenure <= 0) {
    throw new Error('Principal and tenure must be positive numbers');
  }
  if (rate < 0) {
    throw new Error('Interest rate cannot be negative');
  }
  if (tenure > 360) { // Max 30 years
    throw new Error('Tenure cannot exceed 360 months (30 years)');
  }

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

  let emi: number;
  let totalAmountResult: number;
  let totalInterestResult: number;

  if (interestType === 'flat') {
    // Flat interest: Simple interest calculation
    const totalInterestFlat = principal * (rate / 100) * (tenure / 12);
    totalAmountResult = principal + totalInterestFlat;
    emi = totalAmountResult / numPayments;
    totalInterestResult = totalInterestFlat;
  } else {
    // Compound interest: Standard EMI formula
    emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
              (Math.pow(1 + monthlyRate, numPayments) - 1);
    totalAmountResult = emi * numPayments;
    totalInterestResult = totalAmountResult - principal;
  }

  const monthlyBreakdown: EMIBreakdown[] = [];
  let remainingBalance = principal;

  for (let i = 1; i <= numPayments; i++) {
    const interestComponent = remainingBalance * monthlyRate;
    const principalComponent = emi - interestComponent;
    remainingBalance -= principalComponent;

    // Handle precision issues in the last payment
    if (i === numPayments && Math.abs(remainingBalance) < 0.01) {
      remainingBalance = 0;
    }

    monthlyBreakdown.push({
      month: i,
      emi,
      principal: principalComponent,
      interest: interestComponent,
      balance: Math.max(0, remainingBalance)
    });
  }

  return {
    emi,
    totalAmount: totalAmountResult,
    totalInterest: totalInterestResult,
    monthlyBreakdown
  };
};

export const calculateMaxLoanAmount = (
  emi: number,
  rate: number,
  tenure: number,
  interestType: 'flat' | 'compound' = 'compound'
): number => {
  if (interestType === 'flat') {
    // For flat interest, max loan = EMI * tenure (since total amount = EMI * tenure)
    return emi * tenure;
  }

  const monthlyRate = rate / (12 * 100);
  if (monthlyRate === 0) return emi * tenure;

  return (emi * (Math.pow(1 + monthlyRate, tenure) - 1)) /
         (monthlyRate * Math.pow(1 + monthlyRate, tenure));
};

export const calculateTenure = (
  principal: number,
  emi: number,
  rate: number,
  interestType: 'flat' | 'compound' = 'compound'
): number => {
  if (interestType === 'flat') {
    // For flat interest, tenure = total amount / EMI
    // Total amount = principal + (principal * rate * tenure/12)
    // This is more complex to solve algebraically, so we'll use approximation
    const monthlyRate = rate / (12 * 100);
    if (monthlyRate === 0) return principal / emi;

    // Approximate solution for flat interest tenure calculation
    // This is an iterative approach to find the tenure
    let tenure = 1;
    let totalAmount = 0;

    while (totalAmount < principal && tenure < 360) {
      totalAmount = principal + (principal * rate * tenure / (12 * 100));
      if (totalAmount / tenure <= emi) break;
      tenure++;
    }

    return tenure;
  }

  const monthlyRate = rate / (12 * 100);
  if (monthlyRate === 0) return principal / emi;

  return Math.log(1 + (principal * monthlyRate) / emi) / Math.log(1 + monthlyRate);
};

export const generateCSVData = (breakdown: EMIBreakdown[]): string => {
  const csvData = [
    ['Month', 'EMI', 'Principal', 'Interest', 'Balance'],
    ...breakdown.map(row => [
      row.month,
      row.emi.toFixed(2),
      row.principal.toFixed(2),
      row.interest.toFixed(2),
      row.balance.toFixed(2)
    ])
  ];
  return csvData.map(row => row.join(',')).join('\n');
};