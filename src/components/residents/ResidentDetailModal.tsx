
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExtendedResident } from './ResidentsList';
import { ResidentBasicInfo } from './tabs/ResidentBasicInfo';
import { ResidentVitalSigns } from './tabs/ResidentVitalSigns';
import { ResidentCareInfo } from './tabs/ResidentCareInfo';
import { ResidentDocumentationModules } from './tabs/ResidentDocumentationModules';
import { ResidentSchedule } from './tabs/ResidentSchedule';
import { ResidentMedications } from './tabs/ResidentMedications';
import { Save, X } from 'lucide-react';

interface ResidentDetailModalProps {
  resident: ExtendedResident;
  isOpen: boolean;
  onClose: () => void;
  onSave: (resident: ExtendedResident) => void;
}

export function ResidentDetailModal({ 
  resident, 
  isOpen, 
  onClose, 
  onSave 
}: ResidentDetailModalProps) {
  const [editedResident, setEditedResident] = useState<ExtendedResident>(resident);

  const handleSave = () => {
    onSave(editedResident);
  };

  const updateResident = (updates: Partial<ExtendedResident>) => {
    setEditedResident(prev => ({ ...prev, ...updates }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              {editedResident.name} - Bewohnerdetails
            </DialogTitle>
            <div className="flex gap-2">
              <Button onClick={handleSave} size="sm">
                <Save className="w-4 h-4 mr-2" />
                Speichern
              </Button>
              <Button variant="outline" onClick={onClose} size="sm">
                <X className="w-4 h-4 mr-2" />
                Schließen
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="medications" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="medications">Medikamente</TabsTrigger>
            <TabsTrigger value="basic">Basisdaten</TabsTrigger>
            <TabsTrigger value="vitals">Vitalwerte</TabsTrigger>
            <TabsTrigger value="care">Pflege</TabsTrigger>
            <TabsTrigger value="docs">Dokumentation</TabsTrigger>
            <TabsTrigger value="schedule">Termine</TabsTrigger>
          </TabsList>

          <TabsContent value="medications" className="mt-6">
            <ResidentMedications 
              resident={editedResident}
              onUpdate={updateResident}
            />
          </TabsContent>

          <TabsContent value="basic" className="mt-6">
            <ResidentBasicInfo 
              resident={editedResident}
              onUpdate={updateResident}
            />
          </TabsContent>

          <TabsContent value="vitals" className="mt-6">
            <ResidentVitalSigns 
              resident={editedResident}
              onUpdate={updateResident}
            />
          </TabsContent>

          <TabsContent value="care" className="mt-6">
            <ResidentCareInfo 
              resident={editedResident}
              onUpdate={updateResident}
            />
          </TabsContent>

          <TabsContent value="docs" className="mt-6">
            <ResidentDocumentationModules 
              resident={editedResident}
              onUpdate={updateResident}
            />
          </TabsContent>

          <TabsContent value="schedule" className="mt-6">
            <ResidentSchedule 
              resident={editedResident}
              onUpdate={updateResident}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
