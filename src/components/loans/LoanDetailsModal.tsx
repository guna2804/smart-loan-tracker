import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { InterestType } from "../../services/loanService";
import { getCurrencySymbol } from "../../utils/loanUtils";
import { useNavigate } from "react-router-dom";
import type { Loan } from "../../types/loan";
import type { Repayment } from "../../types/repayment";
import { useState, useEffect } from "react";
import { repaymentService } from "../../services/repaymentService";

interface LoanDetailsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  loan: Loan | null;
}

export const LoanDetailsModal = ({ isOpen, onOpenChange, loan }: LoanDetailsModalProps) => {
  const navigate = useNavigate();
  const [repayments, setRepayments] = useState<Repayment[]>([]);
  const [loadingRepayments, setLoadingRepayments] = useState(false);

  useEffect(() => {
    if (isOpen && loan) {
      fetchRepayments();
    }
  }, [isOpen, loan]);

  const fetchRepayments = async () => {
    if (!loan) return;

    setLoadingRepayments(true);
    try {
      const response = await repaymentService.getRepaymentsSilent(loan.id, { page: 1, pageSize: 50 });
      setRepayments(response.repayments);
    } catch (error) {
      console.error('Failed to fetch repayments:', error);
      setRepayments([]);
    } finally {
      setLoadingRepayments(false);
    }
  };

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

  const handleViewInRepaymentLog = () => {
    if (loan) {
      // Navigate to repayment log with loan filter
      navigate(`/repayments?loanId=${loan.id}`);
    }
  };

  if (!loan) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Loan Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Loan Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Loan Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Counterparty</label>
                  <p className="text-lg font-semibold">{loan.counterpartyName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Role</label>
                  <div className="mt-1">{getRoleBadge(loan.role)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Principal Amount</label>
                  <p className="text-lg font-semibold">
                    {getCurrencySymbol(loan.currency)}{loan.principal.toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Outstanding Balance</label>
                  <p className="text-lg font-semibold">
                    {getCurrencySymbol(loan.currency)}{getOutstandingBalance(loan).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Interest Rate & Type</label>
                  <p className="text-lg font-semibold">
                    {loan.interestRate}% {loan.interestType === InterestType.Compound ? "Compound" : "Flat"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="mt-1">{getStatusBadge(loan.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Start Date</label>
                  <p className="text-lg font-semibold">
                    {new Date(loan.startDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">End Date</label>
                  <p className="text-lg font-semibold">
                    {loan.endDate ? new Date(loan.endDate).toLocaleDateString() : "N/A"}
                  </p>
                </div>
              </div>
              {loan.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Notes</label>
                  <p className="text-sm mt-1">{loan.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Repayment History */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Repayment History</CardTitle>
              <Button onClick={handleViewInRepaymentLog} variant="outline">
                View in Repayment Log
              </Button>
            </CardHeader>
            <CardContent>
              {loadingRepayments ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex space-x-4">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 flex-1" />
                    </div>
                  ))}
                </div>
              ) : repayments.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No repayments found for this loan.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Principal</TableHead>
                      <TableHead>Interest</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {repayments.map((repayment) => (
                      <TableRow key={repayment.id}>
                        <TableCell>
                          {new Date(repayment.repaymentDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {getCurrencySymbol(loan.currency)}{repayment.principalComponent.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {getCurrencySymbol(loan.currency)}{repayment.interestComponent.toLocaleString()}
                        </TableCell>
                        <TableCell className="font-semibold">
                          {getCurrencySymbol(loan.currency)}{repayment.amount.toLocaleString()}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {repayment.notes || "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};