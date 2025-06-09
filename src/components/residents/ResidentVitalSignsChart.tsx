
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useVitalSignsChart } from '@/hooks/useVitalSigns';
import { Activity, Heart, Thermometer, Gauge } from 'lucide-react';

interface ResidentVitalSignsChartProps {
  residentId: string;
  residentName: string;
}

export function ResidentVitalSignsChart({ residentId, residentName }: ResidentVitalSignsChartProps) {
  const { data: heartRateData = [], isLoading: heartRateLoading } = useVitalSignsChart(residentId);
  
  // Mock additional vital signs data for demonstration
  const bloodPressureData = heartRateData.map(item => ({
    time: item.time,
    systolic: Math.floor(Math.random() * 40 + 110),
    diastolic: Math.floor(Math.random() * 20 + 70)
  }));

  const temperatureData = heartRateData.map(item => ({
    time: item.time,
    value: 36.0 + Math.random() * 2
  }));

  const oxygenData = heartRateData.map(item => ({
    time: item.time,
    value: 95 + Math.random() * 5
  }));

  if (heartRateLoading) {
    return (
      <Card className="p-4">
        <div className="text-center text-gray-500">Lade Vitalwerte...</div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        <Activity className="w-5 h-5 text-blue-500" />
        Vitalwerte für {residentName}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Heart Rate Chart */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-4 h-4 text-red-500" />
            <h4 className="font-semibold text-gray-800">Herzfrequenz (BPM)</h4>
          </div>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={heartRateData}>
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
                  formatter={(value) => [`${value} bpm`, 'Herzfrequenz']}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#EF4444" 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: '#EF4444' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Blood Pressure Chart */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Gauge className="w-4 h-4 text-blue-500" />
            <h4 className="font-semibold text-gray-800">Blutdruck (mmHg)</h4>
          </div>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={bloodPressureData}>
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
                />
                <Line 
                  type="monotone" 
                  dataKey="systolic" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={false}
                  name="Systolisch"
                />
                <Line 
                  type="monotone" 
                  dataKey="diastolic" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  dot={false}
                  name="Diastolisch"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Temperature Chart */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Thermometer className="w-4 h-4 text-orange-500" />
            <h4 className="font-semibold text-gray-800">Körpertemperatur (°C)</h4>
          </div>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={temperatureData}>
                <XAxis 
                  dataKey="time" 
                  axisLine={false}
                  tickLine={false}
                  fontSize={12}
                  tick={{ fill: '#6B7280' }}
                />
                <YAxis 
                  domain={[35, 39]}
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
                  formatter={(value) => [`${(value as number).toFixed(1)}°C`, 'Temperatur']}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#F97316" 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: '#F97316' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Oxygen Saturation Chart */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-purple-500" />
            <h4 className="font-semibold text-gray-800">Sauerstoffsättigung (%)</h4>
          </div>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={oxygenData}>
                <XAxis 
                  dataKey="time" 
                  axisLine={false}
                  tickLine={false}
                  fontSize={12}
                  tick={{ fill: '#6B7280' }}
                />
                <YAxis 
                  domain={[90, 100]}
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
                  formatter={(value) => [`${(value as number).toFixed(1)}%`, 'SpO2']}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: '#8B5CF6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
