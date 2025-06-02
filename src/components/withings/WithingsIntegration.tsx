
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity, Heart, Weight, Thermometer, Droplets, Wifi, WifiOff } from 'lucide-react';
import { useWithingsData } from '@/hooks/useWithingsData';
import { useResidents } from '@/hooks/useResidents';
import { format } from 'date-fns';

const measurementIcons = {
  'heart_rate': Heart,
  'weight': Weight,
  'temperature': Thermometer,
  'blood_pressure': Activity,
  'steps': Activity,
  'sleep': Droplets
};

export function WithingsIntegration() {
  const [isConnected, setIsConnected] = useState(true); // Mock connection status
  const { data: withingsData = [] } = useWithingsData();
  const { data: residents = [] } = useResidents();

  const connectWithings = async () => {
    // Mock Withings OAuth flow
    window.open('https://account.withings.com/oauth2_user/authorize2', '_blank');
    setTimeout(() => {
      setIsConnected(true);
    }, 2000);
  };

  const getLatestMeasurements = () => {
    const latest = new Map();
    withingsData.forEach(measurement => {
      const key = `${measurement.resident_id}-${measurement.measurement_type}`;
      if (!latest.has(key) || new Date(measurement.measured_at) > new Date(latest.get(key).measured_at)) {
        latest.set(key, measurement);
      }
    });
    return Array.from(latest.values());
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Withings Health Data</h2>
        <div className="flex items-center gap-3">
          <Badge variant={isConnected ? "default" : "outline"} className="gap-2">
            {isConnected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
            {isConnected ? 'Connected' : 'Disconnected'}
          </Badge>
          {!isConnected && (
            <Button onClick={connectWithings} size="sm">
              Connect Withings
            </Button>
          )}
        </div>
      </div>

      {isConnected && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {getLatestMeasurements().map((measurement) => {
            const resident = residents.find(r => r.id === measurement.resident_id);
            const IconComponent = measurementIcons[measurement.measurement_type as keyof typeof measurementIcons] || Activity;
            
            return (
              <Card key={measurement.id} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <IconComponent className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-gray-800 capitalize">
                      {measurement.measurement_type.replace('_', ' ')}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Live
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-gray-900">
                      {measurement.value}
                    </span>
                    <span className="text-sm text-gray-600">
                      {measurement.unit}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <p className="font-medium">{resident?.name}</p>
                    <p>{format(new Date(measurement.measured_at), 'MMM d, HH:mm')}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Mock some sample data for demonstration */}
      {isConnected && withingsData.length === 0 && (
        <Card className="p-6 text-center">
          <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">No Data Yet</h3>
          <p className="text-gray-600 mb-4">
            Wearable devices will automatically sync health data here.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <Heart className="w-6 h-6 text-blue-600 mb-2" />
              <p className="text-sm font-medium">Heart Rate</p>
              <p className="text-xs text-gray-600">Continuous monitoring</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <Weight className="w-6 h-6 text-green-600 mb-2" />
              <p className="text-sm font-medium">Weight</p>
              <p className="text-xs text-gray-600">Daily measurements</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <Activity className="w-6 h-6 text-orange-600 mb-2" />
              <p className="text-sm font-medium">Activity</p>
              <p className="text-xs text-gray-600">Steps & movement</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
