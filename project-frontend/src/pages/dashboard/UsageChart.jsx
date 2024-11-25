import React from 'react';
import { Card, CardHeader, CardTitle, CardContent} from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts';
import { ArrowUpRight, ArrowDownRight, Activity, Calendar, Download, Upload } from 'lucide-react';


const UsageChart = () => {
  const data = [
    { day: '1', usage: 2 },
    { day: '5', usage: 4 },
    { day: '10', usage: 6 },
    { day: '15', usage: 8 },
    { day: '20', usage: 10 },
    { day: '25', usage: 12 },
    { day: '30', usage: 15 },
  ];

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-500" />
          Data Usage
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="usage" 
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default UsageChart;
