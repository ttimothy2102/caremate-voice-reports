
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExtendedResident } from './ResidentsList';
import { 
  Heart, 
  Calendar, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  Thermometer,
  Activity
} from 'lucide-react';

interface ResidentCardProps {
  resident: ExtendedResident;
  onClick: () => void;
}

export function ResidentCard({ resident, onClick }: ResidentCardProps) {
  const getHealthStatusColor = (status?: string) => {
    switch (status) {
      case 'kritisch': return 'bg-red-100 text-red-800 border-red-300';
      case 'bedenklich': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'gut': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getHealthStatusIcon = (status?: string) => {
    switch (status) {
      case 'kritisch': return <AlertCircle className="w-4 h-4" />;
      case 'bedenklich': return <Clock className="w-4 h-4" />;
      case 'gut': return <CheckCircle className="w-4 h-4" />;
      default: return <Heart className="w-4 h-4" />;
    }
  };

  const calculateAge = (birthDate?: string) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return age - 1;
    }
    return age;
  };

  const age = calculateAge(resident.birth_date);

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">{resident.name}</h3>
              <p className="text-sm text-gray-600">
                {age ? `${age} Jahre` : 'Alter unbekannt'} • Zimmer {resident.room}
              </p>
            </div>
            <div className="flex items-center gap-1">
              {getHealthStatusIcon(resident.health_status)}
            </div>
          </div>

          {/* Health Status & Care Level */}
          <div className="flex flex-wrap gap-2">
            <Badge 
              variant="outline" 
              className={`text-xs ${getHealthStatusColor(resident.health_status)}`}
            >
              {resident.health_status || 'Unbekannt'}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {resident.care_level}
            </Badge>
          </div>

          {/* Quick Vital Signs */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1">
              <Activity className="w-3 h-3 text-blue-500" />
              <span>RR: {resident.blood_pressure || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Thermometer className="w-3 h-3 text-orange-500" />
              <span>{resident.temperature || 'N/A'}°C</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-3 h-3 text-red-500" />
              <span>{resident.pulse || 'N/A'} bpm</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-purple-500" />
              <span>{resident.upcoming_appointments || 0} Termine</span>
            </div>
          </div>

          {/* Quick Notes */}
          {resident.shift_notes && (
            <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
              <strong>Notiz:</strong> {resident.shift_notes.substring(0, 50)}...
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
