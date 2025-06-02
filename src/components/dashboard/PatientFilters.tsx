
import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from 'lucide-react';

interface PatientFiltersProps {
  searchName: string;
  onSearchNameChange: (value: string) => void;
  roomFilter: string;
  onRoomFilterChange: (value: string) => void;
  careLevelFilter: string;
  onCareLevelFilterChange: (value: string) => void;
  availableRooms: string[];
  availableCareLevels: string[];
}

export function PatientFilters({
  searchName,
  onSearchNameChange,
  roomFilter,
  onRoomFilterChange,
  careLevelFilter,
  onCareLevelFilterChange,
  availableRooms,
  availableCareLevels
}: PatientFiltersProps) {
  return (
    <div className="flex gap-4 mb-4 flex-wrap">
      <div className="relative flex-1 min-w-64">
        <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
        <Input 
          placeholder="Search by name..." 
          value={searchName}
          onChange={(e) => onSearchNameChange(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <Select value={roomFilter} onValueChange={onRoomFilterChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Filter by room" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Rooms</SelectItem>
          {availableRooms.map(room => (
            <SelectItem key={room} value={room}>Room {room}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={careLevelFilter} onValueChange={onCareLevelFilterChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Filter by care level" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Care Levels</SelectItem>
          {availableCareLevels.map(level => (
            <SelectItem key={level} value={level}>{level}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
