import { Tabs, Tab, Box } from "@mui/material";
import { TrendingUp, TrendingDown } from "@mui/icons-material";

interface LoanTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
}

export const LoanTabs = ({ activeTab, onTabChange, children }: LoanTabsProps) => {
  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    onTabChange(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs
        value={activeTab}
        onChange={handleChange}
        sx={{
          minHeight: 40,
          '& .MuiTabs-indicator': {
            height: 2,
          },
        }}
      >
        <Tab
          value="lending"
          label={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TrendingUp sx={{ mr: 1, fontSize: 16 }} />
              Lending
            </Box>
          }
          sx={{
            minHeight: 32,
            borderRadius: 0.5,
            px: 3,
            py: 1.5,
            fontSize: '0.875rem',
            fontWeight: 500,
            textTransform: 'none',
            '&.Mui-selected': {
              bgcolor: 'background.paper',
              color: 'text.primary',
              boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
            },
          }}
        />
        <Tab
          value="borrowing"
          label={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TrendingDown sx={{ mr: 1, fontSize: 16 }} />
              Borrowing
            </Box>
          }
          sx={{
            minHeight: 32,
            borderRadius: 0.5,
            px: 3,
            py: 1.5,
            fontSize: '0.875rem',
            fontWeight: 500,
            textTransform: 'none',
            '&.Mui-selected': {
              bgcolor: 'background.paper',
              color: 'text.primary',
              boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
            },
          }}
        />
      </Tabs>

      <Box sx={{ mt: 2, p: 2 }}>
        {children}
      </Box>
    </Box>
  );
};
