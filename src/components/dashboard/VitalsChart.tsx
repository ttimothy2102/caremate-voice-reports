
import React from 'react';
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface VitalsChartProps {
  title: string;
  data: Array<{
    time: string;
    value: number;
  }>;
  color: string;
  unit: string;
}

export function VitalsChart({ title, data, color, unit }: VitalsChartProps) {
  return (
    <Card className="p-4">
      <h3 className="font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis 
              dataKey="time" 
              axisLine={false}
              tickLine={false}
              fontSize={12}
              tick={{ fill: '#6B7280' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              fontSize={12}
              tick={{ fill: '#6B7280' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '12px'
              }}
              formatter={(value) => [`${value} ${unit}`, title]}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={color} 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: color }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
