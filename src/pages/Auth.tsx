import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { Loader2, Heart, CheckCircle, AlertCircle, CreditCard } from "lucide-react";

interface AuthFormData {
  email: string;
  password: string;
  fullName?: string;
}

export function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  const form = useForm<AuthFormData>({
    defaultValues: {
      email: "",
      password: "",
      fullName: ""
    }
  });

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const onSubmit = async (data: AuthFormData) => {
    setLoading(true);
    setEmailSent(false);
    
    try {
      let result;
      if (isSignUp) {
        result = await signUp(data.email, data.password, data.fullName);
      } else {
        result = await signIn(data.email, data.password);
      }

      if (result.error) {
        if (result.error.message.includes('Invalid login credentials')) {
          toast({
            title: "Anmeldung fehlgeschlagen",
            description: "Ungültige E-Mail oder Passwort. Bitte versuchen Sie es erneut.",
            variant: "destructive"
          });
        } else if (result.error.message.includes('User already registered')) {
          toast({
            title: "Konto existiert bereits",
            description: "Diese E-Mail ist bereits registriert. Bitte melden Sie sich stattdessen an.",
            variant: "destructive"
          });
          setIsSignUp(false);
        } else if (result.error.message.includes('Email not confirmed')) {
          toast({
            title: "E-Mail nicht verifiziert",
            description: "Bitte überprüfen Sie Ihre E-Mail und klicken Sie auf den Verifizierungslink, bevor Sie sich anmelden.",
            variant: "destructive"
          });
        } else {
          toast({
            title: isSignUp ? "Registrierung fehlgeschlagen" : "Anmeldung fehlgeschlagen",
            description: result.error.message,
            variant: "destructive"
          });
        }
      } else {
        if (isSignUp) {
          setEmailSent(true);
          toast({
            title: "Konto erstellt",
            description: "Bitte überprüfen Sie Ihre E-Mail, um Ihr Konto zu verifizieren, bevor Sie sich anmelden.",
          });
        } else {
          toast({
            title: "Willkommen zurück!",
            description: "Erfolgreich angemeldet.",
          });
          navigate('/dashboard');
        }
      }
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-caremate-gradient flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-6 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Überprüfen Sie Ihre E-Mail</h2>
          <p className="text-gray-600 mb-4">
            Wir haben einen Verifizierungslink an <strong>{form.getValues('email')}</strong> gesendet
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Klicken Sie auf den Link in Ihrer E-Mail, um Ihr Konto zu verifizieren, und kehren Sie dann hierher zurück, um sich anzumelden.
          </p>
          <Button
            onClick={() => {
              setEmailSent(false);
              setIsSignUp(false);
              form.reset();
            }}
            variant="outline"
            className="w-full"
          >
            Zurück zur Anmeldung
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-caremate-gradient flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6">
        <div className="text-center mb-6">
          <div 
            className="flex items-center justify-center mb-4 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate('/')}
          >
            <Heart className="w-8 h-8 text-primary mr-2" />
            <h1 className="text-2xl font-bold text-primary">
              CareMate
            </h1>
          </div>
          <h2 className="text-xl font-semibold text-gray-800">
            {isSignUp ? 'Konto erstellen' : 'Willkommen zurück'}
          </h2>
          <p className="text-gray-600 text-sm">
            {isSignUp ? 'Der CareMate Plattform beitreten' : 'Melden Sie sich in Ihr Konto an'}
          </p>
        </div>

        {/* Trial Information */}
        {isSignUp && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <CreditCard className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">14-Tage kostenlose Testversion</p>
                <p>Eine Kreditkarte ist für die Testversion erforderlich. Sie können jederzeit kündigen.</p>
              </div>
            </div>
          </div>
        )}

        {/* Email verification notice */}
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">E-Mail-Verifizierung erforderlich</p>
              <p>Nach der Kontoerstellung überprüfen Sie Ihre E-Mail auf einen Verifizierungslink, bevor Sie sich anmelden.</p>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {isSignUp && (
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vollständiger Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Geben Sie Ihren vollständigen Namen ein" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-Mail</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Geben Sie Ihre E-Mail ein" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Passwort</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Geben Sie Ihr Passwort ein" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full bg-caremate-gradient" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isSignUp ? 'Konto erstellen' : 'Anmelden'}
            </Button>
          </form>
        </Form>

        <div className="text-center mt-4">
          <Button
            variant="ghost"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setEmailSent(false);
              form.reset();
            }}
            className="text-sm"
          >
            {isSignUp 
              ? 'Bereits ein Konto? Anmelden' 
              : "Noch kein Konto? Registrieren"
            }
          </Button>
        </div>
      </Card>
    </div>
  );
}
