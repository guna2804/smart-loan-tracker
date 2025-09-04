import { useState, useEffect } from "react";
import { loanService, InterestType, RepaymentFrequencyType, CurrencyType } from "../../services/loanService";
import type { Loan } from "../../types/loan";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Switch } from "../ui/switch";
import { AmendLoanDialog } from "./AmendLoanDialog";

interface LoanFormData {
  borrowerName: string;
  lenderName: string;
  amount: string;
  interestRate: string;
  interestType: InterestType;
  startDate: string;
  dueDate: string;
  type: "lending" | "borrowing";
  repaymentFrequency: RepaymentFrequencyType;
  allowOverpayment: boolean;
  currency: CurrencyType;
  notes: string;
}

interface LoanFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingLoan: Loan | null;
  onSuccess: () => void;
}

export const LoanFormDialog = ({
  isOpen,
  onOpenChange,
  editingLoan,
  onSuccess
}: LoanFormDialogProps) => {
  const [formData, setFormData] = useState<LoanFormData>({
    borrowerName: "",
    lenderName: "",
    amount: "",
    interestRate: "",
    interestType: InterestType.Flat,
    startDate: "",
    dueDate: "",
    type: "lending",
    repaymentFrequency: RepaymentFrequencyType.Monthly,
    allowOverpayment: false,
    currency: CurrencyType.INR,
    notes: "",
  });

  const [isAmendDialogOpen, setIsAmendDialogOpen] = useState(false);

  // Reset form when dialog opens/closes or editing loan changes
  useEffect(() => {
    if (isOpen) {
      if (editingLoan) {
        // Format dates to yyyy-MM-dd for input type="date"
        const formatDate = (dateStr?: string) => {
          if (!dateStr) return "";
          const d = new Date(dateStr);
          if (isNaN(d.getTime())) return "";
          return d.toISOString().slice(0, 10);
        };

        setFormData({
          borrowerName: editingLoan.role === "Lender" ? editingLoan.counterpartyName : "",
          lenderName: editingLoan.role === "Borrower" ? editingLoan.counterpartyName : "",
          amount: editingLoan.principal.toString(),
          interestRate: editingLoan.interestRate.toString(),
          interestType: editingLoan.interestType,
          startDate: formatDate(editingLoan.startDate),
          dueDate: formatDate(editingLoan.endDate),
          type: editingLoan.role === "Lender" ? "lending" : "borrowing",
          repaymentFrequency: editingLoan.repaymentFrequency ?? RepaymentFrequencyType.Monthly,
          allowOverpayment: editingLoan.allowOverpayment,
          currency: editingLoan.currency,
          notes: editingLoan.notes || "",
        });
      } else {
        // Reset to default values for new loan
        setFormData({
          borrowerName: "",
          lenderName: "",
          amount: "",
          interestRate: "",
          interestType: InterestType.Flat,
          startDate: "",
          dueDate: "",
          type: "lending",
          repaymentFrequency: RepaymentFrequencyType.Monthly,
          allowOverpayment: false,
          currency: CurrencyType.INR,
          notes: "",
        });
      }
    }
  }, [isOpen, editingLoan]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      counterpartyName: formData.type === "lending" ? formData.borrowerName : formData.lenderName,
      role: formData.type === "lending" ? "Lender" : "Borrower",
      principal: parseFloat(formData.amount),
      interestRate: parseFloat(formData.interestRate),
      interestType: formData.interestType,
      startDate: formData.startDate,
      endDate: formData.dueDate,
      repaymentFrequency: formData.repaymentFrequency,
      allowOverpayment: formData.allowOverpayment,
      currency: formData.currency,
      notes: formData.notes,
    };

    try {
      if (editingLoan) {
        await loanService.updateLoan(editingLoan.id, payload);
      } else {
        await loanService.createLoan(payload);
      }
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving loan:', error);
      // TODO: Add proper error handling
    }
  };

  const resetForm = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>
            {editingLoan ? "Edit Loan" : "Add New Loan"}
          </DialogTitle>
          <DialogDescription>
            {editingLoan ? "Update the loan details below." : "Fill in the details to add a new loan to your tracker."}
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-6 py-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Loan Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: "lending" | "borrowing") =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lending">I am Lending</SelectItem>
                    <SelectItem value="borrowing">I am Borrowing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount ($)</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Input
                        id="amount"
                        type="number"
                        value={formData.amount}
                        onChange={(e) =>
                          setFormData({ ...formData, amount: e.target.value })
                        }
                        disabled={editingLoan?.hasRepaymentStarted}
                        required
                      />
                    </TooltipTrigger>
                    {editingLoan?.hasRepaymentStarted && (
                      <TooltipContent>
                        <p>Locked after first repayment</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            {/* Party Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="personName">
                  {formData.type === "lending"
                    ? "Borrower Name"
                    : "Lender Name"}
                </Label>
                <Input
                  id="personName"
                  value={
                    formData.type === "lending"
                      ? formData.borrowerName
                      : formData.lenderName
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [formData.type === "lending"
                        ? "borrowerName"
                        : "lenderName"]: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                {editingLoan?.hasRepaymentStarted ? (
                  <>
                    <Label>Interest Rate</Label>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">
                        {formData.interestRate}% {formData.interestType === InterestType.Compound ? "compound" : "flat"}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setIsAmendDialogOpen(true)}
                      >
                        Amend Loan
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <Label htmlFor="interestRate">Interest Rate (%)</Label>
                    <Input
                      id="interestRate"
                      type="number"
                      step="0.1"
                      value={formData.interestRate}
                      onChange={(e) =>
                        setFormData({ ...formData, interestRate: e.target.value })
                      }
                      required
                    />
                  </>
                )}
              </div>
            </div>

            {/* Loan Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="interestType">Interest Type</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Select
                        value={formData.interestType === InterestType.Compound ? "compound" : "flat"}
                        onValueChange={(value: "flat" | "compound") =>
                          setFormData({ ...formData, interestType: value === "compound" ? InterestType.Compound : InterestType.Flat })
                        }
                        disabled={editingLoan?.hasRepaymentStarted}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="flat">Flat Interest</SelectItem>
                          <SelectItem value="compound">
                            Compound Interest
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TooltipTrigger>
                    {editingLoan?.hasRepaymentStarted && (
                      <TooltipContent>
                        <p>Use Amend Loan to change interest type</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="space-y-2">
                <Label htmlFor="repaymentFrequency">Repayment Frequency</Label>
                <Select
                  value={(formData.repaymentFrequency ?? RepaymentFrequencyType.Monthly).toString()}
                  onValueChange={(value: string) =>
                    setFormData({ ...formData, repaymentFrequency: parseInt(value) as RepaymentFrequencyType })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={RepaymentFrequencyType.Monthly.toString()}>Monthly</SelectItem>
                    <SelectItem value={RepaymentFrequencyType.Quarterly.toString()}>Quarterly</SelectItem>
                    <SelectItem value={RepaymentFrequencyType.Yearly.toString()}>Yearly</SelectItem>
                    <SelectItem value={RepaymentFrequencyType.LumpSum.toString()}>Lump Sum</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) =>
                          setFormData({ ...formData, startDate: e.target.value })
                        }
                        disabled={editingLoan?.hasRepaymentStarted}
                        required
                      />
                    </TooltipTrigger>
                    {editingLoan?.hasRepaymentStarted && (
                      <TooltipContent>
                        <p>Locked after first repayment</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            {/* Dates and Settings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) =>
                    setFormData({ ...formData, dueDate: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="allowOverpayment" className="text-sm font-medium">Allow Overpayment</Label>
                <div className="flex items-center space-x-3 pt-2">
                  <Switch
                    id="allowOverpayment"
                    checked={formData.allowOverpayment}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, allowOverpayment: checked })
                    }
                  />
                  <span className="text-sm text-gray-600">
                    {formData.allowOverpayment ? "Enabled" : "Disabled"}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Add any additional notes about this loan..."
                rows={3}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
              >
                {editingLoan ? "Update Loan" : "Add Loan"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>

      {editingLoan && (
        <AmendLoanDialog
          isOpen={isAmendDialogOpen}
          onOpenChange={setIsAmendDialogOpen}
          loan={editingLoan}
          onSuccess={() => {
            onSuccess();
            setIsAmendDialogOpen(false);
          }}
        />
      )}
    </Dialog>
  );
};
