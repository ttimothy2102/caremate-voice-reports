
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";
import { User, Mail, Lock, LogOut, Camera, Upload } from 'lucide-react';

interface AccountManagementProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AccountManagement({ open, onOpenChange }: AccountManagementProps) {
  const { user, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // Form states
  const [displayName, setDisplayName] = useState(user?.user_metadata?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    try {
      // Here you would implement the profile update logic
      toast({
        title: "Profil aktualisiert",
        description: "Ihre Profilinformationen wurden erfolgreich gespeichert.",
      });
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Profil konnte nicht aktualisiert werden.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateEmail = async () => {
    setIsLoading(true);
    try {
      // Here you would implement the email update logic
      toast({
        title: "E-Mail aktualisiert",
        description: "Ihre E-Mail-Adresse wurde erfolgreich geändert.",
      });
    } catch (error) {
      toast({
        title: "Fehler",
        description: "E-Mail konnte nicht aktualisiert werden.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Fehler",
        description: "Die Passwörter stimmen nicht überein.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Here you would implement the password update logic
      toast({
        title: "Passwort aktualisiert",
        description: "Ihr Passwort wurde erfolgreich geändert.",
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Passwort konnte nicht aktualisiert werden.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;
    
    setIsLoading(true);
    try {
      // Here you would implement the avatar upload logic
      toast({
        title: "Profilbild aktualisiert",
        description: "Ihr Profilbild wurde erfolgreich geändert.",
      });
      setAvatarFile(null);
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Profilbild konnte nicht aktualisiert werden.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    onOpenChange(false);
    toast({
      title: "Abgemeldet",
      description: "Sie wurden erfolgreich abgemeldet.",
    });
  };

  const userInitials = displayName
    ? displayName.split(' ').map(name => name[0]).join('').toUpperCase()
    : user?.email?.[0]?.toUpperCase() || 'U';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Konto verwalten</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="security">Sicherheit</TabsTrigger>
            <TabsTrigger value="account">Konto</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profilinformationen
                </CardTitle>
                <CardDescription>
                  Verwalten Sie Ihre persönlichen Informationen
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={avatarFile ? URL.createObjectURL(avatarFile) : user?.user_metadata?.avatar_url} />
                    <AvatarFallback className="text-lg">{userInitials}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                      className="hidden"
                      id="avatar-upload"
                    />
                    <Label htmlFor="avatar-upload" className="cursor-pointer">
                      <Button variant="outline" size="sm" asChild>
                        <span>
                          <Camera className="w-4 h-4 mr-2" />
                          Foto wählen
                        </span>
                      </Button>
                    </Label>
                    {avatarFile && (
                      <Button size="sm" onClick={handleAvatarUpload} disabled={isLoading}>
                        <Upload className="w-4 h-4 mr-2" />
                        Hochladen
                      </Button>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="displayName">Vollständiger Name</Label>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Ihr Name"
                  />
                </div>

                <Button onClick={handleUpdateProfile} disabled={isLoading}>
                  Profil speichern
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  E-Mail ändern
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="email">Neue E-Mail-Adresse</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="neue@email.com"
                  />
                </div>
                <Button onClick={handleUpdateEmail} disabled={isLoading}>
                  E-Mail aktualisieren
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Passwort ändern
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Aktuelles Passwort</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="newPassword">Neues Passwort</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Passwort bestätigen</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <Button onClick={handleUpdatePassword} disabled={isLoading}>
                  Passwort ändern
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Konto-Aktionen</CardTitle>
                <CardDescription>
                  Verwalten Sie Ihr Konto und Ihre Anmeldung
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg bg-gray-50">
                  <h4 className="font-medium mb-2">Aktuelle Anmeldung</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Angemeldet als: <strong>{displayName || user?.email}</strong>
                  </p>
                  <Button variant="outline" onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Abmelden
                  </Button>
                </div>

                <div className="p-4 border rounded-lg bg-blue-50">
                  <h4 className="font-medium mb-2">Konto wechseln</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Melden Sie sich mit einem anderen Konto an
                  </p>
                  <Button variant="outline" onClick={handleSignOut}>
                    Konto wechseln
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
