import React from 'react';
import { useAuth } from '../../context/AuthContext';
import UsageChart from './UsageChart';
import CurrentPlan from './CurrentPlan';
import TransactionHistory from './TransactionHistory';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}</h1>
          <div className="text-sm text-gray-500">{new Date().toLocaleDateString()}</div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <CurrentPlan />
          <UsageChart />
          <TransactionHistory />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;