import { useEMICalculator } from '../hooks/useEMICalculator';
import { CalculatorForm } from './calculator/CalculatorForm';
import { ResultsDisplay } from './calculator/ResultsDisplay';
import { Button } from './ui/button';
import { Download, RefreshCw } from 'lucide-react';

export const EMICalculator = () => {
  const {
    inputs,
    result,
    updateInputs,
    calculate,
    resetCalculator,
    exportData
  } = useEMICalculator();

  return (
  <div className="p-4 sm:p-6 md:p-8 space-y-8 max-w-full">
      {/* Header */}
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">EMI Calculator</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Calculate loan EMIs and payment schedules</p>
        </div>
  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
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

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <CalculatorForm
          {...inputs}
          onInputChange={(field, value) => updateInputs({ [field]: value })}
          onTypeChange={(type) => updateInputs({ calculationType: type })}
          onCustomCalculate={inputs.calculationType !== 'emi' ? calculate : undefined}
        />
        {result && (
          <div className="md:col-span-2 lg:col-span-2">
            <ResultsDisplay
              result={result}
              loanAmount={inputs.loanAmount}
              interestRate={inputs.interestRate} 
              loanTenure={inputs.loanTenure}
              tenureType={inputs.tenureType}
              onExport={exportData}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EMICalculator;