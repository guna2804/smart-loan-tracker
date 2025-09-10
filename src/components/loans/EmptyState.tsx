import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { TrendingUp, TrendingDown, Add as Plus } from "@mui/icons-material";

interface EmptyStateProps {
  activeTab: string;
  onAddLoan: () => void;
}

export const EmptyState = ({ activeTab, onAddLoan }: EmptyStateProps) => {
  return (
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
            onClick={onAddLoan}
            className="bg-gradient-to-r from-blue-600 to-green-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add {activeTab === "lending" ? "Lending" : "Borrowing"} Record
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
