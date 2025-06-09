
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { VitalsChart } from "@/components/dashboard/VitalsChart";
import { useResidents } from '@/hooks/useResidents';
import { Heart, Activity, Thermometer, Gauge, AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Mock vital signs data for demonstration
const generateVitalData = () => {
  const times = Array.from({ length: 12 }, (_, i) => {
    const hour = Math.floor(i * 2);
    return `${hour.toString().padStart(2, '0')}:00`;
  });
  
  return times.map(time => ({
    time,
    value: 70 + Math.random() * 30
  }));
};

const temperatureData = generateVitalData().map(item => ({
  ...item,
  value: 36 + Math.random() * 2
}));

const bloodPressureData = generateVitalData().map(item => ({
  ...item,
  value: 120 + Math.random() * 40
}));

const oxygenData = generateVitalData().map(item => ({
  ...item,
  value: 95 + Math.random() * 5
}));

function VitalsContent() {
  const navigate = useNavigate();
  const { data: residents = [] } = useResidents();

  const vitalAlerts = [
    {
      resident: "Maria Schmidt",
      room: "12A",
      alert: "Erhöhte Herzfrequenz",
      severity: "warning",
      time: "vor 15 Min",
      value: "95 bpm"
    },
    {
      resident: "Hans Mueller",
      room: "8B",
      alert: "Niedriger Blutdruck",
      severity: "critical",
      time: "vor 5 Min",
      value: "90/50 mmHg"
    },
    {
      resident: "Anna Weber",
      room: "15C",
      alert: "Normale Werte",
      severity: "normal",
      time: "vor 30 Min",
      value: "Alle Werte im Normalbereich"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-300 bg-red-50';
      case 'warning': return 'border-yellow-300 bg-yellow-50';
      case 'normal': return 'border-green-300 bg-green-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'warning': return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'normal': return <CheckCircle className="w-5 h-5 text-green-500" />;
      default: return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader 
        title="Vitalwerte Übersicht" 
        onTitleClick={() => navigate('/mobile-home')}
      />
      
      <div className="p-6 space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Aktive Alarme</p>
                <p className="text-2xl font-bold text-red-600">2</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Überwacht</p>
                <p className="text-2xl font-bold text-blue-600">{residents.length}</p>
              </div>
              <Heart className="w-8 h-8 text-blue-500" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Normal</p>
                <p className="text-2xl font-bold text-green-600">{residents.length - 2}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Geräte Online</p>
                <p className="text-2xl font-bold text-purple-600">98%</p>
              </div>
              <Activity className="w-8 h-8 text-purple-500" />
            </div>
          </Card>
        </div>

        {/* Vital Alerts */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Aktuelle Vitalwert-Meldungen
          </h3>
          <div className="space-y-3">
            {vitalAlerts.map((alert, index) => (
              <Card 
                key={index}
                className={`p-4 cursor-pointer hover:shadow-md transition-shadow ${getSeverityColor(alert.severity)}`}
                onClick={() => navigate('/residents')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getSeverityIcon(alert.severity)}
                    <div>
                      <h4 className="font-semibold text-gray-800">{alert.resident}</h4>
                      <p className="text-sm text-gray-600">Zimmer {alert.room} • {alert.alert}</p>
                      <p className="text-xs text-gray-500">{alert.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm text-gray-800">{alert.value}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Vital Signs Charts */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" />
            Tagesverlauf - Durchschnittswerte
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <VitalsChart 
                title="Herzfrequenz (Ø)"
                data={generateVitalData()}
                color="#EF4444"
                unit="bpm"
              />
            </Card>

            <Card>
              <VitalsChart 
                title="Körpertemperatur (Ø)"
                data={temperatureData}
                color="#F97316"
                unit="°C"
              />
            </Card>

            <Card>
              <VitalsChart 
                title="Blutdruck Systolisch (Ø)"
                data={bloodPressureData}
                color="#3B82F6"
                unit="mmHg"
              />
            </Card>

            <Card>
              <VitalsChart 
                title="Sauerstoffsättigung (Ø)"
                data={oxygenData}
                color="#8B5CF6"
                unit="%"
              />
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Schnellaktionen</h3>
          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="h-16"
              onClick={() => navigate('/residents')}
            >
              <div className="text-center">
                <Heart className="w-6 h-6 mx-auto mb-1 text-red-500" />
                <span className="text-sm">Bewohner Details</span>
              </div>
            </Button>

            <Button 
              variant="outline" 
              className="h-16"
              onClick={() => navigate('/dashboard')}
            >
              <div className="text-center">
                <TrendingUp className="w-6 h-6 mx-auto mb-1 text-blue-500" />
                <span className="text-sm">Dashboard</span>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Vitals() {
  return (
    <ProtectedRoute>
      <VitalsContent />
    </ProtectedRoute>
  );
}
