
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExtendedResident } from '../ResidentsList';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { 
  ChevronDown, 
  Bandage, 
  Activity, 
  Utensils, 
  Droplets,
  Sparkles,
  RotateCcw,
  FileText,
  Upload
} from 'lucide-react';

interface ResidentDocumentationModulesProps {
  resident: ExtendedResident;
  onUpdate: (updates: Partial<ExtendedResident>) => void;
}

export function ResidentDocumentationModules({ resident, onUpdate }: ResidentDocumentationModulesProps) {
  const [openModules, setOpenModules] = useState<string[]>([]);

  const toggleModule = (module: string) => {
    setOpenModules(prev => 
      prev.includes(module) 
        ? prev.filter(m => m !== module)
        : [...prev, module]
    );
  };

  const documentationModules = [
    {
      id: 'wound',
      title: 'Wunddokumentation',
      icon: Bandage,
      color: 'text-red-500',
      content: 'Wunddokumentation und Heilungsverlauf wird hier erfasst.'
    },
    {
      id: 'vitals-history',
      title: 'Vitalwertverlauf',
      icon: Activity,
      color: 'text-blue-500',
      content: 'Langzeit-Vitalwerte und Trends werden hier angezeigt.'
    },
    {
      id: 'nutrition',
      title: 'Wasser- & Ernährungserfassung',
      icon: Utensils,
      color: 'text-green-500',
      content: 'Dokumentation der Nahrungs- und Flüssigkeitsaufnahme.'
    },
    {
      id: 'incontinence',
      title: 'Inkontinenzmanagement',
      icon: Droplets,
      color: 'text-cyan-500',
      content: 'Inkontinenz-Dokumentation und Maßnahmen.'
    },
    {
      id: 'hygiene',
      title: 'Hygienedaten',
      icon: Sparkles,
      color: 'text-purple-500',
      content: 'Hygienemaßnahmen und Körperpflege-Dokumentation.'
    },
    {
      id: 'mobility',
      title: 'Bewegung & Mobilität',
      icon: RotateCcw,
      color: 'text-orange-500',
      content: 'Mobilität, Physiotherapie und Bewegungsübungen.'
    },
    {
      id: 'medical-forms',
      title: 'Ärztliche Formulare / Arztberichte',
      icon: FileText,
      color: 'text-gray-600',
      content: 'Upload und Verwaltung ärztlicher Dokumente.'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="text-lg font-semibold text-gray-800 mb-4">
        Erweiterte Dokumentationsmodule für {resident.name}
      </div>
      
      {documentationModules.map((module) => (
        <Card key={module.id}>
          <Collapsible
            open={openModules.includes(module.id)}
            onOpenChange={() => toggleModule(module.id)}
          >
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                <CardTitle className="text-base flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <module.icon className={`w-5 h-5 ${module.color}`} />
                    {module.title}
                  </div>
                  <ChevronDown 
                    className={`w-4 h-4 transition-transform ${
                      openModules.includes(module.id) ? 'rotate-180' : ''
                    }`} 
                  />
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <CardContent className="pt-0">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600 mb-4">{module.content}</p>
                  
                  {module.id === 'medical-forms' ? (
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full">
                        <Upload className="w-4 h-4 mr-2" />
                        Dokument hochladen
                      </Button>
                      <div className="text-sm text-gray-500">
                        Unterstützte Formate: PDF, DOC, DOCX, JPG, PNG
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Button variant="outline" size="sm">
                        Neuen Eintrag hinzufügen
                      </Button>
                      <Button variant="ghost" size="sm">
                        Verlauf anzeigen
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      ))}
    </div>
  );
}
