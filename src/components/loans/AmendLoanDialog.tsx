import { useState, useEffect } from "react";
import { loanService, InterestType } from "../../services/loanService";
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

interface AmendLoanFormData {
  interestRate: string;
  interestType: InterestType;
}

interface AmendLoanDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  loan: Loan;
  onSuccess: () => void;
}

export const AmendLoanDialog = ({
  isOpen,
  onOpenChange,
  loan,
  onSuccess
}: AmendLoanDialogProps) => {
  const [formData, setFormData] = useState<AmendLoanFormData>({
    interestRate: "",
    interestType: InterestType.Flat,
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen && loan) {
      setFormData({
        interestRate: loan.interestRate.toString(),
        interestType: loan.interestType,
      });
    }
  }, [isOpen, loan]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      counterpartyName: loan.counterpartyName,
      role: loan.role,
      principal: loan.principal,
      interestRate: parseFloat(formData.interestRate),
      interestType: formData.interestType,
      startDate: loan.startDate,
      endDate: loan.endDate,
      repaymentFrequency: loan.repaymentFrequency,
      allowOverpayment: loan.allowOverpayment,
      currency: loan.currency,
      notes: loan.notes,
    };

    try {
      await loanService.amendLoan(loan.id, payload);
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error amending loan:', error);
      // TODO: Add proper error handling
    }
  };

  const resetForm = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md">
        <DialogHeader>
          <DialogTitle>Amend Loan Interest</DialogTitle>
          <DialogDescription>
            Update the interest rate and type for this loan. Compound interest will use monthly compounding. This change will be recorded as an amendment.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="interestRate">New Interest Rate (%)</Label>
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="interestType">Interest Type</Label>
            <Select
              value={formData.interestType === InterestType.Compound ? "compound" : "flat"}
              onValueChange={(value: "flat" | "compound") =>
                setFormData({ ...formData, interestType: value === "compound" ? InterestType.Compound : InterestType.Flat })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flat">Flat Interest</SelectItem>
                <SelectItem value="compound">Compound Interest</SelectItem>
              </SelectContent>
            </Select>
          </div>



          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600">
              Amend Loan
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
