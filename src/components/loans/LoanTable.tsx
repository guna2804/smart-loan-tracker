import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Edit, Trash2, Eye } from "lucide-react";
import { InterestType } from "../../services/loanService";
import { getCurrencySymbol } from "../../utils/loanUtils";
import type { Loan } from "../../types/loan";

interface LoanTableProps {
  loans: Loan[];
  onEdit: (loan: Loan) => void;
  onDelete: (id: string) => void;
  onViewDetails: (loan: Loan) => void;
}

export const LoanTable = ({ loans, onEdit, onDelete, onViewDetails }: LoanTableProps) => {
  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0:
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case 1:
        return <Badge variant="destructive">Overdue</Badge>;
      case 2:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Completed</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    return role === "Lender" ? (
      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Lending</Badge>
    ) : (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Borrowing</Badge>
    );
  };

  const getOutstandingBalance = (loan: Loan) => {
    // Use the API-provided outstandingBalance if available, otherwise calculate
    return loan.outstandingBalance ?? (loan.totalAmount - (loan.totalPrincipalRepaid || 0));
  };

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Counterparty Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Principal</TableHead>
            <TableHead>Outstanding Balance</TableHead>
            <TableHead>Interest Rate & Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Next Due Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loans.map((loan) => (
            <TableRow key={loan.id}>
              <TableCell className="font-medium">{loan.counterpartyName}</TableCell>
              <TableCell>{getRoleBadge(loan.role)}</TableCell>
              <TableCell>
                {getCurrencySymbol(loan.currency)}{loan.principal.toLocaleString()}
              </TableCell>
              <TableCell>
                {getCurrencySymbol(loan.currency)}{getOutstandingBalance(loan).toLocaleString()}
              </TableCell>
              <TableCell>
                {loan.interestRate}% {loan.interestType === InterestType.Compound ? "Compound" : "Flat"}
              </TableCell>
              <TableCell>{getStatusBadge(loan.status)}</TableCell>
              <TableCell>
                {loan.nextDueDate ? new Date(loan.nextDueDate).toLocaleDateString() : "N/A"}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDetails(loan)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};