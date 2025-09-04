import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Edit, Trash2, User } from "lucide-react";
import { InterestType } from "../../services/loanService";
import { getCurrencySymbol } from "../../utils/loanUtils";
import type { Loan } from "../../types/loan";

interface LoanCardProps {
  loan: Loan;
  onEdit: (loan: Loan) => void;
  onDelete: (id: string) => void;
  isLast?: boolean;
}

export const LoanCard = ({
  loan,
  onEdit,
  onDelete,
  isLast = false
}: LoanCardProps) => {
  return (
    <div
      className={`p-4 ${
        !isLast ? "border-b border-gray-200" : ""
      } hover:bg-gray-50 transition`}
    >
      {/* Desktop Layout - Horizontal (md and up) */}
      <div className="hidden md:flex items-center justify-between">
        {/* Counterparty */}
        <div className="flex items-center space-x-4">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              loan.role === "Lender"
                ? "bg-green-100 text-green-600"
                : "bg-blue-100 text-blue-600"
            }`}
          >
            <User className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {loan.counterpartyName}
            </h3>
            <p className="text-sm text-gray-500">
              {loan.role}
            </p>
          </div>
        </div>

        {/* Amount */}
        <div className="text-right">
          <div className="flex items-center justify-end space-x-2">
            Principal:
            <span className="font-bold text-lg">
              {getCurrencySymbol(loan.currency)}{(loan.principal || 0).toLocaleString()}
            </span>
          </div>
          <div className="text-sm text-gray-500">
            Total: {getCurrencySymbol(loan.currency)}{(loan.totalAmount || 0).toLocaleString()}
          </div>
        </div>

        {/* Status */}
        <div className="text-center">
          <Badge
            variant={loan.status === 1 ? "destructive" : "default"}
            className="capitalize"
          >
            {loan.status === 0 ? "active" : loan.status === 1 ? "overdue" : "completed"}
          </Badge>
          <div className="text-xs text-gray-500 mt-1">
            {(loan.interestRate || 0)}% {loan.interestType === InterestType.Compound ? "compound" : "flat"}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(loan)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(loan.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Mobile Layout - Stacked (below md) */}
      <div className="md:hidden space-y-3">
        {/* Top Row: Counterparty Info and Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                loan.role === "Lender"
                  ? "bg-green-100 text-green-600"
                  : "bg-blue-100 text-blue-600"
              }`}
            >
              <User className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 text-sm truncate">
                {loan.counterpartyName}
              </h3>
              <p className="text-xs text-gray-500">
                {loan.role}
              </p>
            </div>
          </div>

          <Badge
            variant={loan.status === 1 ? "destructive" : "default"}
            className="capitalize text-xs"
          >
            {loan.status === 0 ? "active" : loan.status === 1 ? "overdue" : "completed"}
          </Badge>
        </div>

        {/* Middle Row: Amount Details */}
        <div className="bg-gray-50 rounded-lg p-3 space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              Principal:
            </span>
            <span className="font-bold text-lg text-gray-900">
              {getCurrencySymbol(loan.currency)}{(loan.principal || 0).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total:</span>
            <span className="font-semibold text-gray-700">
              {getCurrencySymbol(loan.currency)}{(loan.totalAmount || 0).toLocaleString()}
            </span>
          </div>
          <div className="text-center pt-1">
            <span className="text-xs text-gray-500">
              {(loan.interestRate || 0)}% {loan.interestType === InterestType.Compound ? "compound" : "flat"}
            </span>
          </div>
        </div>

        {/* Bottom Row: Actions */}
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(loan)}
            className="flex items-center space-x-1 px-3 py-2"
          >
            <Edit className="w-4 h-4" />
            <span className="text-xs">Edit</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(loan.id)}
            className="text-red-600 hover:text-red-700 flex items-center space-x-1 px-3 py-2"
          >
            <Trash2 className="w-4 h-4" />
            <span className="text-xs">Delete</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
