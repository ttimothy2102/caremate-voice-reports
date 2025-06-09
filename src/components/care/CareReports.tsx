
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus } from 'lucide-react';

interface CareReport {
  id: string;
  text: string;
  colorCode?: string;
  timestamp: string;
  author: string;
  type: string;
}

interface CareReportsProps {
  reports: CareReport[];
  onAddReport: () => void;
}

export function CareReports({ reports, onAddReport }: CareReportsProps) {
  const getReportColorStyle = (colorCode?: string) => {
    switch (colorCode) {
      case 'red': return 'border-l-red-500 bg-red-50';
      case 'green': return 'border-l-green-500 bg-green-50';
      case 'yellow': return 'border-l-yellow-500 bg-yellow-50';
      default: return 'border-l-blue-500 bg-blue-50';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-green-500" />
          Aktuelle Pflegeberichte
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {reports.map((report) => (
            <div key={report.id} className={`border-l-4 pl-4 py-2 ${getReportColorStyle(report.colorCode)}`}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-800">{report.text}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                    <span>{report.timestamp}</span>
                    <span>von {report.author}</span>
                    <Badge variant="outline" className="text-xs">
                      {report.type}
                    </Badge>
                    {report.colorCode && (
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          report.colorCode === 'red' ? 'bg-red-100 text-red-800' :
                          report.colorCode === 'green' ? 'bg-green-100 text-green-800' :
                          report.colorCode === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {report.colorCode === 'red' ? 'Wichtig' :
                         report.colorCode === 'green' ? 'Positiv' :
                         report.colorCode === 'yellow' ? 'Achtung' : 'Normal'}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <div className="text-center py-4">
            <Button variant="outline" size="sm" onClick={onAddReport}>
              <Plus className="w-4 h-4 mr-2" />
              Weiteren Pflegebericht hinzufügen
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
