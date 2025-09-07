import { Card, CardContent } from "../ui/card";
import { IndianRupee } from "lucide-react";

interface RepaymentSummaryProps {
  summaryData: { totalPayments: number; totalInterest: number; totalPrincipal: number } | null;
  loading: boolean;
  filterType: 'all' | 'lending' | 'borrowing';
}

const RepaymentSummary = ({
  summaryData,
  filterType
}: RepaymentSummaryProps) => {
  const totalRepayments = summaryData?.totalPayments || 0;
  const totalInterest = summaryData?.totalInterest || 0;
  const totalPrincipal = summaryData?.totalPrincipal || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
            <div>
              <p className="text-sm text-green-800">Total Payments</p>
              <p className="text-2xl font-bold text-green-900">₹{totalRepayments?.toLocaleString('en-IN') || '0'}</p>
              {filterType === 'all' && (
                <p className="text-xs text-green-600 mt-1">All transactions</p>
              )}
            </div>
            <IndianRupee className="w-8 h-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
            <div>
              <p className="text-sm text-blue-800">Total Interest</p>
              <p className="text-2xl font-bold text-blue-900">₹{totalInterest?.toLocaleString('en-IN') || '0'}</p>
              {filterType === 'all' && (
                <p className="text-xs text-blue-600 mt-1">All transactions</p>
              )}
            </div>
            <IndianRupee className="w-8 h-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
            <div>
              <p className="text-sm text-purple-800">Total Principal</p>
              <p className="text-2xl font-bold text-purple-900">₹{totalPrincipal?.toLocaleString('en-IN') || '0'}</p>
              {filterType === 'all' && (
                <p className="text-xs text-purple-600 mt-1">All transactions</p>
              )}
            </div>
            <IndianRupee className="w-8 h-8 text-purple-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RepaymentSummary;