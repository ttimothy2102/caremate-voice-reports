
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { Loader2, Heart, CheckCircle, AlertCircle } from "lucide-react";

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
            title: "Login Failed",
            description: "Invalid email or password. Please try again.",
            variant: "destructive"
          });
        } else if (result.error.message.includes('User already registered')) {
          toast({
            title: "Account Exists",
            description: "This email is already registered. Please sign in instead.",
            variant: "destructive"
          });
          setIsSignUp(false);
        } else if (result.error.message.includes('Email not confirmed')) {
          toast({
            title: "Email Not Verified",
            description: "Please check your email and click the verification link before signing in.",
            variant: "destructive"
          });
        } else {
          toast({
            title: isSignUp ? "Sign Up Failed" : "Sign In Failed",
            description: result.error.message,
            variant: "destructive"
          });
        }
      } else {
        if (isSignUp) {
          setEmailSent(true);
          toast({
            title: "Account Created",
            description: "Please check your email to verify your account before signing in.",
          });
        } else {
          toast({
            title: "Welcome back!",
            description: "Successfully signed in.",
          });
          navigate('/dashboard');
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
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
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Check Your Email</h2>
          <p className="text-gray-600 mb-4">
            We've sent a verification link to <strong>{form.getValues('email')}</strong>
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Click the link in your email to verify your account, then return here to sign in.
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
            Back to Sign In
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-caremate-gradient flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <Heart className="w-8 h-8 text-primary mr-2" />
            <h1 className="text-2xl font-bold bg-caremate-gradient bg-clip-text text-transparent">
              CareMate
            </h1>
          </div>
          <h2 className="text-xl font-semibold text-gray-800">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-gray-600 text-sm">
            {isSignUp ? 'Join the CareMate platform' : 'Sign in to your account'}
          </p>
        </div>

        {/* Email verification notice */}
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">Email Verification Required</p>
              <p>After creating an account, check your email for a verification link before signing in.</p>
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
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter your email" {...field} />
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter your password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full bg-caremate-gradient" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isSignUp ? 'Create Account' : 'Sign In'}
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
              ? 'Already have an account? Sign in' 
              : "Don't have an account? Sign up"
            }
          </Button>
        </div>
      </Card>
    </div>
  );
}
