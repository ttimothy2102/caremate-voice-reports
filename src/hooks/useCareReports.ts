
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface CareReport {
  id: string;
  resident_id: string;
  caregiver_id: string;
  physical_condition: string;
  mood: string;
  food_water_intake: string;
  medication_given: string;
  special_notes: string;
  voice_transcript: string;
  audio_file_url: string;
  created_at: string;
}

export function useCareReports(residentId?: string) {
  return useQuery({
    queryKey: ['care-reports', residentId],
    queryFn: async () => {
      let query = supabase
        .from('care_reports')
        .select(`
          *,
          residents(name),
          profiles(full_name)
        `)
        .order('created_at', { ascending: false });
      
      if (residentId) {
        query = query.eq('resident_id', residentId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching care reports:', error);
        throw error;
      }
      
      return data;
    },
  });
}

export function useCreateCareReport() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (report: Partial<CareReport>) => {
      const { data, error } = await supabase
        .from('care_reports')
        .insert([report])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['care-reports'] });
    },
  });
}
