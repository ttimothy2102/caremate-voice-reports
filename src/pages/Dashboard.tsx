
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResidentCard } from "@/components/dashboard/ResidentCard";
import { VitalsChart } from "@/components/dashboard/VitalsChart";
import { Search, Plus, AlertTriangle, FileText, Users, Heart } from 'lucide-react';

export function Dashboard() {
  const overviewStats = [
    { title: "Reports Today", value: "24", icon: FileText, color: "text-blue-600" },
    { title: "Active Residents", value: "48", icon: Users, color: "text-green-600" },
    { title: "Vital Alerts", value: "3", icon: AlertTriangle, color: "text-red-600" },
    { title: "Device Sync", value: "98%", icon: Heart, color: "text-purple-600" }
  ];

  const residents = [
    {
      id: "1",
      name: "Anna Müller",
      age: 79,
      room: "12A",
      careLevel: "Stufe 2",
      lastReport: "08:30",
      vitalsStatus: "normal" as const,
      hasAlerts: false
    },
    {
      id: "2", 
      name: "Hans Weber",
      age: 84,
      room: "15B",
      careLevel: "Stufe 3",
      lastReport: "09:15",
      vitalsStatus: "warning" as const,
      hasAlerts: true
    },
    {
      id: "3",
      name: "Maria Fischer",
      age: 76,
      room: "08C",
      careLevel: "Stufe 1",
      lastReport: "07:45",
      vitalsStatus: "normal" as const,
      hasAlerts: false
    }
  ];

  const heartRateData = [
    { time: "06:00", value: 72 },
    { time: "08:00", value: 75 },
    { time: "10:00", value: 78 },
    { time: "12:00", value: 82 },
    { time: "14:00", value: 76 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-caremate-gradient bg-clip-text text-transparent">
              CareMate
            </h1>
            <p className="text-sm text-gray-600">Management Dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Resident
            </Button>
            <div className="w-8 h-8 bg-caremate-gradient rounded-full"></div>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {overviewStats.map((stat, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Residents List */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Residents</h2>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <Input 
                    placeholder="Search residents..." 
                    className="w-64 pl-10"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {residents.map((resident) => (
                <ResidentCard 
                  key={resident.id}
                  resident={resident}
                  onClick={() => console.log('Open resident details')}
                />
              ))}
            </div>
          </div>

          {/* Vitals Overview */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Vitals Overview</h2>
            <div className="space-y-4">
              <VitalsChart 
                title="Heart Rate (BPM)"
                data={heartRateData}
                color="#29B6F6"
                unit="bpm"
              />
              
              <Card className="p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Recent Alerts</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-2 bg-red-50 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Hans Weber - High BP</p>
                      <p className="text-xs text-gray-600">15:30 - 145/95 mmHg</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-yellow-50 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Anna Müller - Missed Meal</p>
                      <p className="text-xs text-gray-600">12:00 - Lunch not completed</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
