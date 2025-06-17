
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ColorCodedEditor } from "@/components/ui/color-coded-editor";

interface CareReportFormProps {
  onSave: (reportText: string, reportColorCode?: string, selectedFiles?: FileList | null) => void;
}

export function CareReportForm({ onSave }: CareReportFormProps) {
  const [reportText, setReportText] = useState('');
  const [reportColorCode, setReportColorCode] = useState<string>();
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const handleSave = () => {
    onSave(reportText, reportColorCode, selectedFiles);
    setReportText('');
    setReportColorCode(undefined);
    setSelectedFiles(null);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="report-text">Pflegebericht</Label>
        <ColorCodedEditor
          value={reportText}
          onChange={(value, colorCode) => {
            setReportText(value);
            setReportColorCode(colorCode);
          }}
          placeholder="Beschreiben Sie die Pflegemaßnahmen, Beobachtungen und besondere Ereignisse..."
          rows={8}
        />
      </div>
      
      <div>
        <Label htmlFor="file-upload">Dateien anhängen (optional)</Label>
        <input
          id="file-upload"
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          onChange={(e) => setSelectedFiles(e.target.files)}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <p className="text-xs text-gray-500 mt-1">
          Unterstützte Formate: PDF, DOC, DOCX, JPG, PNG
        </p>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => window.location.reload()}>
          Abbrechen
        </Button>
        <Button onClick={handleSave}>
          Bericht speichern
        </Button>
      </div>
    </div>
  );
}
