import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useState } from 'react';
import type { Loan } from '../../utils/loanUtils';

interface LoanFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<Loan>;
  onSubmit: (loanData: Omit<Loan, 'id' | 'status' | 'remainingAmount'>) => void;
}

export const LoanFormDialog = ({
  open,
  onOpenChange,
  initialData,
  onSubmit
}: LoanFormDialogProps) => {
  const [formData, setFormData] = useState({
    borrowerName: initialData?.borrowerName || '',
    lenderName: initialData?.lenderName || '',
    amount: initialData?.amount?.toString() || '',
    interestRate: initialData?.interestRate?.toString() || '',
    interestType: initialData?.interestType || 'flat',
    startDate: initialData?.startDate || new Date().toISOString().split('T')[0],
    dueDate: initialData?.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    type: initialData?.type || 'lending',
    notes: initialData?.notes || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount),
      interestRate: parseFloat(formData.interestRate),
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{initialData?.id ? 'Edit Loan' : 'Add New Loan'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Form fields */}
            <div className="space-y-2">
              <Label>Loan Type</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value: 'lending' | 'borrowing') => 
                  setFormData({...formData, type: value})
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
              <Label>Amount ($)</Label>
              <Input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                required
              />
            </div>
          </div>
          
          {/* More form fields */}
          
          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {initialData?.id ? 'Update' : 'Add'} Loan
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};