import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { validateCareReport, sanitizeInput } from '@/utils/securityValidation';
import { logDataAccess } from '@/utils/securityLogger';

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
      try {
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
          logDataAccess('READ', 'care_reports', residentId, false, error.message);
          throw error;
        }
        
        logDataAccess('READ', 'care_reports', residentId);
        return data;
      } catch (error: any) {
        logDataAccess('READ', 'care_reports', residentId, false, error.message);
        throw error;
      }
    },
  });
}

export function useCreateCareReport() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (report: Partial<CareReport>) => {
      // Validate input data
      const validationErrors = validateCareReport(report);
      if (validationErrors.length > 0) {
        const errorMessage = validationErrors.join(', ');
        logDataAccess('CREATE', 'care_reports', undefined, false, `Validation failed: ${errorMessage}`);
        throw new Error(`Validation failed: ${errorMessage}`);
      }
      
      // Sanitize string inputs
      const sanitizedReport = {
        ...report,
        physical_condition: report.physical_condition ? sanitizeInput(report.physical_condition) : undefined,
        mood: report.mood ? sanitizeInput(report.mood) : undefined,
        food_water_intake: report.food_water_intake ? sanitizeInput(report.food_water_intake) : undefined,
        medication_given: report.medication_given ? sanitizeInput(report.medication_given) : undefined,
        special_notes: report.special_notes ? sanitizeInput(report.special_notes) : undefined,
        voice_transcript: report.voice_transcript ? sanitizeInput(report.voice_transcript) : undefined,
      };
      
      try {
        const { data, error } = await supabase
          .from('care_reports')
          .insert([sanitizedReport])
          .select()
          .single();
        
        if (error) {
          logDataAccess('CREATE', 'care_reports', undefined, false, error.message);
          throw error;
        }
        
        logDataAccess('CREATE', 'care_reports', data.id);
        return data;
      } catch (error: any) {
        logDataAccess('CREATE', 'care_reports', undefined, false, error.message);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['care-reports'] });
    },
  });
}
