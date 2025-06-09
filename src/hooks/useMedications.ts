import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { validateMedication, sanitizeInput } from '@/utils/securityValidation';
import { logDataAccess } from '@/utils/securityLogger';

export interface Medication {
  id: string;
  resident_id: string;
  drug_name: string;
  dosage: string;
  frequency: string;
  instructions: string;
  prescribed_by: string;
  start_date: string;
  end_date: string;
  stock_count: number;
  reorder_level: number;
  created_at: string;
}

export function useMedications(residentId?: string) {
  return useQuery({
    queryKey: ['medications', residentId],
    queryFn: async () => {
      try {
        let query = supabase
          .from('medications')
          .select('*')
          .order('drug_name');
        
        if (residentId) {
          query = query.eq('resident_id', residentId);
        }
        
        const { data, error } = await query;
        
        if (error) {
          logDataAccess('READ', 'medications', residentId, false, error.message);
          throw error;
        }
        
        logDataAccess('READ', 'medications', residentId);
        return data as Medication[];
      } catch (error: any) {
        logDataAccess('READ', 'medications', residentId, false, error.message);
        throw error;
      }
    },
  });
}

export function useCreateMedication() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (medication: Omit<Medication, 'id' | 'created_at'>) => {
      // Validate input data
      const validationErrors = validateMedication(medication);
      if (validationErrors.length > 0) {
        const errorMessage = validationErrors.join(', ');
        logDataAccess('CREATE', 'medications', undefined, false, `Validation failed: ${errorMessage}`);
        throw new Error(`Validation failed: ${errorMessage}`);
      }
      
      // Sanitize string inputs
      const sanitizedMedication = {
        ...medication,
        drug_name: sanitizeInput(medication.drug_name),
        dosage: sanitizeInput(medication.dosage),
        frequency: sanitizeInput(medication.frequency),
        instructions: medication.instructions ? sanitizeInput(medication.instructions) : undefined,
      };
      
      try {
        const { data, error } = await supabase
          .from('medications')
          .insert([sanitizedMedication])
          .select()
          .single();
        
        if (error) {
          logDataAccess('CREATE', 'medications', undefined, false, error.message);
          throw error;
        }
        
        logDataAccess('CREATE', 'medications', data.id);
        return data;
      } catch (error: any) {
        logDataAccess('CREATE', 'medications', undefined, false, error.message);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications'] });
    },
  });
}
