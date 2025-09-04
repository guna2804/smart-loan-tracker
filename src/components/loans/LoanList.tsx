import { LoanCard } from "./LoanCard";
import type { Loan } from "../../types/loan";

interface LoanListProps {
  loans: Loan[];
  onEdit: (loan: Loan) => void;
  onDelete: (id: string) => void;
}

export const LoanList = ({ loans, onEdit, onDelete }: LoanListProps) => {
  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      {loans.map((loan, idx) => (
        <LoanCard
          key={loan.id}
          loan={loan}
          onEdit={onEdit}
          onDelete={onDelete}
          isLast={idx === loans.length - 1}
        />
      ))}
    </div>
  );
};
