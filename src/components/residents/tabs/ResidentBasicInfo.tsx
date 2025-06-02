
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ExtendedResident } from '../ResidentsList';

interface ResidentBasicInfoProps {
  resident: ExtendedResident;
  onUpdate: (updates: Partial<ExtendedResident>) => void;
}

export function ResidentBasicInfo({ resident, onUpdate }: ResidentBasicInfoProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Persönliche Daten</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={resident.name}
              onChange={(e) => onUpdate({ name: e.target.value })}
            />
          </div>
          
          <div>
            <Label htmlFor="birth_date">Geburtsdatum</Label>
            <Input
              id="birth_date"
              type="date"
              value={resident.birth_date}
              onChange={(e) => onUpdate({ birth_date: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="room">Zimmer</Label>
            <Input
              id="room"
              value={resident.room}
              onChange={(e) => onUpdate({ room: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="admission_date">Aufnahmedatum</Label>
            <Input
              id="admission_date"
              type="date"
              value={resident.admission_date}
              onChange={(e) => onUpdate({ admission_date: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Pflege & Rechtliches</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="care_level">Pflegegrad</Label>
            <Select
              value={resident.care_level}
              onValueChange={(value) => onUpdate({ care_level: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pflegegrad wählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pflegegrad 1">Pflegegrad 1</SelectItem>
                <SelectItem value="Pflegegrad 2">Pflegegrad 2</SelectItem>
                <SelectItem value="Pflegegrad 3">Pflegegrad 3</SelectItem>
                <SelectItem value="Pflegegrad 4">Pflegegrad 4</SelectItem>
                <SelectItem value="Pflegegrad 5">Pflegegrad 5</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="care_law">Pflegerecht/Träger</Label>
            <Select
              value={resident.care_level} // Using as placeholder
              onValueChange={(value) => onUpdate({ care_level: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Träger wählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SGB XI">SGB XI (Pflegeversicherung)</SelectItem>
                <SelectItem value="SGB XII">SGB XII (Sozialhilfe)</SelectItem>
                <SelectItem value="Privat">Privat</SelectItem>
                <SelectItem value="Beihilfe">Beihilfe</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="health_status">Gesundheitszustand</Label>
            <Select
              value={resident.health_status}
              onValueChange={(value) => onUpdate({ health_status: value as any })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status wählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gut">Gut</SelectItem>
                <SelectItem value="bedenklich">Bedenklich</SelectItem>
                <SelectItem value="kritisch">Kritisch</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Kontakt & Notfall</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="emergency_contact">Notfallkontakt</Label>
            <Input
              id="emergency_contact"
              value={resident.emergency_contact}
              onChange={(e) => onUpdate({ emergency_contact: e.target.value })}
            />
          </div>
          
          <div>
            <Label htmlFor="emergency_phone">Notfall-Telefon</Label>
            <Input
              id="emergency_phone"
              value={resident.emergency_phone}
              onChange={(e) => onUpdate({ emergency_phone: e.target.value })}
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="medical_conditions">Medizinische Bedingungen</Label>
            <Textarea
              id="medical_conditions"
              value={resident.medical_conditions?.join(', ') || ''}
              onChange={(e) => onUpdate({ medical_conditions: e.target.value.split(', ') })}
              placeholder="Komma-getrennte Liste"
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="allergies">Allergien</Label>
            <Textarea
              id="allergies"
              value={resident.allergies?.join(', ') || ''}
              onChange={(e) => onUpdate({ allergies: e.target.value.split(', ') })}
              placeholder="Komma-getrennte Liste"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
