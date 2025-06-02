
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from '@/components/ui/use-toast';

interface TranscriptEditorProps {
  transcript: string;
  onTranscriptUpdate: (updatedTranscript: string) => void;
}

export function TranscriptEditor({ transcript, onTranscriptUpdate }: TranscriptEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editableTranscript, setEditableTranscript] = useState(transcript);

  const handleSaveEdit = () => {
    onTranscriptUpdate(editableTranscript);
    setIsEditing(false);
    
    toast({
      title: "Transkription gespeichert",
      description: "Die bearbeitete Transkription wurde gespeichert.",
    });
  };

  if (!transcript) return null;

  return (
    <Card className="p-4 bg-blue-50 border-blue-200">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-blue-900">KI-Transkription:</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Abbrechen' : 'Bearbeiten'}
        </Button>
      </div>
      
      {isEditing ? (
        <div className="space-y-3">
          <Textarea
            value={editableTranscript}
            onChange={(e) => setEditableTranscript(e.target.value)}
            className="min-h-[120px] text-blue-800"
            placeholder="Transkription bearbeiten..."
          />
          <Button
            onClick={handleSaveEdit}
            className="w-full"
          >
            Änderungen speichern
          </Button>
        </div>
      ) : (
        <p className="text-blue-800 text-sm leading-relaxed whitespace-pre-wrap">{transcript}</p>
      )}
    </Card>
  );
}
