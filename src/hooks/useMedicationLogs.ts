
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface MedicationLog {
  id: string;
  medication_id: string;
  administered_by: string;
  scheduled_time: string;
  actual_time: string;
  completed: boolean;
  notes: string;
  created_at: string;
}

export function useMedicationLogs(residentId?: string) {
  return useQuery({
    queryKey: ['medication-logs', residentId],
    queryFn: async () => {
      let query = supabase
        .from('medication_logs')
        .select(`
          *,
          medications!inner(resident_id)
        `)
        .order('scheduled_time', { ascending: false });
      
      if (residentId) {
        query = query.eq('medications.resident_id', residentId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching medication logs:', error);
        throw error;
      }
      
      return data as MedicationLog[];
    },
  });
}

export function useCreateMedicationLog() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (log: Omit<MedicationLog, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('medication_logs')
        .insert([log])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medication-logs'] });
    },
  });
}
