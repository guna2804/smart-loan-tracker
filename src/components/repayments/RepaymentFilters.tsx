import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Filter } from "lucide-react";

interface RepaymentFiltersProps {
  filterType: 'all' | 'lending' | 'borrowing';
  setFilterType: (value: 'all' | 'lending' | 'borrowing') => void;
  filterPaymentType: 'all' | 'full' | 'partial';
  setFilterPaymentType: (value: 'all' | 'full' | 'partial') => void;
}

const RepaymentFilters = ({
  filterType,
  setFilterType,
}: RepaymentFiltersProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Filter className="w-4 h-4 text-gray-500" />
        <Label htmlFor="filterType" className="text-sm font-medium text-gray-700">Filter by Role</Label>
      </div>
      <div className="flex gap-2">
        <Button
          variant={filterType === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterType('all')}
          className={`flex-1 ${filterType === 'all' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'border-gray-300'}`}
        >
          All
        </Button>
        <Button
          variant={filterType === 'lending' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterType('lending')}
          className={`flex-1 ${filterType === 'lending' ? 'bg-green-600 hover:bg-green-700 text-white' : 'border-gray-300'}`}
        >
          Lending
        </Button>
        <Button
          variant={filterType === 'borrowing' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterType('borrowing')}
          className={`flex-1 ${filterType === 'borrowing' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'border-gray-300'}`}
        >
          Borrowing
        </Button>
      </div>
    </div>
  );
};

export default RepaymentFilters;