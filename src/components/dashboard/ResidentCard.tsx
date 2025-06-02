
import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, AlertCircle } from 'lucide-react';
import { Resident } from '@/hooks/useResidents';

interface ResidentCardProps {
  resident: Resident & {
    lastReport?: string;
    vitalsStatus?: 'normal' | 'warning' | 'critical';
    hasAlerts?: boolean;
  };
  onClick: () => void;
}

export function ResidentCard({ resident, onClick }: ResidentCardProps) {
  const getVitalsColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-green-100 text-green-800 border-green-300';
    }
  };

  return (
    <Card 
      className="p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-800">{resident.name}</h3>
          <p className="text-sm text-gray-600">{resident.age} Jahre • Zimmer {resident.room}</p>
        </div>
        {resident.hasAlerts && (
          <div className="flex items-center gap-1">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <Bell className="w-4 h-4 text-orange-500" />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <Badge variant="outline" className="text-xs">
          {resident.care_level}
        </Badge>
        <Badge 
          variant="outline" 
          className={`text-xs ${getVitalsColor(resident.vitalsStatus || 'normal')}`}
        >
          Vitals: {resident.vitalsStatus || 'normal'}
        </Badge>
      </div>

      <div className="mt-3 pt-3 border-t">
        <p className="text-xs text-gray-500">
          Letzter Bericht: {resident.lastReport || 'Nicht verfügbar'}
        </p>
      </div>
    </Card>
  );
}
