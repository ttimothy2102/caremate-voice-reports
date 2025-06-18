
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Clock, User, AlertTriangle, Pill, Save } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

interface MedicationItem {
  id: string;
  drugName: string;
  dosage: string;
  residentName: string;
  residentRoom: string;
  scheduledTime: string;
  isOverdue: boolean;
  instructions?: string;
}

interface MedicationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  medications: MedicationItem[];
  showOverdueDetails?: boolean;
}

export function MedicationDetailsModal({ 
  isOpen, 
  onClose, 
  title, 
  medications, 
  showOverdueDetails = false 
}: MedicationDetailsModalProps) {
  const [comments, setComments] = useState<{ [key: string]: string }>({});

  const handleCommentChange = (medicationId: string, comment: string) => {
    setComments(prev => ({
      ...prev,
      [medicationId]: comment
    }));
  };

  const handleSaveComment = async (medication: MedicationItem) => {
    const comment = comments[medication.id];
    if (!comment?.trim()) {
      toast({
        title: "Kommentar erforderlich",
        description: "Bitte fügen Sie einen Kommentar hinzu.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Here you would typically save to database
      // For now, we'll simulate this and show a success message
      const reportText = `Medikament nicht verabreicht: ${medication.drugName} (${medication.dosage}) für ${medication.residentName}. Grund: ${comment}. Geplante Zeit: ${medication.scheduledTime}`;
      
      console.log('Adding to nursing report:', reportText);
      console.log('Adding to shift exchange:', reportText);
      
      toast({
        title: "Kommentar gespeichert",
        description: "Der Kommentar wurde zum Pflegebericht und zur Schichtübergabe hinzugefügt.",
      });

      // Clear the comment
      setComments(prev => ({
        ...prev,
        [medication.id]: ''
      }));
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Der Kommentar konnte nicht gespeichert werden.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pill className="w-5 h-5 text-blue-600" />
            {title}
            <Badge variant="outline" className="ml-2">
              {medications.length} Medikament{medications.length !== 1 ? 'e' : ''}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {medications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Pill className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Keine Medikamente gefunden</p>
            </div>
          ) : (
            medications.map((medication) => (
              <Card key={medication.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{medication.drugName}</h3>
                        <Badge variant="outline">{medication.dosage}</Badge>
                        {medication.isOverdue && (
                          <Badge variant="destructive">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Überfällig
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{medication.residentName}</span>
                          <span className="text-gray-400">•</span>
                          <span>Zimmer {medication.residentRoom}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>
                            {showOverdueDetails && medication.isOverdue 
                              ? `Sollte gegeben werden um: ${medication.scheduledTime}`
                              : `Geplant um: ${medication.scheduledTime}`
                            }
                          </span>
                        </div>
                      </div>

                      {medication.instructions && (
                        <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded">
                          <strong>Anweisungen:</strong> {medication.instructions}
                        </p>
                      )}
                    </div>
                  </div>

                  {showOverdueDetails && medication.isOverdue && (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        <Label htmlFor={`comment-${medication.id}`}>
                          Grund für nicht verabreichte Medikation
                        </Label>
                        <Textarea
                          id={`comment-${medication.id}`}
                          placeholder="Beschreiben Sie den Grund, warum die Medikation nicht verabreicht wurde..."
                          value={comments[medication.id] || ''}
                          onChange={(e) => handleCommentChange(medication.id, e.target.value)}
                          rows={3}
                        />
                        <Button 
                          size="sm" 
                          onClick={() => handleSaveComment(medication)}
                          className="w-full"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Kommentar speichern und zu Berichten hinzufügen
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={onClose}>
            Schließen
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
