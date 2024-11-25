import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowUpRight, ArrowDownRight, Activity, Calendar, Download, Upload } from 'lucide-react';


const CurrentPlan = () => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-500" />
          Current Plan
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900">Premium Plan</h3>
            <p className="text-sm text-blue-600 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Valid till: 31 Dec 2024
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Data Usage</span>
              <span className="text-sm font-semibold text-blue-600">15GB/20GB</span>
            </div>
            <Progress value={75} className="h-2" />

          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Download className="w-4 h-4 text-green-500" />
                <p className="text-sm font-medium text-gray-600">Data Speed</p>
              </div>
              <p className="text-xl font-semibold text-gray-900">100 Mbps</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Upload className="w-4 h-4 text-purple-500" />
                <p className="text-sm font-medium text-gray-600">Days Left</p>
              </div>
              <p className="text-xl font-semibold text-gray-900">15 Days</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentPlan;