
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface WaitlistData {
  name: string;
  email: string;
  facilityName: string;
  facilitySize: string;
  phoneNumber: string;
}

export function useWaitlist() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const submitToWaitlist = async (data: WaitlistData) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('waitlist')
        .insert([
          {
            name: data.name,
            email: data.email,
            facility_name: data.facilityName,
            facility_size: data.facilitySize,
            phone_number: data.phoneNumber || null,
          }
        ]);

      if (error) throw error;

      toast({
        title: "Welcome to the waitlist!",
        description: "We'll be in touch soon with early access details.",
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error submitting to waitlist:', error);
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    submitToWaitlist,
    isLoading
  };
}
