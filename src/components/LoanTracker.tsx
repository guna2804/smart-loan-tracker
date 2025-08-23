import { useState } from "react";
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
  borrowerName: string;
  lenderName: string;
  amount: number;
  interestRate: number;
  interestType: "flat" | "compound";
  startDate: string;
  dueDate: string;
  status: "active" | "completed" | "overdue";
  type: "lending" | "borrowing";
  notes?: string;
  remainingAmount: number;
}

const LoanTracker = () => {
  const [loans, setLoans] = useState<Loan[]>([
    {
      id: "1",
      borrowerName: "John Doe",
      lenderName: "You",
      amount: 5000,
      interestRate: 5,
      interestType: "compound",
      startDate: "2025-01-15",
      dueDate: "2025-08-15",
      status: "active",
      type: "lending",
      notes: "Personal loan for emergency expenses",
      remainingAmount: 4200,
    },
    {
      id: "2",
      borrowerName: "You",
      lenderName: "Jane Smith",
      amount: 2500,
      interestRate: 3,
      interestType: "flat",
      startDate: "2025-02-01",
      dueDate: "2025-08-01",
      status: "active",
      type: "borrowing",
      notes: "Business investment loan",
      remainingAmount: 2100,
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("lending");
  const [editingLoan, setEditingLoan] = useState<Loan | null>(null);

  const [formData, setFormData] = useState({
    borrowerName: "",
    lenderName: "",
    amount: "",
    interestRate: "",
    interestType: "flat" as "flat" | "compound",
    startDate: "",
    dueDate: "",
    type: "lending" as "lending" | "borrowing",
    notes: "",
  });

  const calculateTotalAmount = (loan: Loan) => {
    const principal = loan.amount;
    const rate = loan.interestRate / 100;
    const timePeriod =
      (new Date(loan.dueDate).getTime() - new Date(loan.startDate).getTime()) /
      (1000 * 60 * 60 * 24 * 365);

    if (loan.interestType === "compound") {
      return principal * Math.pow(1 + rate, timePeriod);
    } else {
      return principal * (1 + rate * timePeriod);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLoan: Loan = {
      id: editingLoan?.id || Date.now().toString(),
      borrowerName: formData.type === "lending" ? formData.borrowerName : "You",
      lenderName: formData.type === "lending" ? "You" : formData.lenderName,
      amount: parseFloat(formData.amount),
      interestRate: parseFloat(formData.interestRate),
      interestType: formData.interestType,
      startDate: formData.startDate,
      dueDate: formData.dueDate,
      status: "active",
      type: formData.type,
      notes: formData.notes,
      remainingAmount: parseFloat(formData.amount),
    };

    if (editingLoan) {
      setLoans(
        loans.map((loan) => (loan.id === editingLoan.id ? newLoan : loan))
      );
    } else {
      setLoans([...loans, newLoan]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      borrowerName: "",
      lenderName: "",
      amount: "",
      interestRate: "",
      interestType: "flat",
      startDate: "",
      dueDate: "",
      type: "lending",
      notes: "",
    });
    setEditingLoan(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (loan: Loan) => {
    setFormData({
      borrowerName: loan.type === "lending" ? loan.borrowerName : "",
      lenderName: loan.type === "borrowing" ? loan.lenderName : "",
      amount: loan.amount.toString(),
      interestRate: loan.interestRate.toString(),
      interestType: loan.interestType,
      startDate: loan.startDate,
      dueDate: loan.dueDate,
      type: loan.type,
      notes: loan.notes || "",
    });
    setEditingLoan(loan);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setLoans(loans.filter((loan) => loan.id !== id));
  };

  const filteredLoans = loans.filter((loan) => loan.type === activeTab);

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
                    value={formData.interestType}
                    onValueChange={(value: "flat" | "compound") =>
                      setFormData({ ...formData, interestType: value })
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
            Lending ({loans.filter((l) => l.type === "lending").length})
          </TabsTrigger>
          <TabsTrigger value="borrowing" className="flex items-center">
            <TrendingDown className="w-4 h-4 mr-2" />
            Borrowing ({loans.filter((l) => l.type === "borrowing").length})
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
                    {/* Borrower */}
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          loan.type === "lending"
                            ? "bg-green-100 text-green-600"
                            : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {loan.type === "lending"
                            ? loan.borrowerName
                            : loan.lenderName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {loan.type === "lending" ? "Borrower" : "Lender"}
                        </p>
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        Principal:
                        <span className="font-bold text-lg">
                          ${loan.amount.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Total: ${calculateTotalAmount(loan).toLocaleString()}
                      </div>
                    </div>

                    {/* Status */}
                    <div className="text-center">
                      <Badge
                        variant={
                          loan.status === "overdue" ? "destructive" : "default"
                        }
                        className="capitalize"
                      >
                        {loan.status}
                      </Badge>
                      <div className="text-xs text-gray-500 mt-1">
                        {loan.interestRate}% {loan.interestType}
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
                    {/* Top Row: Borrower Info and Status */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            loan.type === "lending"
                              ? "bg-green-100 text-green-600"
                              : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          <User className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-gray-900 text-sm truncate">
                            {loan.type === "lending"
                              ? loan.borrowerName
                              : loan.lenderName}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {loan.type === "lending" ? "Borrower" : "Lender"}
                          </p>
                        </div>
                      </div>

                      <Badge
                        variant={
                          loan.status === "overdue" ? "destructive" : "default"
                        }
                        className="capitalize text-xs"
                      >
                        {loan.status}
                      </Badge>
                    </div>

                    {/* Middle Row: Amount Details */}
                    <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Principal:
                        </span>
                        <span className="font-bold text-lg text-gray-900">
                          ${loan.amount.toLocaleString()}
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
                          {loan.interestRate}% {loan.interestType}
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
