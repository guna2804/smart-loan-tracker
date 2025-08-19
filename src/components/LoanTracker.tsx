import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Calendar,
  DollarSign,
  User,
  TrendingUp,
  TrendingDown
} from "lucide-react";

interface Loan {
  id: string;
  borrowerName: string;
  lenderName: string;
  amount: number;
  interestRate: number;
  interestType: 'flat' | 'compound';
  startDate: string;
  dueDate: string;
  status: 'active' | 'completed' | 'overdue';
  type: 'lending' | 'borrowing';
  notes?: string;
  remainingAmount: number;
}

const LoanTracker = () => {
  const [loans, setLoans] = useState<Loan[]>([
    {
      id: '1',
      borrowerName: 'John Doe',
      lenderName: 'You',
      amount: 5000,
      interestRate: 5,
      interestType: 'compound',
      startDate: '2025-01-15',
      dueDate: '2025-08-15',
      status: 'active',
      type: 'lending',
      notes: 'Personal loan for emergency expenses',
      remainingAmount: 4200
    },
    {
      id: '2',
      borrowerName: 'You',
      lenderName: 'Jane Smith',
      amount: 2500,
      interestRate: 3,
      interestType: 'flat',
      startDate: '2025-02-01',
      dueDate: '2025-08-01',
      status: 'active',
      type: 'borrowing',
      notes: 'Business investment loan',
      remainingAmount: 2100
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('lending');
  const [editingLoan, setEditingLoan] = useState<Loan | null>(null);

  const [formData, setFormData] = useState({
    borrowerName: '',
    lenderName: '',
    amount: '',
    interestRate: '',
    interestType: 'flat' as 'flat' | 'compound',
    startDate: '',
    dueDate: '',
    type: 'lending' as 'lending' | 'borrowing',
    notes: ''
  });

  const calculateTotalAmount = (loan: Loan) => {
    const principal = loan.amount;
    const rate = loan.interestRate / 100;
    const timePeriod = (new Date(loan.dueDate).getTime() - new Date(loan.startDate).getTime()) / (1000 * 60 * 60 * 24 * 365);
    
    if (loan.interestType === 'compound') {
      return principal * Math.pow(1 + rate, timePeriod);
    } else {
      return principal * (1 + rate * timePeriod);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLoan: Loan = {
      id: editingLoan?.id || Date.now().toString(),
      borrowerName: formData.type === 'lending' ? formData.borrowerName : 'You',
      lenderName: formData.type === 'lending' ? 'You' : formData.lenderName,
      amount: parseFloat(formData.amount),
      interestRate: parseFloat(formData.interestRate),
      interestType: formData.interestType,
      startDate: formData.startDate,
      dueDate: formData.dueDate,
      status: 'active',
      type: formData.type,
      notes: formData.notes,
      remainingAmount: parseFloat(formData.amount)
    };

    if (editingLoan) {
      setLoans(loans.map(loan => loan.id === editingLoan.id ? newLoan : loan));
    } else {
      setLoans([...loans, newLoan]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      borrowerName: '',
      lenderName: '',
      amount: '',
      interestRate: '',
      interestType: 'flat',
      startDate: '',
      dueDate: '',
      type: 'lending',
      notes: ''
    });
    setEditingLoan(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (loan: Loan) => {
    setFormData({
      borrowerName: loan.type === 'lending' ? loan.borrowerName : '',
      lenderName: loan.type === 'borrowing' ? loan.lenderName : '',
      amount: loan.amount.toString(),
      interestRate: loan.interestRate.toString(),
      interestType: loan.interestType,
      startDate: loan.startDate,
      dueDate: loan.dueDate,
      type: loan.type,
      notes: loan.notes || ''
    });
    setEditingLoan(loan);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setLoans(loans.filter(loan => loan.id !== id));
  };

  const filteredLoans = loans.filter(loan => loan.type === activeTab);

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Loan Tracker</h1>
          <p className="text-gray-600 mt-1">Manage your lending and borrowing activities</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Add New Loan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingLoan ? 'Edit Loan' : 'Add New Loan'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Loan Type</Label>
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
                  <Label htmlFor="amount">Amount ($)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="personName">
                    {formData.type === 'lending' ? 'Borrower Name' : 'Lender Name'}
                  </Label>
                  <Input
                    id="personName"
                    value={formData.type === 'lending' ? formData.borrowerName : formData.lenderName}
                    onChange={(e) => setFormData({
                      ...formData, 
                      [formData.type === 'lending' ? 'borrowerName' : 'lenderName']: e.target.value
                    })}
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
                    onChange={(e) => setFormData({...formData, interestRate: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="interestType">Interest Type</Label>
                  <Select 
                    value={formData.interestType} 
                    onValueChange={(value: 'flat' | 'compound') => 
                      setFormData({...formData, interestType: value})
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
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Add any additional notes about this loan..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-blue-600 to-green-600">
                  {editingLoan ? 'Update Loan' : 'Add Loan'}
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
            Lending ({loans.filter(l => l.type === 'lending').length})
          </TabsTrigger>
          <TabsTrigger value="borrowing" className="flex items-center">
            <TrendingDown className="w-4 h-4 mr-2" />
            Borrowing ({loans.filter(l => l.type === 'borrowing').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredLoans.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="space-y-4">
                  <div className="text-gray-400">
                    {activeTab === 'lending' ? <TrendingUp className="mx-auto h-12 w-12" /> : <TrendingDown className="mx-auto h-12 w-12" />}
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">
                    No {activeTab} records found
                  </h3>
                  <p className="text-gray-500">
                    Start by adding your first {activeTab} transaction
                  </p>
                  <Button onClick={() => setIsDialogOpen(true)} className="bg-gradient-to-r from-blue-600 to-green-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Add {activeTab === 'lending' ? 'Lending' : 'Borrowing'} Record
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredLoans.map((loan) => (
                <Card key={loan.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          loan.type === 'lending' 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-blue-100 text-blue-600'
                        }`}>
                          <User className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {loan.type === 'lending' ? loan.borrowerName : loan.lenderName}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {loan.type === 'lending' ? 'Borrower' : 'Lender'}
                          </p>
                        </div>
                      </div>

                      <div className="text-right space-y-1">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          <span className="font-bold text-lg">${loan.amount.toLocaleString()}</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          Total: ${calculateTotalAmount(loan).toLocaleString()}
                        </div>
                      </div>

                      <div className="text-center">
                        <Badge variant={loan.status === 'overdue' ? 'destructive' : 'default'}>
                          {loan.status}
                        </Badge>
                        <div className="text-xs text-gray-500 mt-1">
                          {loan.interestRate}% {loan.interestType}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
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

                    <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Start Date:</span>
                        <div className="font-medium">{new Date(loan.startDate).toLocaleDateString()}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Due Date:</span>
                        <div className="font-medium">{new Date(loan.dueDate).toLocaleDateString()}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Remaining:</span>
                        <div className="font-medium">${loan.remainingAmount.toLocaleString()}</div>
                      </div>
                    </div>

                    {loan.notes && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <span className="text-xs text-gray-500">Notes:</span>
                        <p className="text-sm text-gray-700 mt-1">{loan.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LoanTracker;