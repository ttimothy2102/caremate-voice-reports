
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, Users, FileText, Heart, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (user) {
    navigate('/mobile-home');
    return null;
  }

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-caremate-gradient rounded-full"></div>
            <h1 
              className="text-2xl font-bold bg-caremate-gradient bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigate('/')}
            >
              CareMate
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => navigate('/auth')}>
              Anmelden
            </Button>
            <Button 
              onClick={() => navigate('/auth')} 
              className="liquid-gradient-button text-white border-0 relative overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              Registrieren
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-5xl font-bold text-gray-900 leading-tight">
              Intelligente Pflege
              <span className="block bg-caremate-gradient bg-clip-text text-transparent">
                mit KI-Unterstützung
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Revolutionieren Sie Ihre Pflegedokumentation mit KI-gestützter Sprachtranskription 
              und intelligenter Berichtserstellung für Pflegeheime.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="liquid-gradient-button text-white border-0 relative overflow-hidden transition-all duration-300 hover:shadow-lg text-lg px-8 py-6"
              onClick={() => navigate('/auth')}
            >
              Kostenlos starten
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-6"
              onClick={() => navigate('/dashboard')}
            >
              Demo ansehen
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
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

      {/* CTA Section */}
      <section className="bg-caremate-gradient text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h3 className="text-3xl font-bold mb-4">
            Bereit für intelligente Pflegedokumentation?
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Starten Sie noch heute und erleben Sie, wie KI Ihre Pflegearbeit vereinfacht.
          </p>
          <Button 
            size="lg" 
            className="liquid-gradient-button-inverse text-primary border-0 relative overflow-hidden transition-all duration-300 hover:shadow-lg text-lg px-8 py-6"
            onClick={() => navigate('/auth')}
          >
            Jetzt kostenlos testen
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div 
            className="flex items-center justify-center gap-3 mb-4 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate('/')}
          >
            <div className="w-6 h-6 bg-caremate-gradient rounded-full"></div>
            <span className="text-xl font-semibold">CareMate</span>
          </div>
          <p className="text-gray-400">
            © 2025 CareMate. Alle Rechte vorbehalten.
          </p>
        </div>
      </footer>

      <style jsx>{`
        .liquid-gradient-button {
          background: linear-gradient(135deg, #2D2CAB 0%, #29B6F6 50%, #2D2CAB 100%);
          background-size: 200% 200%;
          animation: liquidGradient 3s ease-in-out infinite;
        }
        
        .liquid-gradient-button:hover {
          animation: liquidGradientHover 0.8s ease-in-out infinite;
          transform: translateY(-2px);
        }
        
        .liquid-gradient-button-inverse {
          background: linear-gradient(135deg, #ffffff 0%, #f0f9ff 50%, #ffffff 100%);
          background-size: 200% 200%;
          animation: liquidGradient 3s ease-in-out infinite;
        }
        
        .liquid-gradient-button-inverse:hover {
          animation: liquidGradientHover 0.8s ease-in-out infinite;
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(255, 255, 255, 0.3);
        }
        
        @keyframes liquidGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes liquidGradientHover {
          0% { background-position: 0% 50%; }
          25% { background-position: 100% 0%; }
          50% { background-position: 100% 100%; }
          75% { background-position: 0% 100%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};

export default Index;
