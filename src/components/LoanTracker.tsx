import { useState, useEffect } from "react";
import { useLoans } from "../hooks/useLoans";
import type { Loan } from "../types/loan";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { AlertCircle, Filter } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import {
  LoanHeader,
  LoanFormDialog,
  LoanTable,
  LoanDetailsModal,
  EmptyState
} from "./loans";

const LoanTracker = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [activeTab, setActiveTab] = useState("lending");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [editingLoan, setEditingLoan] = useState<Loan | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(25);

  const {
    loans,
    loading,
    error,
    totalCount,
    totalPages,
    fetchLoans,
    fetchLoansSilent,
    deleteLoan,
    clearError,
  } = useLoans();

  useEffect(() => {
    const role = activeTab === "lending" ? "Lender" : activeTab === "borrowing" ? "Borrower" : undefined;
    const status = statusFilter === "all" ? undefined : statusFilter;
    fetchLoans({
      role,
      status,
      page: currentPage,
      pageSize
    });
  }, [activeTab, statusFilter, currentPage, pageSize, fetchLoans]);

  const handleAddLoan = () => {
    setEditingLoan(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (loan: Loan) => {
    setEditingLoan(loan);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const success = await deleteLoan(id);
    if (!success && error) {
      console.error('Failed to delete loan:', error);
      clearError();
    }
  };

  const handleViewDetails = (loan: Loan) => {
    setSelectedLoan(loan);
    setIsDetailsModalOpen(true);
  };

  const handleFormSuccess = async () => {
    // Refresh loan list silently with current filters and pagination
    const role = activeTab === "lending" ? "Lender" : activeTab === "borrowing" ? "Borrower" : undefined;
    const status = statusFilter === "all" ? undefined : statusFilter;
    await fetchLoansSilent({
      role,
      status,
      page: currentPage,
      pageSize
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset to first page when switching tabs
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset to first page when changing filter
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8 max-w-full">
      <LoanHeader onAddLoan={handleAddLoan} />

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Role Filter */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <Label className="text-sm font-medium text-gray-700">Filter by Role</Label>
            </div>
            <div className="flex gap-2">
              <Button
                variant={activeTab === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleTabChange('all')}
                className={`flex-1 ${activeTab === 'all' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'border-gray-300'}`}
              >
                All
              </Button>
              <Button
                variant={activeTab === 'lending' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleTabChange('lending')}
                className={`flex-1 ${activeTab === 'lending' ? 'bg-green-600 hover:bg-green-700 text-white' : 'border-gray-300'}`}
              >
                Lending
              </Button>
              <Button
                variant={activeTab === 'borrowing' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleTabChange('borrowing')}
                className={`flex-1 ${activeTab === 'borrowing' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'border-gray-300'}`}
              >
                Borrowing
              </Button>
            </div>
          </div>

          {/* Status Filter */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <Label className="text-sm font-medium text-gray-700">Filter by Status</Label>
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleStatusFilterChange('all')}
                className={`flex-1 ${statusFilter === 'all' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'border-gray-300'}`}
              >
                All
              </Button>
              <Button
                variant={statusFilter === '0' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleStatusFilterChange('0')}
                className={`flex-1 ${statusFilter === '0' ? 'bg-green-100 hover:bg-green-200 text-green-800' : 'border-gray-300'}`}
              >
                Active
              </Button>
              <Button
                variant={statusFilter === '1' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleStatusFilterChange('1')}
                className={`flex-1 ${statusFilter === '1' ? 'bg-red-100 hover:bg-red-200 text-red-800' : 'border-gray-300'}`}
              >
                Overdue
              </Button>
              <Button
                variant={statusFilter === '2' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleStatusFilterChange('2')}
                className={`flex-1 ${statusFilter === '2' ? 'bg-gray-100 hover:bg-gray-200 text-gray-800' : 'border-gray-300'}`}
              >
                Completed
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {loading ? (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </CardContent>
        </Card>
      ) : loans.length === 0 ? (
        <EmptyState activeTab={activeTab} onAddLoan={handleAddLoan} />
      ) : (
        <LoanTable
          loans={loans}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onViewDetails={handleViewDetails}
        />
      )}

      {/* Results info and Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-sm text-gray-600">
          {totalCount > 0 && (
            <>
              Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} loans
            </>
          )}
        </div>

        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                  className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>

              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => handlePageChange(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                  className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>

      <LoanFormDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingLoan={editingLoan}
        onSuccess={handleFormSuccess}
      />

      <LoanDetailsModal
        isOpen={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
        loan={selectedLoan}
      />
    </div>
  );
};

export default LoanTracker;
