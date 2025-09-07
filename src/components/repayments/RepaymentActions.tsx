import { Button } from "../ui/button";
import { Download, Plus } from "lucide-react";
import type { OutstandingLoan } from "../../types/loan";

interface RepaymentActionsProps {
  selectedLoan: OutstandingLoan | null;
  onAddPayment: () => void;
}

const RepaymentActions = ({ selectedLoan, onAddPayment }: RepaymentActionsProps) => {
  return (
    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
      <Button variant="outline" className="flex items-center">
        <Download className="w-4 h-4 mr-2" />
        Export
      </Button>
      <Button onClick={onAddPayment} className="bg-gradient-to-r from-blue-600 to-green-600">
        <Plus className="w-4 h-4 mr-2" />
        Record New Payment
      </Button>
    </div>
  );
};

export default RepaymentActions;