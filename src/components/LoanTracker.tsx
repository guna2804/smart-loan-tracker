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
import {
  LoanHeader,
  LoanFormDialog,
  LoanTabs,
  LoanList,
  EmptyState
} from "./loans";

const LoanTracker = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("lending");
  const [editingLoan, setEditingLoan] = useState<Loan | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(25);

  const {
    loans,
    error,
    totalCount,
    totalPages,
    fetchLoans,
    fetchLoansSilent,
    deleteLoan,
    clearError,
  } = useLoans();

  useEffect(() => {
    const role = activeTab === "lending" ? "Lender" : "Borrower";
    fetchLoans({
      role,
      page: currentPage,
      pageSize
    });
  }, [activeTab, currentPage, pageSize, fetchLoans]);

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

  const handleFormSuccess = async () => {
    // Refresh loan list silently with current role filter and pagination
    const role = activeTab === "lending" ? "Lender" : "Borrower";
    await fetchLoansSilent({
      role,
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

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8 max-w-full">
      <LoanHeader onAddLoan={handleAddLoan} />

      <LoanTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
      >
        {loans.length === 0 ? (
          <EmptyState activeTab={activeTab} onAddLoan={handleAddLoan} />
        ) : (
          <LoanList
            loans={loans}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </LoanTabs>

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
    </div>
  );
};

export default LoanTracker;
