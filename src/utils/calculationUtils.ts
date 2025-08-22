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
  tenure: number
): EMIResult => {
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

  const monthlyBreakdown: EMIBreakdown[] = [];
  let remainingBalance = principal;

  for (let i = 1; i <= numPayments; i++) {
    const interestComponent = remainingBalance * monthlyRate;
    const principalComponent = emi - interestComponent;
    remainingBalance -= principalComponent;

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
    totalAmount,
    totalInterest,
    monthlyBreakdown
  };
};

export const calculateMaxLoanAmount = (
  emi: number,
  rate: number,
  tenure: number
): number => {
  const monthlyRate = rate / (12 * 100);
  if (monthlyRate === 0) return emi * tenure;
  
  return (emi * (Math.pow(1 + monthlyRate, tenure) - 1)) / 
         (monthlyRate * Math.pow(1 + monthlyRate, tenure));
};

export const calculateTenure = (
  principal: number,
  emi: number,
  rate: number
): number => {
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