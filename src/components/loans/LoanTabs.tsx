import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { TrendingUp, TrendingDown } from "lucide-react";

interface LoanTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
}

export const LoanTabs = ({ activeTab, onTabChange, children }: LoanTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="lending" className="flex items-center">
          <TrendingUp className="w-4 h-4 mr-2" />
          Lending
        </TabsTrigger>
        <TabsTrigger value="borrowing" className="flex items-center">
          <TrendingDown className="w-4 h-4 mr-2" />
          Borrowing
        </TabsTrigger>
      </TabsList>

      <TabsContent value={activeTab} className="space-y-4">
        {children}
      </TabsContent>
    </Tabs>
  );
};
