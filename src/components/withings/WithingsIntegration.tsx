
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity, Heart, Weight, Thermometer, Droplets, Wifi, WifiOff, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useWithingsData } from '@/hooks/useWithingsData';
import { useResidents } from '@/hooks/useResidents';
import { format } from 'date-fns';
import { toast } from '@/components/ui/use-toast';

const measurementIcons = {
  'heart_rate': Heart,
  'weight': Weight,
  'temperature': Thermometer,
  'blood_pressure': Activity,
  'steps': Activity,
  'sleep': Droplets
};

const measurementColors = {
  'heart_rate': 'text-red-600',
  'weight': 'text-blue-600',
  'temperature': 'text-orange-600',
  'blood_pressure': 'text-purple-600',
  'steps': 'text-green-600',
  'sleep': 'text-indigo-600'
};

export function WithingsIntegration() {
  const [isConnected, setIsConnected] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const { data: withingsData = [] } = useWithingsData();
  const { data: residents = [] } = useResidents();

  const connectWithings = async () => {
    setIsConnecting(true);
    
    toast({
      title: "Connecting to Withings",
      description: "Opening Withings OAuth flow...",
    });

    // Simulate OAuth flow
    setTimeout(() => {
      setIsConnected(true);
      setIsConnecting(false);
      toast({
        title: "Connected Successfully",
        description: "Withings devices are now syncing health data.",
      });
    }, 2000);
  };

  const disconnectWithings = () => {
    setIsConnected(false);
    toast({
      title: "Disconnected",
      description: "Withings integration has been disabled.",
    });
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

  const getTrendIcon = (value: number, type: string) => {
    // Simple trend logic based on typical healthy ranges
    const trends = {
      'heart_rate': value > 80 ? 'up' : value < 60 ? 'down' : 'stable',
      'weight': value > 75 ? 'up' : value < 65 ? 'down' : 'stable',
      'steps': value > 8000 ? 'up' : value < 5000 ? 'down' : 'stable',
    };
    
    const trend = trends[type as keyof typeof trends] || 'stable';
    
    if (trend === 'up') return <TrendingUp className="w-3 h-3 text-red-500" />;
    if (trend === 'down') return <TrendingDown className="w-3 h-3 text-blue-500" />;
    return <Minus className="w-3 h-3 text-gray-400" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Withings Health Data</h2>
          <p className="text-sm text-gray-600">Real-time health monitoring from connected devices</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={isConnected ? "default" : "outline"} className="gap-2">
            {isConnected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
            {isConnected ? 'Connected' : 'Disconnected'}
          </Badge>
          {isConnected ? (
            <Button onClick={disconnectWithings} variant="outline" size="sm">
              Disconnect
            </Button>
          ) : (
            <Button onClick={connectWithings} size="sm" disabled={isConnecting}>
              {isConnecting ? 'Connecting...' : 'Connect Withings'}
            </Button>
          )}
        </div>
      </div>

      {isConnected && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {getLatestMeasurements().map((measurement) => {
            const resident = residents.find(r => r.id === measurement.resident_id);
            const IconComponent = measurementIcons[measurement.measurement_type as keyof typeof measurementIcons] || Activity;
            const colorClass = measurementColors[measurement.measurement_type as keyof typeof measurementColors] || 'text-gray-600';
            
            return (
              <Card key={measurement.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <IconComponent className={`w-5 h-5 ${colorClass}`} />
                    <span className="font-medium text-gray-800 capitalize">
                      {measurement.measurement_type.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(measurement.value, measurement.measurement_type)}
                    <Badge variant="outline" className="text-xs">
                      Live
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-gray-900">
                      {measurement.value.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-600">
                      {measurement.unit}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    <p className="font-medium">{resident?.name || 'Unknown Resident'}</p>
                    <p>{format(new Date(measurement.measured_at), 'MMM d, HH:mm')}</p>
                    <p className="text-xs text-gray-500">Device: {measurement.device_id}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {isConnected && withingsData.length === 0 && (
        <Card className="p-6 text-center">
          <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">Syncing Data</h3>
          <p className="text-gray-600 mb-4">
            Connected! Wearable devices will automatically sync health data here.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="p-4 bg-red-50 rounded-lg">
              <Heart className="w-6 h-6 text-red-600 mb-2 mx-auto" />
              <p className="text-sm font-medium">Heart Rate</p>
              <p className="text-xs text-gray-600">Continuous monitoring</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <Weight className="w-6 h-6 text-blue-600 mb-2 mx-auto" />
              <p className="text-sm font-medium">Weight</p>
              <p className="text-xs text-gray-600">Daily measurements</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <Activity className="w-6 h-6 text-green-600 mb-2 mx-auto" />
              <p className="text-sm font-medium">Activity</p>
              <p className="text-xs text-gray-600">Steps & movement</p>
            </div>
          </div>
        </Card>
      )}

      {!isConnected && (
        <Card className="p-6 text-center">
          <WifiOff className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">Connect Withings Devices</h3>
          <p className="text-gray-600 mb-4">
            Connect your Withings health devices to automatically sync vital signs, weight, and activity data.
          </p>
          <div className="text-sm text-gray-500 mb-6">
            <p>Supported devices:</p>
            <p>• Body+ Smart Scale • Steel HR Watch • BPM Connect • Sleep Mat</p>
          </div>
          <Button onClick={connectWithings} className="bg-caremate-gradient" disabled={isConnecting}>
            {isConnecting ? 'Connecting...' : 'Connect Withings Account'}
          </Button>
        </Card>
      )}
    </div>
  );
}
