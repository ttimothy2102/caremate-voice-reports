
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Save, X, User, Heart, FileText, Shield, Users, Home, FolderOpen } from 'lucide-react';

interface AddResidentDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddResidentDialog({ isOpen, onClose }: AddResidentDialogProps) {
  const [formData, setFormData] = useState({
    // Persönliche Daten
    firstName: '',
    lastName: '',
    birthDate: '',
    gender: '',
    nationality: '',
    previousAddress: '',
    maritalStatus: '',
    religion: '',
    language: '',
    
    // Kontaktpersonen
    emergencyContact: '',
    emergencyRelation: '',
    emergencyPhone: '',
    legalGuardian: '',
    guardianScope: '',
    guardianContact: '',
    advanceDirective: false,
    doctor: '',
    doctorAddress: '',
    doctorPhone: '',
    
    // Medizinische Daten
    careLevel: '',
    insuranceType: '',
    diagnoses: '',
    allergies: '',
    medications: '',
    bloodPressure: '',
    pulse: '',
    bloodSugar: '',
    temperature: '',
    respiratoryRate: '',
    height: '',
    weight: '',
    bmi: '',
    
    // Pflegerische Einschätzungen
    mobility: '',
    cognition: '',
    communication: '',
    nutrition: '',
    incontinence: [],
    decubitusRisk: false,
    fallRisk: false,
    sleepBehavior: '',
    psychologicalState: '',
    
    // Soziale Angaben
    profession: '',
    hobbies: '',
    rituals: '',
    musicPreferences: '',
    petConnection: '',
    
    // Versorgung
    aids: [],
    careAids: false,
    roomEquipment: '',
    nutritionPlan: '',
    billingCarrier: ''
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log('Saving resident data:', formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-semibold flex items-center gap-2">
              <User className="w-6 h-6" />
              Neuen Bewohner hinzufügen
            </DialogTitle>
            <div className="flex gap-2">
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 mr-2" />
                Speichern
              </Button>
              <Button variant="outline" onClick={onClose}>
                <X className="w-4 h-4 mr-2" />
                Abbrechen
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="personal" className="text-xs">
              <User className="w-4 h-4 mr-1" />
              Persönlich
            </TabsTrigger>
            <TabsTrigger value="contacts" className="text-xs">
              <Users className="w-4 h-4 mr-1" />
              Kontakte
            </TabsTrigger>
            <TabsTrigger value="medical" className="text-xs">
              <Heart className="w-4 h-4 mr-1" />
              Medizin
            </TabsTrigger>
            <TabsTrigger value="care" className="text-xs">
              <Shield className="w-4 h-4 mr-1" />
              Pflege
            </TabsTrigger>
            <TabsTrigger value="social" className="text-xs">
              <Users className="w-4 h-4 mr-1" />
              Sozial
            </TabsTrigger>
            <TabsTrigger value="infrastructure" className="text-xs">
              <Home className="w-4 h-4 mr-1" />
              Versorgung
            </TabsTrigger>
            <TabsTrigger value="documents" className="text-xs">
              <FolderOpen className="w-4 h-4 mr-1" />
              Dokumente
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Persönliche Daten */}
          <TabsContent value="personal" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Persönliche Daten</CardTitle>
                <CardDescription>Grundlegende Informationen zum Bewohner</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium">
                      Vorname <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="border-2 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium">
                      Nachname <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="border-2 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="birthDate" className="text-sm font-medium">
                      Geburtsdatum <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => handleInputChange('birthDate', e.target.value)}
                      className="border-2 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Geschlecht</Label>
                    <Select onValueChange={(value) => handleInputChange('gender', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Geschlecht wählen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Männlich</SelectItem>
                        <SelectItem value="female">Weiblich</SelectItem>
                        <SelectItem value="diverse">Divers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="nationality">Staatsangehörigkeit</Label>
                    <Input
                      id="nationality"
                      value={formData.nationality}
                      onChange={(e) => handleInputChange('nationality', e.target.value)}
                      placeholder="z.B. Deutsch"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Zivilstand</Label>
                    <Select onValueChange={(value) => handleInputChange('maritalStatus', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Zivilstand wählen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Ledig</SelectItem>
                        <SelectItem value="married">Verheiratet</SelectItem>
                        <SelectItem value="divorced">Geschieden</SelectItem>
                        <SelectItem value="widowed">Verwitwet</SelectItem>
                        <SelectItem value="partnership">Lebenspartnerschaft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="religion">Religion</Label>
                    <Input
                      id="religion"
                      value={formData.religion}
                      onChange={(e) => handleInputChange('religion', e.target.value)}
                      placeholder="z.B. Evangelisch, Katholisch"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="language">Muttersprache / Kommunikationssprache</Label>
                    <Input
                      id="language"
                      value={formData.language}
                      onChange={(e) => handleInputChange('language', e.target.value)}
                      placeholder="z.B. Deutsch, Türkisch"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="previousAddress">Anschrift vor Einzug</Label>
                  <Textarea
                    id="previousAddress"
                    value={formData.previousAddress}
                    onChange={(e) => handleInputChange('previousAddress', e.target.value)}
                    placeholder="Vollständige Adresse"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Profilbild</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Foto hochladen oder hierher ziehen</p>
                    <Button variant="outline" className="mt-2">Datei auswählen</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 2: Kontaktpersonen & rechtliche Betreuung */}
          <TabsContent value="contacts" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Kontaktpersonen & rechtliche Betreuung</CardTitle>
                <CardDescription>Notfallkontakte und rechtliche Vertreter</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Notfallkontakt</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContact">Name</Label>
                      <Input
                        id="emergencyContact"
                        value={formData.emergencyContact}
                        onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                        placeholder="Vollständiger Name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyRelation">Beziehung</Label>
                      <Input
                        id="emergencyRelation"
                        value={formData.emergencyRelation}
                        onChange={(e) => handleInputChange('emergencyRelation', e.target.value)}
                        placeholder="z.B. Sohn, Tochter"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyPhone">Telefonnummer</Label>
                      <Input
                        id="emergencyPhone"
                        value={formData.emergencyPhone}
                        onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                        placeholder="+49 123 456789"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Gesetzlicher Betreuer</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="legalGuardian">Name</Label>
                      <Input
                        id="legalGuardian"
                        value={formData.legalGuardian}
                        onChange={(e) => handleInputChange('legalGuardian', e.target.value)}
                        placeholder="Name des Betreuers"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="guardianScope">Zuständigkeitsbereich</Label>
                      <Input
                        id="guardianScope"
                        value={formData.guardianScope}
                        onChange={(e) => handleInputChange('guardianScope', e.target.value)}
                        placeholder="z.B. Gesundheitssorge"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="guardianContact">Kontaktdaten</Label>
                      <Input
                        id="guardianContact"
                        value={formData.guardianContact}
                        onChange={(e) => handleInputChange('guardianContact', e.target.value)}
                        placeholder="Telefon / E-Mail"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="advanceDirective"
                      checked={formData.advanceDirective}
                      onCheckedChange={(checked) => handleInputChange('advanceDirective', checked)}
                    />
                    <Label htmlFor="advanceDirective">Vorsorgevollmacht / Patientenverfügung vorhanden</Label>
                  </div>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <span className="text-sm font-medium">Dokumente hochladen</span>
                    </div>
                    <Button variant="outline" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Dateien auswählen
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Hausarzt / Facharzt</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="doctor">Name</Label>
                      <Input
                        id="doctor"
                        value={formData.doctor}
                        onChange={(e) => handleInputChange('doctor', e.target.value)}
                        placeholder="Dr. Mustermann"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="doctorAddress">Adresse</Label>
                      <Input
                        id="doctorAddress"
                        value={formData.doctorAddress}
                        onChange={(e) => handleInputChange('doctorAddress', e.target.value)}
                        placeholder="Praxisadresse"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="doctorPhone">Telefonnummer</Label>
                      <Input
                        id="doctorPhone"
                        value={formData.doctorPhone}
                        onChange={(e) => handleInputChange('doctorPhone', e.target.value)}
                        placeholder="Praxis-Telefon"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 3: Medizinische Daten */}
          <TabsContent value="medical" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Medizinische Daten</CardTitle>
                <CardDescription>Pflegegrad, Diagnosen und aktuelle Vitalwerte</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Pflegegrad</Label>
                    <Select onValueChange={(value) => handleInputChange('careLevel', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pflegegrad wählen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pg1">Pflegegrad 1</SelectItem>
                        <SelectItem value="pg2">Pflegegrad 2</SelectItem>
                        <SelectItem value="pg3">Pflegegrad 3</SelectItem>
                        <SelectItem value="pg4">Pflegegrad 4</SelectItem>
                        <SelectItem value="pg5">Pflegegrad 5</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Pflegeversicherungstyp</Label>
                    <Select onValueChange={(value) => handleInputChange('insuranceType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Versicherungstyp wählen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sgb11">SGB XI</SelectItem>
                        <SelectItem value="private">Privat</SelectItem>
                        <SelectItem value="other">Sonstige</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="diagnoses">Diagnosen</Label>
                  <Textarea
                    id="diagnoses"
                    value={formData.diagnoses}
                    onChange={(e) => handleInputChange('diagnoses', e.target.value)}
                    placeholder="Aktuelle Diagnosen..."
                    className="min-h-[100px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="allergies">Allergien / Unverträglichkeiten</Label>
                  <Textarea
                    id="allergies"
                    value={formData.allergies}
                    onChange={(e) => handleInputChange('allergies', e.target.value)}
                    placeholder="Bekannte Allergien und Unverträglichkeiten..."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="medications">Medikation</Label>
                  <Textarea
                    id="medications"
                    value={formData.medications}
                    onChange={(e) => handleInputChange('medications', e.target.value)}
                    placeholder="Aktuelle Medikation (Dauer- und Bedarfsmedikation)..."
                    className="min-h-[100px]"
                  />
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Impfstatus</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="covidVaccine" />
                      <Label htmlFor="covidVaccine">COVID-19</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="fluVaccine" />
                      <Label htmlFor="fluVaccine">Influenza</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="tetanusVaccine" />
                      <Label htmlFor="tetanusVaccine">Tetanus</Label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Aktuelle Vitalwerte</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bloodPressure">Blutdruck</Label>
                      <Input
                        id="bloodPressure"
                        value={formData.bloodPressure}
                        onChange={(e) => handleInputChange('bloodPressure', e.target.value)}
                        placeholder="120/80"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pulse">Puls</Label>
                      <Input
                        id="pulse"
                        value={formData.pulse}
                        onChange={(e) => handleInputChange('pulse', e.target.value)}
                        placeholder="70"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bloodSugar">Blutzucker</Label>
                      <Input
                        id="bloodSugar"
                        value={formData.bloodSugar}
                        onChange={(e) => handleInputChange('bloodSugar', e.target.value)}
                        placeholder="95"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="temperature">Körpertemperatur</Label>
                      <Input
                        id="temperature"
                        value={formData.temperature}
                        onChange={(e) => handleInputChange('temperature', e.target.value)}
                        placeholder="36.5"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="respiratoryRate">Atemfrequenz</Label>
                      <Input
                        id="respiratoryRate"
                        value={formData.respiratoryRate}
                        onChange={(e) => handleInputChange('respiratoryRate', e.target.value)}
                        placeholder="16"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="height">Größe (cm)</Label>
                      <Input
                        id="height"
                        value={formData.height}
                        onChange={(e) => handleInputChange('height', e.target.value)}
                        placeholder="170"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight">Gewicht (kg)</Label>
                      <Input
                        id="weight"
                        value={formData.weight}
                        onChange={(e) => handleInputChange('weight', e.target.value)}
                        placeholder="75"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bmi">BMI</Label>
                      <Input
                        id="bmi"
                        value={formData.bmi}
                        onChange={(e) => handleInputChange('bmi', e.target.value)}
                        placeholder="25.0"
                        disabled
                        className="bg-gray-100"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 4: Pflegerische Einschätzungen */}
          <TabsContent value="care" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Pflegerische Einschätzungen & Maßnahmen</CardTitle>
                <CardDescription>Bewertung des Pflegebedarfs und Risikofaktoren</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Mobilität</Label>
                    <Select onValueChange={(value) => handleInputChange('mobility', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Mobilität wählen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mobile">Gehfähig</SelectItem>
                        <SelectItem value="walker">Mit Gehhilfe</SelectItem>
                        <SelectItem value="wheelchair">Rollstuhl</SelectItem>
                        <SelectItem value="bedridden">Bettlägerig</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Kognition</Label>
                    <Select onValueChange={(value) => handleInputChange('cognition', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Kognitive Verfassung" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="oriented">Orientiert</SelectItem>
                        <SelectItem value="confused">Verwirrt</SelectItem>
                        <SelectItem value="dementia">Dementiell verändert</SelectItem>
                        <SelectItem value="severely-impaired">Schwer beeinträchtigt</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Kommunikation</Label>
                    <Select onValueChange={(value) => handleInputChange('communication', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Kommunikationsfähigkeit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="limited">Eingeschränkt</SelectItem>
                        <SelectItem value="interpreter">Dolmetscher nötig</SelectItem>
                        <SelectItem value="non-verbal">Non-verbal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Ernährung</Label>
                    <Select onValueChange={(value) => handleInputChange('nutrition', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Ernährungsform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="soft">Weiche Kost</SelectItem>
                        <SelectItem value="pureed">Passierte Kost</SelectItem>
                        <SelectItem value="peg">PEG-Sonde</SelectItem>
                        <SelectItem value="parenteral">Parenteral</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label className="text-base font-semibold">Inkontinenz</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="urinaryIncontinence" />
                      <Label htmlFor="urinaryIncontinence">Harninkontinenz</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="fecalIncontinence" />
                      <Label htmlFor="fecalIncontinence">Stuhlinkontinenz</Label>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="decubitusRisk"
                      checked={formData.decubitusRisk}
                      onCheckedChange={(checked) => handleInputChange('decubitusRisk', checked)}
                    />
                    <Label htmlFor="decubitusRisk">Dekubitusrisiko vorhanden</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="fallRisk"
                      checked={formData.fallRisk}
                      onCheckedChange={(checked) => handleInputChange('fallRisk', checked)}
                    />
                    <Label htmlFor="fallRisk">Sturzrisiko vorhanden</Label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sleepBehavior">Schlafverhalten</Label>
                  <Textarea
                    id="sleepBehavior"
                    value={formData.sleepBehavior}
                    onChange={(e) => handleInputChange('sleepBehavior', e.target.value)}
                    placeholder="Beschreibung des Schlafverhaltens..."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Psychischer Zustand</Label>
                  <Select onValueChange={(value) => handleInputChange('psychologicalState', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Psychische Verfassung" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stable">Stabil</SelectItem>
                      <SelectItem value="anxious">Ängstlich</SelectItem>
                      <SelectItem value="depressed">Depressiv</SelectItem>
                      <SelectItem value="agitated">Unruhig</SelectItem>
                      <SelectItem value="aggressive">Aggressiv</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Wunddokumentation</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <Button variant="outline" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Wundfotos hochladen
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 5: Soziale & biografische Angaben */}
          <TabsContent value="social" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Soziale & biografische Angaben</CardTitle>
                <CardDescription>Persönlicher Hintergrund und Vorlieben</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="profession">Beruflicher Hintergrund</Label>
                  <Input
                    id="profession"
                    value={formData.profession}
                    onChange={(e) => handleInputChange('profession', e.target.value)}
                    placeholder="Erlernter Beruf / Berufstätigkeit"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="hobbies">Hobbys / Interessen</Label>
                  <Textarea
                    id="hobbies"
                    value={formData.hobbies}
                    onChange={(e) => handleInputChange('hobbies', e.target.value)}
                    placeholder="Frühere und aktuelle Hobbys..."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rituals">Rituale oder Gewohnheiten</Label>
                  <Textarea
                    id="rituals"
                    value={formData.rituals}
                    onChange={(e) => handleInputChange('rituals', e.target.value)}
                    placeholder="Wichtige Rituale und Gewohnheiten..."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="musicPreferences">Musik-/Filmvorlieben</Label>
                  <Textarea
                    id="musicPreferences"
                    value={formData.musicPreferences}
                    onChange={(e) => handleInputChange('musicPreferences', e.target.value)}
                    placeholder="Bevorzugte Musik und Filme..."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="petConnection">Tierhaltung oder Tierbindung</Label>
                  <Textarea
                    id="petConnection"
                    value={formData.petConnection}
                    onChange={(e) => handleInputChange('petConnection', e.target.value)}
                    placeholder="Haustiere oder besondere Verbindung zu Tieren..."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 6: Versorgung & Infrastruktur */}
          <TabsContent value="infrastructure" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Versorgung & Infrastruktur</CardTitle>
                <CardDescription>Hilfsmittel und Versorgungsstrukturen</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-base font-semibold">Hilfsmittel</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="rollator" />
                      <Label htmlFor="rollator">Rollator</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="hearingAid" />
                      <Label htmlFor="hearingAid">Hörgerät</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="prosthesis" />
                      <Label htmlFor="prosthesis">Prothese</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="glasses" />
                      <Label htmlFor="glasses">Brille</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="cane" />
                      <Label htmlFor="cane">Gehstock</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="wheelchair" />
                      <Label htmlFor="wheelchair">Rollstuhl</Label>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="careAids"
                    checked={formData.careAids}
                    onCheckedChange={(checked) => handleInputChange('careAids', checked)}
                  />
                  <Label htmlFor="careAids">Pflegehilfsmittel beantragt/vorhanden</Label>
                </div>
                
                <div className="space-y-2">
                  <Label>Ausstattung des Zimmers</Label>
                  <Select onValueChange={(value) => handleInputChange('roomEquipment', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Zimmerausstattung wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Einzelzimmer</SelectItem>
                      <SelectItem value="double">Doppelzimmer</SelectItem>
                      <SelectItem value="accessible">Behindertengerecht</SelectItem>
                      <SelectItem value="balcony">Mit Balkon</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="nutritionPlan">Ernährungsplan oder Sonderkost</Label>
                  <Textarea
                    id="nutritionPlan"
                    value={formData.nutritionPlan}
                    onChange={(e) => handleInputChange('nutritionPlan', e.target.value)}
                    placeholder="Spezielle Ernährungsanforderungen..."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Abrechnungsträger</Label>
                  <Select onValueChange={(value) => handleInputChange('billingCarrier', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Abrechnungsträger wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="health-insurance">Krankenkasse</SelectItem>
                      <SelectItem value="care-insurance">Pflegekasse</SelectItem>
                      <SelectItem value="private">Privat</SelectItem>
                      <SelectItem value="social-services">Sozialamt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 7: Dokumentenupload */}
          <TabsContent value="documents" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Dokumentenupload</CardTitle>
                <CardDescription>Upload wichtiger Dokumente und Unterlagen</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Ärztliche Unterlagen</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Arztbriefe, Befunde</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        <Upload className="w-4 h-4 mr-2" />
                        Hochladen
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Betreuungsdokumente</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Betreuungsbeschluss</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        <Upload className="w-4 h-4 mr-2" />
                        Hochladen
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Impfpass</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Impfausweis</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        <Upload className="w-4 h-4 mr-2" />
                        Hochladen
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Medikationsplan</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Aktueller Medikationsplan</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        <Upload className="w-4 h-4 mr-2" />
                        Hochladen
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Pflegeüberleitungsbogen</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Übergabedokumentation</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        <Upload className="w-4 h-4 mr-2" />
                        Hochladen
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Sonstige Dokumente</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Weitere wichtige Unterlagen</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        <Upload className="w-4 h-4 mr-2" />
                        Hochladen
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Hinweise zum Dokumentenupload</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Unterstützte Formate: PDF, JPG, PNG</li>
                    <li>• Maximale Dateigröße: 10 MB pro Datei</li>
                    <li>• Alle Dokumente werden verschlüsselt gespeichert</li>
                    <li>• Datenschutz gemäß DSGVO gewährleistet</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
