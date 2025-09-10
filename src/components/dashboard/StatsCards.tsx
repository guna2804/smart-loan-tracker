import React from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { TrendingUp, TrendingDown, CurrencyRupee as IndianRupee } from '@mui/icons-material';

interface StatsData {
  totalLent: number;
  totalBorrowed: number;
  interestEarned: number;
  lentChangePercent: number;
  borrowedChangePercent: number;
  interestChangePercent: number;
}

interface StatsCardsProps {
  stats: StatsData;
  className?: string;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats, className = "" }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="text-sm font-medium text-green-800">
            Total Lent
          </h3>
          <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-900">
            ₹{stats.totalLent.toLocaleString()}
          </div>
          <p className={`text-xs mt-1 ${stats.lentChangePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {stats.lentChangePercent >= 0 ? '+' : ''}{stats.lentChangePercent}% from last month
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="text-sm font-medium text-blue-800">
            Total Borrowed
          </h3>
          <TrendingDown sx={{ fontSize: 16, color: 'primary.main' }} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-900">
            ₹{stats.totalBorrowed.toLocaleString()}
          </div>
          <p className={`text-xs mt-1 ${stats.borrowedChangePercent >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
            {stats.borrowedChangePercent >= 0 ? '+' : ''}{stats.borrowedChangePercent}% from last month
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="text-sm font-medium text-purple-800">
            Interest Earned
          </h3>
          <IndianRupee sx={{ fontSize: 16, color: 'secondary.main' }} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-900">
            ₹{stats.interestEarned.toLocaleString()}
          </div>
          <p className={`text-xs mt-1 ${stats.interestChangePercent >= 0 ? 'text-purple-600' : 'text-red-600'}`}>
            {stats.interestChangePercent >= 0 ? '+' : ''}{stats.interestChangePercent}% from last month
          </p>
        </CardContent>
      </Card>
    </div>
  );
};