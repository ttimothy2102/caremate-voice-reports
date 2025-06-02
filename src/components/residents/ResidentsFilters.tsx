
import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Filter, Calendar, Heart } from 'lucide-react';
import { Label } from "@/components/ui/label";

interface FiltersProps {
  filters: {
    name: string;
    healthStatus: string;
    birthDate: string;
    upcomingAppointments: boolean;
  };
  onFiltersChange: (filters: any) => void;
}

export function ResidentsFilters({ filters, onFiltersChange }: FiltersProps) {
  const updateFilter = (key: string, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <Filter className="w-4 h-4" />
        Filteroptionen
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Name Filter */}
        <div className="space-y-2">
          <Label htmlFor="name-filter">Name</Label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <Input
              id="name-filter"
              placeholder="Name suchen..."
              value={filters.name}
              onChange={(e) => updateFilter('name', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Health Status Filter */}
        <div className="space-y-2">
          <Label>Gesundheitszustand</Label>
          <Select
            value={filters.healthStatus}
            onValueChange={(value) => updateFilter('healthStatus', value)}
          >
            <SelectTrigger>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                <SelectValue placeholder="Status wählen" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle</SelectItem>
              <SelectItem value="gut">Gut</SelectItem>
              <SelectItem value="bedenklich">Bedenklich</SelectItem>
              <SelectItem value="kritisch">Kritisch</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Birth Date Filter */}
        <div className="space-y-2">
          <Label htmlFor="birth-date">Geburtsdatum</Label>
          <div className="relative">
            <Calendar className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <Input
              id="birth-date"
              type="date"
              value={filters.birthDate}
              onChange={(e) => updateFilter('birthDate', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Upcoming Appointments Filter */}
        <div className="space-y-2">
          <Label>Bevorstehende Termine</Label>
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="appointments"
              checked={filters.upcomingAppointments}
              onCheckedChange={(checked) => updateFilter('upcomingAppointments', checked)}
            />
            <Label 
              htmlFor="appointments"
              className="text-sm font-normal cursor-pointer"
            >
              Nur mit Terminen
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
}
