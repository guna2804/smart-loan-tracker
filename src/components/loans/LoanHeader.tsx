import { Button } from "../ui/button";
import { Plus } from "lucide-react";

interface LoanHeaderProps {
  onAddLoan: () => void;
}

export const LoanHeader = ({ onAddLoan }: LoanHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Loan Tracker
        </h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">
          Manage your lending and borrowing activities
        </p>
      </div>
      <Button
        onClick={onAddLoan}
        className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add New Loan
      </Button>
    </div>
  );
};
