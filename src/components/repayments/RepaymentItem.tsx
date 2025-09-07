import { Badge } from "../ui/badge";
import { CheckCircle } from "lucide-react";
import type { Repayment } from "../../types/repayment";

interface RepaymentItemProps {
  repayment: Repayment;
  index: number;
}

const RepaymentItem = ({ repayment, index }: RepaymentItemProps) => {
  return (
    <div key={repayment.id || `repayment-${index}`} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors gap-4 sm:gap-0">
      <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
          <CheckCircle className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">
            Payment of ₹{repayment.amount?.toLocaleString('en-IN') || '0'}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500">
            {new Date(repayment.repaymentDate).toLocaleDateString('en-IN')}
            {repayment.notes && (
              <span className="ml-2">• {repayment.notes}</span>
            )}
          </p>
        </div>
      </div>

      <div className="text-left sm:text-right w-full sm:w-auto">
        <div className="text-xs sm:text-sm text-gray-500">
          Principal: ₹{repayment.principalComponent?.toLocaleString('en-IN') || '0'}
          {(repayment.interestComponent || 0) > 0 && (
            <span className="ml-2">Interest: ₹{repayment.interestComponent?.toLocaleString('en-IN') || '0'}</span>
          )}
        </div>
      </div>

      <div className="text-center w-full sm:w-auto">
        <Badge variant="default">
          Completed
        </Badge>
      </div>
    </div>
  );
};

export default RepaymentItem;