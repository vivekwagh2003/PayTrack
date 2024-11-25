import React, { useEffect, useState, useContext } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { transactionService } from '../../services/api';
import { Activity, FileText,Download,X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const TransactionBill = ({ transaction, user, onClose }) => {
  const handleDownloadPDF = async () => {
    const billElement = document.getElementById('bill-content');
    try {
      const canvas = await html2canvas(billElement);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`invoice-${transaction._id.slice(-6)}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="p-8 bg-white rounded-lg">
      {/* Download Button */}
      <div className="flex justify-end mb-6">
        <Button 
          onClick={handleDownloadPDF}
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download Invoice
        </Button>
      </div>

      <div id="bill-content" className="space-y-8">
        {/* Company Header */}
        <div className="text-center border-b pb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Invoice</h2>
          <p className="text-lg text-blue-600 font-medium">SPM</p>
        </div>

        {/* Bill Details */}
        <div className="grid grid-cols-2 gap-8">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-3 text-lg">Bill To:</h3>
            <div className="space-y-2">
              <p className="text-gray-700 font-medium text-lg">{user.name}</p>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-3 text-lg">Invoice Details:</h3>
            <div className="space-y-2">
              <p className="text-gray-700">
                <span className="font-medium">Date: </span>
                {new Date(transaction.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Invoice #: </span>
                INV-{transaction._id.slice(-6)}
              </p>
            </div>
          </div>
        </div>

        {/* Service Details */}
        <div className="mt-8 max-w-3xl mx-auto">
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left py-5 px-6 text-gray-700 font-semibold text-sm uppercase tracking-wider">
                Description
              </th>
              <th className="text-right py-5 px-6 text-gray-700 font-semibold text-sm uppercase tracking-wider">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr className="hover:bg-gray-50 transition-colors duration-150">
              <td className="py-6 px-6">
                <p className="font-medium text-gray-900 mb-1.5">{transaction.plan.name}</p>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">{transaction.plan.description}</p>
                  <div className="flex items-center space-x-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {transaction.plan.data}GB
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {transaction.plan.validity} Days
                    </span>
                  </div>
                </div>
              </td>
              <td className="text-right py-6 px-6 text-gray-900 font-medium">
                ₹{transaction.amount}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="bg-gray-50 border-t border-gray-200">
              <td className="py-5 px-6 font-semibold text-gray-900">Total</td>
              <td className="text-right py-5 px-6 font-bold text-blue-600 text-lg">
                ₹{transaction.amount}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

        {/* Payment Status */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <p className="text-green-800 font-medium">
            Payment Status: {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
          </p>
        </div>

        {/* Footer */}
        <div className="text-center space-y-3 pt-8 border-t">
          <p className="font-medium text-gray-800">Thank you for your business!</p>
          <div className="text-gray-600">
            <p>For any queries, please contact</p>
            <p className="text-blue-600 font-medium">support@yourcompany.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await transactionService.getUserTransactions();
        setTransactions(response.data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const getStatusStyles = (status) => {
    const baseStyles = "text-sm font-medium px-2 py-1 rounded-full";
    switch (status) {
      case 'completed':
        return `${baseStyles} bg-green-100 text-green-800`;
      case 'failed':
        return `${baseStyles} bg-red-100 text-red-800`;
      default:
        return `${baseStyles} bg-yellow-100 text-yellow-800`;
    }
  };

  const handleGenerateBill = (transaction) => {
    setSelectedTransaction(transaction);
  };

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" />
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction._id}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="space-y-1">
                    <p className="font-medium text-gray-900">{transaction.plan.name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right space-y-1">
                      <p className="font-semibold text-gray-900">₹{transaction.amount}</p>
                      <div className={getStatusStyles(transaction.status)}>
                        {transaction.status}
                      </div>
                    </div>
                    {transaction.status === 'completed' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="ml-4"
                        onClick={() => handleGenerateBill(transaction)}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Generate Bill
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedTransaction} onOpenChange={() => setSelectedTransaction(null)}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 gap-0">
        <DialogHeader className="sticky top-0 z-50 bg-white px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">Transaction Bill</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => setSelectedTransaction(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        {selectedTransaction && (
          <TransactionBill
            transaction={selectedTransaction}
            user={user}
            onClose={() => setSelectedTransaction(null)}
            />
        )}
      </DialogContent>
    </Dialog>
    </>
  );
};

export default TransactionHistory;