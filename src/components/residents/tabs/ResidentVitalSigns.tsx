
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExtendedResident } from '../ResidentsList';
import { ResidentVitalSignsChart } from '../ResidentVitalSignsChart';
import { Activity, Heart, Thermometer, Wind, Scale, Droplets, TrendingUp } from 'lucide-react';

interface ResidentVitalSignsProps {
  resident: ExtendedResident;
  onUpdate: (updates: Partial<ExtendedResident>) => void;
}

export function ResidentVitalSigns({ resident, onUpdate }: ResidentVitalSignsProps) {
  return (
    <div className="space-y-6">
      {/* Vital Signs Charts */}
      <ResidentVitalSignsChart residentId={resident.id} residentName={resident.name} />
      
      {/* Current Values Input Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-green-500" />
          Aktuelle Werte eingeben
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" />
                Blutdruck & Puls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="blood_pressure">Blutdruck (mmHg)</Label>
                <Input
                  id="blood_pressure"
                  value={resident.blood_pressure || ''}
                  onChange={(e) => onUpdate({ blood_pressure: e.target.value })}
                  placeholder="120/80"
                />
              </div>
              
              <div>
                <Label htmlFor="pulse">Puls (bpm)</Label>
                <Input
                  id="pulse"
                  value={resident.pulse || ''}
                  onChange={(e) => onUpdate({ pulse: e.target.value })}
                  placeholder="72"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Thermometer className="w-5 h-5 text-orange-500" />
                Temperatur & Atmung
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="temperature">Körpertemperatur (°C)</Label>
                <Input
                  id="temperature"
                  value={resident.temperature || ''}
                  onChange={(e) => onUpdate({ temperature: e.target.value })}
                  placeholder="36.5"
                />
              </div>
              
              <div>
                <Label htmlFor="respiratory_rate">Atemfrequenz (/min)</Label>
                <Input
                  id="respiratory_rate"
                  value={resident.respiratory_rate || ''}
                  onChange={(e) => onUpdate({ respiratory_rate: e.target.value })}
                  placeholder="16"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Scale className="w-5 h-5 text-green-500" />
                Körperwerte
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="blood_sugar">Blutzucker (mg/dl)</Label>
                <Input
                  id="blood_sugar"
                  value={resident.blood_sugar || ''}
                  onChange={(e) => onUpdate({ blood_sugar: e.target.value })}
                  placeholder="100"
                />
              </div>
              
              <div>
                <Label htmlFor="bmi">BMI</Label>
                <Input
                  id="bmi"
                  value={resident.bmi || ''}
                  onChange={(e) => onUpdate({ bmi: e.target.value })}
                  placeholder="22.5"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Droplets className="w-5 h-5 text-blue-400" />
                Vitalversorgung & Kennzahlen
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="energy_consumption">Energieverbrauch (kcal)</Label>
                <Input
                  id="energy_consumption"
                  type="number"
                  value={resident.energy_consumption}
                  onChange={(e) => onUpdate({ energy_consumption: parseInt(e.target.value) })}
                  placeholder="1800"
                />
              </div>
              
              <div>
                <Label htmlFor="energy_requirement">Energiebedarf (kcal)</Label>
                <Input
                  id="energy_requirement"
                  type="number"
                  value={resident.energy_requirement}
                  onChange={(e) => onUpdate({ energy_requirement: parseInt(e.target.value) })}
                  placeholder="2000"
                />
              </div>
              
              <div>
                <Label htmlFor="water_intake">Wasserzufuhr (ml)</Label>
                <Input
                  id="water_intake"
                  type="number"
                  value={resident.water_intake}
                  onChange={(e) => onUpdate({ water_intake: parseInt(e.target.value) })}
                  placeholder="2000"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
