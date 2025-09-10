import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Add as Plus } from '@mui/icons-material';

interface DashboardHeaderProps {
  className?: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ className = "" }) => {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
        <p className="text-gray-600 mt-1">Here's your financial overview</p>
      </div>

      <Link to="/loans">
        <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
          <Plus sx={{ fontSize: 16, mr: 1 }} />
          Add New Loan
        </Button>
      </Link>
    </div>
  );
};