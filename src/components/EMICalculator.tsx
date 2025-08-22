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
        <CalculatorForm
          {...inputs}
          onInputChange={(field, value) => updateInputs({ [field]: value })}
          onTypeChange={(type) => updateInputs({ calculationType: type })}
          onCustomCalculate={inputs.calculationType !== 'emi' ? calculate : undefined}
        />
        {result && (
          <div className="lg:col-span-2">
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