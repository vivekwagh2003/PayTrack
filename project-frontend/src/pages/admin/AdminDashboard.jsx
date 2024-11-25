// frontend/src/components/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  Tooltip 
} from 'recharts';
import { FileDown, Printer } from 'lucide-react';
import { format } from 'date-fns';
import api from '../../services/api';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const AdminReport = ({ stats, onClose }) => {
  const generatePDF = async () => {
    const input = document.getElementById('report-content');
    
    // Create a canvas from the HTML content
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      
      // Create a new jsPDF instance
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // PDF width in mm (A4 is 210mm wide)
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('report.pdf'); // Save the PDF
    });
  };

  return (
    <div id='report-content' className="min-h-screen bg-white p-8 print:p-4">
      {/* Print-only styles */}
      <style>
        {`
          @media print {
            @page { margin: 1cm; }
            .no-print { display: none !important; }
            .print-only { display: block !important; }
          }
        `}
      </style>

      {/* Header Actions */}
      <div className="flex justify-between items-center mb-8 no-print">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Report</h1>
        <div className="flex gap-4">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="flex items-center gap-2"
          >
            Close
          </Button>
          <Button 
            onClick={generatePDF}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <FileDown size={16} />
            Download PDF
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.print()}
            className="flex items-center gap-2"
          >
            <Printer size={16} />
            Print
          </Button>
        </div>
      </div>

      {/* Report Content */}
      <div className="text-center mb-8 border-b pb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Report</h1>
        <p className="text-gray-600">
          Generated on {format(new Date(), 'MMMM dd, yyyy')}
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total Users</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
          <div className="mt-2 flex items-center text-sm text-green-600">
            <span>+12% from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total Revenue</h3>
          <p className="text-3xl font-bold text-gray-900">₹{stats.totalRevenue.toLocaleString()}</p>
          <div className="mt-2 flex items-center text-sm text-green-600">
            <span>+8% from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Active Plans</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.activePlans.toLocaleString()}</p>
          <div className="mt-2 flex items-center text-sm text-green-600">
            <span>+15% from last month</span>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <Card className="mb-8">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold">Monthly Revenue Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fill: '#666' }} />
                <YAxis tick={{ fill: '#666' }} />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                />
                <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Details Table */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold">Revenue Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Growth</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.monthlyRevenue.map((month, index) => (
                  <tr key={month.month}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {month.month}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      ₹{month.revenue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      {index > 0 ? (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          month.revenue > stats.monthlyRevenue[index - 1].revenue
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {((month.revenue - stats.monthlyRevenue[index - 1].revenue) / 
                            stats.monthlyRevenue[index - 1].revenue * 100).toFixed(1)}%
                        </span>
                      ) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-500 print:mt-16">
        <p>Generated from Admin Dashboard • Confidential</p>
      </div>
    </div>
  );
};


const AdminDashboard = () => {
  const [showReport, setShowReport] = useState(false);

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRevenue: 0,
    activePlans: 0,
    monthlyRevenue: [],
  });
  const [newPlan, setNewPlan] = useState({
    name: '',
    description: '',
    price: '',
    data: '',
    validity: '',
    features: '',
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/plans/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      }
    };

    fetchStats();
  }, []);

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    try {
      await api.post('/plans', {
        ...newPlan,
        features: newPlan.features.split('\n'),
      });
      setNewPlan({
        name: '',
        description: '',
        price: '',
        data: '',
        validity: '',
        features: '',
      });
    } catch (error) {
      console.error('Error creating plan:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setShowReport(true)}>Export Data</Button>
          <Button>Refresh Stats</Button>
          </div>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="p-6 space-y-1">
              <CardTitle className="text-sm font-medium text-gray-500">Total Users</CardTitle>
              <p className="text-4xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="text-sm text-gray-600">+12% from last month</div>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="p-6 space-y-1">
              <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
              <p className="text-4xl font-bold text-gray-900">₹{stats.totalRevenue.toLocaleString()}</p>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="text-sm text-gray-600">+8% from last month</div>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="p-6 space-y-1">
              <CardTitle className="text-sm font-medium text-gray-500">Active Plans</CardTitle>
              <p className="text-4xl font-bold text-gray-900">{stats.activePlans.toLocaleString()}</p>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="text-sm text-gray-600">+15% from last month</div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Chart */}
        <Card className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="p-6 border-b border-gray-100">
            <CardTitle className="text-xl font-semibold">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fill: '#666' }} />
                  <YAxis tick={{ fill: '#666' }} />
                  <Tooltip cursor={false} wrapperStyle={{ backgroundColor: 'transparent', border: 'none' }} />

                  <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {showReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
            <div className="min-h-screen px-4 py-6">
              <div className="bg-white rounded-lg shadow-xl max-w-7xl mx-auto">
                <AdminReport 
                  stats={stats} 
                  onClose={() => setShowReport(false)} 
                />
              </div>
            </div>
          </div>
        )}

        {/* Create New Plan */}
        <Card className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="p-6 border-b border-gray-100">
            <CardTitle className="text-xl font-semibold">Create New Plan</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleCreatePlan} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Plan Name</label>
                  <Input
                    value={newPlan.name}
                    onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter plan name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <Input
                    value={newPlan.description}
                    onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter plan description"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Price (₹)</label>
                  <Input
                    type="number"
                    value={newPlan.price}
                    onChange={(e) => setNewPlan({ ...newPlan, price: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Data (GB)</label>
                  <Input
                    type="number"
                    value={newPlan.data}
                    onChange={(e) => setNewPlan({ ...newPlan, data: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="0"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Validity (Days)</label>
                  <Input
                    type="number"
                    value={newPlan.validity}
                    onChange={(e) => setNewPlan({ ...newPlan, validity: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Features (one per line)</label>
                <textarea
                  className="w-full min-h-[120px] px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y"
                  value={newPlan.features}
                  onChange={(e) => setNewPlan({ ...newPlan, features: e.target.value })}
                  placeholder="Enter features, one per line"
                  required
                />
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Button 
                  type="button" 
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                >
                  Create Plan
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;