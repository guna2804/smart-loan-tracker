import { useState, useEffect } from "react";
import { loanService, InterestType, CompoundingFrequencyType, RepaymentFrequencyType, CurrencyType } from "../services/loanService";
import { Card, CardContent} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Textarea } from "./ui/textarea";
import {
  Plus,
  Edit,
  Trash2,
  User,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

interface Loan {
  id: string;
  userId: string;
  counterpartyName: string;
  role: string; // "Lender" or "Borrower"
  principal: number;
  interestRate: number;
  interestType: number; // enum: 0 (Flat), 1 (Compound)
  compoundingFrequency: number; // enum: 0 (None), 1 (Monthly), etc.
  startDate: string;
  endDate?: string;
  repaymentFrequency: number; // enum: 0 (Monthly), etc.
  allowOverpayment: boolean;
  currency: number; // enum: 0 (USD), 1 (EUR), 2 (INR), etc.
  status: number; // enum: 0 (Active), 1 (Overdue), 2 (Completed)
  notes?: string;
  // Optionally add:
  // user?: any;
  // repayments?: any[];
  // notifications?: any[];
}

const LoanTracker = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  // Removed unused loading state

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const data = await loanService.getLoans();
        console.log('Fetched loans from backend:', data);
        // Map backend role to UI type for filtering
        const mappedLoans = (data.loans ?? []).map((loan: Loan) => ({
          ...loan,
          type: loan.role === "Lender" ? "lending" : "borrowing"
        }));
        console.log('Mapped loans for UI:', mappedLoans);
        setLoans(mappedLoans);
      } catch (err) {
        console.error('Error fetching loans:', err);
      }
    };
    fetchLoans();
  }, []);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("lending");
  const [editingLoan, setEditingLoan] = useState<Loan | null>(null);

  const [formData, setFormData] = useState({
    borrowerName: "",
    lenderName: "",
    amount: "",
    interestRate: "",
    interestType: InterestType.Flat,
    compoundingFrequency: CompoundingFrequencyType.None,
    startDate: "",
    dueDate: "",
    type: "lending" as "lending" | "borrowing",
    repaymentFrequency: RepaymentFrequencyType.Monthly,
    allowOverpayment: false,
    currency: CurrencyType.INR,
    notes: "",
  });

  const calculateTotalAmount = (loan: Loan) => {
    const principal = loan.principal;
    const rate = loan.interestRate / 100;
    const timePeriod =
      ((loan.endDate ? new Date(loan.endDate).getTime() : new Date().getTime()) - new Date(loan.startDate).getTime()) /
      (1000 * 60 * 60 * 24 * 365);

    if (loan.interestType === InterestType.Compound) {
      return principal * Math.pow(1 + rate, timePeriod);
    } else {
      return principal * (1 + rate * timePeriod);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      counterpartyName: formData.type === "lending" ? formData.borrowerName : formData.lenderName,
      role: formData.type === "lending" ? "Lender" : "Borrower",
      principal: parseFloat(formData.amount),
      interestRate: parseFloat(formData.interestRate),
      interestType: formData.interestType,
      compoundingFrequency: formData.compoundingFrequency,
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
      // Refresh loan list
      const data = await loanService.getLoans();
      const mappedLoans = (data.loans ?? []).map((loan: Loan) => ({
        ...loan,
        type: loan.role === "Lender" ? "lending" : "borrowing"
      }));
      setLoans(mappedLoans);
      resetForm();
    } catch {
      // Optionally handle error
    }
  };

  const resetForm = () => {
    setFormData({
      borrowerName: "",
      lenderName: "",
      amount: "",
      interestRate: "",
      interestType: InterestType.Flat,
      compoundingFrequency: CompoundingFrequencyType.None,
      startDate: "",
      dueDate: "",
      type: "lending",
      repaymentFrequency: RepaymentFrequencyType.Monthly,
      allowOverpayment: false,
      currency: CurrencyType.INR,
      notes: "",
    });
    setEditingLoan(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (loan: Loan) => {
    // Format dates to yyyy-MM-dd for input type="date"
    const formatDate = (dateStr?: string) => {
      if (!dateStr) return "";
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return "";
      return d.toISOString().slice(0, 10);
    };
    setFormData({
      borrowerName: loan.role === "Lender" ? loan.counterpartyName : "",
      lenderName: loan.role === "Borrower" ? loan.counterpartyName : "",
      amount: loan.principal.toString(),
      interestRate: loan.interestRate.toString(),
      interestType: loan.interestType,
      compoundingFrequency: loan.compoundingFrequency,
      startDate: formatDate(loan.startDate),
      dueDate: formatDate(loan.endDate),
      type: loan.role === "Lender" ? "lending" : "borrowing",
      repaymentFrequency: loan.repaymentFrequency,
      allowOverpayment: loan.allowOverpayment,
      currency: loan.currency,
      notes: loan.notes || "",
    });
    setEditingLoan(loan);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await loanService.deleteLoan(id);
      const data = await loanService.getLoans();
      console.log('Fetched loans after delete:', data);
      const mappedLoans = (data.loans ?? []).map((loan: Loan) => ({
        ...loan,
        type: loan.role === "Lender" ? "lending" : "borrowing"
      }));
      console.log('Mapped loans for UI after delete:', mappedLoans);
      setLoans(mappedLoans);
    } catch (err) {
      console.error('Error deleting loan:', err);
    }
  };

  const filteredLoans = loans.filter((loan) =>
    (activeTab === "lending" && loan.role === "Lender") ||
    (activeTab === "borrowing" && loan.role === "Borrower")
  );

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8 max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Loan Tracker
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Manage your lending and borrowing activities
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Add New Loan
            </Button>
          </DialogTrigger>
          <DialogContent className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingLoan ? "Edit Loan" : "Add New Loan"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
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
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

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
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
                      <SelectItem value="compound">
                        Compound Interest
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    required
                  />
                </div>
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Add any additional notes about this loan..."
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-green-600"
                >
                  {editingLoan ? "Update Loan" : "Add Loan"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="lending" className="flex items-center">
            <TrendingUp className="w-4 h-4 mr-2" />
            Lending ({loans.filter((l) => l.role === "Lender").length})
          </TabsTrigger>
          <TabsTrigger value="borrowing" className="flex items-center">
            <TrendingDown className="w-4 h-4 mr-2" />
            Borrowing ({loans.filter((l) => l.role === "Borrower").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredLoans.length === 0 ? (
            <Card>
              <CardContent className="p-6 sm:p-12 text-center">
                <div className="space-y-4">
                  <div className="text-gray-400">
                    {activeTab === "lending" ? (
                      <TrendingUp className="mx-auto h-12 w-12" />
                    ) : (
                      <TrendingDown className="mx-auto h-12 w-12" />
                    )}
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">
                    No {activeTab} records found
                  </h3>
                  <p className="text-gray-500">
                    Start by adding your first {activeTab} transaction
                  </p>
                  <Button
                    onClick={() => setIsDialogOpen(true)}
                    className="bg-gradient-to-r from-blue-600 to-green-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add {activeTab === "lending" ? "Lending" : "Borrowing"}{" "}
                    Record
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              {filteredLoans.map((loan, idx) => (
                <div
                  key={loan.id}
                  className={`p-4 ${
                    idx !== filteredLoans.length - 1
                      ? "border-b border-gray-200"
                      : ""
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
                          ${loan.principal.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Total: ${calculateTotalAmount(loan).toLocaleString()}
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
                        {loan.interestRate}% {loan.interestType === InterestType.Compound ? "compound" : "flat"}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(loan)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(loan.id)}
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
                          ${loan.principal.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Total:</span>
                        <span className="font-semibold text-gray-700">
                          ${calculateTotalAmount(loan).toLocaleString()}
                        </span>
                      </div>
                      <div className="text-center pt-1">
                        <span className="text-xs text-gray-500">
                          {loan.interestRate}% {loan.interestType === InterestType.Compound ? "compound" : "flat"}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Row: Actions */}
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(loan)}
                        className="flex items-center space-x-1 px-3 py-2"
                      >
                        <Edit className="w-4 h-4" />
                        <span className="text-xs">Edit</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(loan.id)}
                        className="text-red-600 hover:text-red-700 flex items-center space-x-1 px-3 py-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="text-xs">Delete</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LoanTracker;
