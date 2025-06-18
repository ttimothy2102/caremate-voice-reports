
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QuickAction } from './types';

interface QuickActionsProps {
  onQuickActionClick: (action: QuickAction) => void;
  onDragStart: (action: QuickAction) => void;
  onDragEnd: () => void;
}

const quickActions: QuickAction[] = [
  { id: '1', title: 'Arzttermin', type: 'medical', defaultDuration: 60 },
  { id: '2', title: 'Therapie', type: 'therapy', defaultDuration: 45 },
  { id: '3', title: 'Medikation', type: 'medical', defaultDuration: 15 },
  { id: '4', title: 'Aktivität', type: 'social', defaultDuration: 90 }
];

export function QuickActions({ onQuickActionClick, onDragStart, onDragEnd }: QuickActionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Schnellaktionen</CardTitle>
        <p className="text-sm text-gray-600">Klicken Sie auf eine Aktion oder ziehen Sie sie in den Kalender</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {quickActions.map((action) => (
            <Button 
              key={action.id}
              variant="outline" 
              size="sm"
              className="cursor-grab active:cursor-grabbing"
              draggable
              onClick={() => onQuickActionClick(action)}
              onDragStart={() => onDragStart(action)}
              onDragEnd={onDragEnd}
            >
              {action.title}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
