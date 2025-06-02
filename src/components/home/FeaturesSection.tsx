
import React from 'react';
import { Card } from "@/components/ui/card";
import { Mic, Users, FileText, Heart } from 'lucide-react';

export function FeaturesSection() {
  const features = [
    {
      icon: Mic,
      title: "KI-Sprachtranskription",
      description: "Sprechen Sie natürlich über Pflegebeobachtungen und lassen Sie die KI strukturierte Berichte erstellen"
    },
    {
      icon: Users,
      title: "Bewohnerverwaltung",
      description: "Verwalten Sie alle Bewohnerinformationen, Medikationen und Pflegepläne an einem Ort"
    },
    {
      icon: FileText,
      title: "Intelligente Berichte",
      description: "Automatisch generierte Pflegeberichte mit strukturierten Daten für bessere Nachverfolgung"
    },
    {
      icon: Heart,
      title: "Vitalwerte-Monitoring",
      description: "Überwachen Sie Vitalwerte und erhalten Sie Benachrichtigungen bei kritischen Änderungen"
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h3 className="text-3xl font-bold text-gray-900 mb-4">
          Alles was Sie für moderne Pflege brauchen
        </h3>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          CareMate kombiniert modernste KI-Technologie mit intuitiver Benutzerführung 
          für effiziente Pflegedokumentation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {features.map((feature, index) => (
          <Card key={index} className="p-8 hover:shadow-lg transition-shadow border-0 bg-white/60 backdrop-blur-sm">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-caremate-gradient rounded-lg flex items-center justify-center">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900">{feature.title}</h4>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
