
import React, { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Palette, AlertTriangle } from 'lucide-react';

interface ColorCodedEditorProps {
  value: string;
  onChange: (value: string, colorCode?: string) => void;
  placeholder?: string;
  rows?: number;
  autoColorCode?: boolean; // For automatic coloring of deviations
}

export function ColorCodedEditor({ 
  value, 
  onChange, 
  placeholder, 
  rows = 4,
  autoColorCode = false 
}: ColorCodedEditorProps) {
  const [selectedColor, setSelectedColor] = useState<string>('normal');
  
  const colors = [
    { key: 'normal', label: 'Normal', color: 'bg-gray-100 text-gray-800', value: '' },
    { key: 'important', label: 'Wichtig', color: 'bg-red-100 text-red-800', value: 'red' },
    { key: 'positive', label: 'Positiv', color: 'bg-green-100 text-green-800', value: 'green' },
    { key: 'attention', label: 'Achtung', color: 'bg-yellow-100 text-yellow-800', value: 'yellow' }
  ];

  const handleTextChange = (newValue: string) => {
    let colorCode = selectedColor === 'normal' ? undefined : colors.find(c => c.key === selectedColor)?.value;
    
    // Auto color-code deviations
    if (autoColorCode && newValue.trim()) {
      const deviationKeywords = ['abweichung', 'problem', 'schwierigkeit', 'komplikation', 'fehler'];
      const hasDeviation = deviationKeywords.some(keyword => 
        newValue.toLowerCase().includes(keyword)
      );
      if (hasDeviation) {
        colorCode = 'red';
        setSelectedColor('important');
      }
    }
    
    onChange(newValue, colorCode);
  };

  const currentColorStyle = colors.find(c => c.key === selectedColor);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Palette className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-600">Farbkodierung:</span>
        {colors.map((color) => (
          <Button
            key={color.key}
            size="sm"
            variant={selectedColor === color.key ? "default" : "outline"}
            onClick={() => setSelectedColor(color.key)}
            className={`text-xs ${selectedColor === color.key ? color.color : ''}`}
          >
            {color.label}
          </Button>
        ))}
      </div>
      
      <div className="relative">
        <Textarea
          value={value}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className={`${currentColorStyle?.color || ''} border-l-4 ${
            selectedColor === 'important' ? 'border-l-red-500' :
            selectedColor === 'positive' ? 'border-l-green-500' :
            selectedColor === 'attention' ? 'border-l-yellow-500' :
            'border-l-gray-300'
          }`}
        />
        {autoColorCode && selectedColor === 'important' && (
          <div className="absolute top-2 right-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </div>
        )}
      </div>
      
      {selectedColor !== 'normal' && (
        <Badge variant="outline" className={currentColorStyle?.color}>
          Diese Nachricht wird als {currentColorStyle?.label.toLowerCase()} markiert und der nächsten Schicht hervorgehoben angezeigt
        </Badge>
      )}
    </div>
  );
}
