
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Filter, FileText, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useCareReports } from '@/hooks/useCareReports';
import { getPersonalizedGreeting } from '@/utils/greetingUtils';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from '@/components/layout/Logo';

function TodaysReportsContent() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: allReports = [], isLoading } = useCareReports();
  const [filters, setFilters] = useState({
    resident: 'all',
    importance: 'all',
    search: ''
  });

  const userName = user?.user_metadata?.full_name;
  const greeting = getPersonalizedGreeting(userName);
  const userInitials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(' ').map((name: string) => name[0]).join('').toUpperCase()
    : user?.email?.[0]?.toUpperCase() || 'U';

  // Filter reports for today
  const today = new Date().toDateString();
  const todaysReports = allReports.filter(report => 
    new Date(report.created_at).toDateString() === today
  );

  // Apply filters
  const filteredReports = todaysReports.filter(report => {
    const matchesResident = filters.resident === 'all' || 
      (report.residents?.name || '').toLowerCase().includes(filters.resident.toLowerCase());
    
    const matchesSearch = report.special_notes?.toLowerCase().includes(filters.search.toLowerCase()) ||
      report.physical_condition?.toLowerCase().includes(filters.search.toLowerCase()) ||
      report.mood?.toLowerCase().includes(filters.search.toLowerCase());

    // Mock importance based on content keywords for demo
    const isImportant = report.special_notes?.toLowerCase().includes('wichtig') ||
      report.special_notes?.toLowerCase().includes('kritisch') ||
      report.physical_condition?.toLowerCase().includes('schlecht');
    
    const matchesImportance = filters.importance === 'all' ||
      (filters.importance === 'important' && isImportant) ||
      (filters.importance === 'normal' && !isImportant);

    return matchesResident && matchesSearch && matchesImportance;
  });

  const updateFilter = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  const getImportanceBadge = (report: any) => {
    const isImportant = report.special_notes?.toLowerCase().includes('wichtig') ||
      report.special_notes?.toLowerCase().includes('kritisch') ||
      report.physical_condition?.toLowerCase().includes('schlecht');
    
    return isImportant ? (
      <Badge className="bg-red-100 text-red-800 border-red-300">Wichtig</Badge>
    ) : (
      <Badge variant="outline">Normal</Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Berichte werden geladen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück
            </Button>
            <div>
              <h1 className="text-2xl font-bold bg-caremate-gradient bg-clip-text text-transparent">
                Heutige Berichte
              </h1>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date().toLocaleDateString('de-DE', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              {greeting}
            </span>
            <Avatar>
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
            <Logo />
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Filters */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Filter className="w-4 h-4" />
              Filteroptionen
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="space-y-2">
                <Label htmlFor="search">Suche</Label>
                <Input
                  id="search"
                  placeholder="Berichte durchsuchen..."
                  value={filters.search}
                  onChange={(e) => updateFilter('search', e.target.value)}
                />
              </div>
              
              {/* Resident Filter */}
              <div className="space-y-2">
                <Label>Bewohner</Label>
                <Select
                  value={filters.resident}
                  onValueChange={(value) => updateFilter('resident', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Bewohner wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle Bewohner</SelectItem>
                    {/* Get unique residents from today's reports */}
                    {Array.from(new Set(todaysReports.map(r => r.residents?.name).filter(Boolean))).map(name => (
                      <SelectItem key={name} value={name || ''}>{name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Importance Filter */}
              <div className="space-y-2">
                <Label>Wichtigkeit</Label>
                <Select
                  value={filters.importance}
                  onValueChange={(value) => updateFilter('importance', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Wichtigkeit wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle</SelectItem>
                    <SelectItem value="important">Wichtig</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Card>

        {/* Reports List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              Berichte ({filteredReports.length})
            </h2>
          </div>

          {filteredReports.length === 0 ? (
            <Card className="p-8 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {todaysReports.length === 0 
                  ? "Heute wurden noch keine Berichte erstellt."
                  : "Keine Berichte entsprechen den Filterkriterien."}
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredReports.map(report => (
                <Card key={report.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {report.residents?.name || 'Unbekannter Bewohner'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(report.created_at).toLocaleTimeString('de-DE', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })} • von {report.profiles?.full_name || 'Unbekannt'}
                      </p>
                    </div>
                    {getImportanceBadge(report)}
                  </div>

                  <div className="space-y-2">
                    {report.physical_condition && (
                      <div>
                        <span className="text-sm font-medium text-gray-700">Körperlicher Zustand: </span>
                        <span className="text-sm text-gray-600">{report.physical_condition}</span>
                      </div>
                    )}
                    
                    {report.mood && (
                      <div>
                        <span className="text-sm font-medium text-gray-700">Stimmung: </span>
                        <span className="text-sm text-gray-600">{report.mood}</span>
                      </div>
                    )}
                    
                    {report.food_water_intake && (
                      <div>
                        <span className="text-sm font-medium text-gray-700">Nahrungs-/Flüssigkeitsaufnahme: </span>
                        <span className="text-sm text-gray-600">{report.food_water_intake}</span>
                      </div>
                    )}
                    
                    {report.medication_given && (
                      <div>
                        <span className="text-sm font-medium text-gray-700">Medikamentengabe: </span>
                        <span className="text-sm text-gray-600">{report.medication_given}</span>
                      </div>
                    )}
                    
                    {report.special_notes && (
                      <div>
                        <span className="text-sm font-medium text-gray-700">Besondere Notizen: </span>
                        <span className="text-sm text-gray-600">{report.special_notes}</span>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function TodaysReports() {
  return (
    <ProtectedRoute>
      <TodaysReportsContent />
    </ProtectedRoute>
  );
}
