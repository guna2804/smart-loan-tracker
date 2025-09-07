import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import type { OutstandingLoan } from "../../types/loan";

interface RepaymentFormProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  formData: {
    loanId: string;
    amount: string;
    notes: string;
  };
  setFormData: (data: { loanId: string; amount: string; notes: string }) => void;
  onSubmit: (e: React.FormEvent) => void;
  selectedLoan: OutstandingLoan | null;
}

const RepaymentForm = ({
  isDialogOpen,
  setIsDialogOpen,
  formData,
  setFormData,
  onSubmit,
  selectedLoan
}: RepaymentFormProps) => {
  const resetForm = () => {
    setFormData({
      loanId: '',
      amount: '',
      notes: ''
    });
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Record New Payment</DialogTitle>
          <DialogDescription>
            Enter the payment details for this loan repayment.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="amount">Payment Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              disabled={!selectedLoan?.allowOverpayment}
              required
            />
            {!selectedLoan?.allowOverpayment && (
              <p className="text-sm text-gray-500">Amount is fixed to EMI amount</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Add any notes about this payment..."
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-blue-600 to-green-600">
              Record Payment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RepaymentForm;