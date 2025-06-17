
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface MedicationLog {
  id: string;
  medication_id: string;
  administered_by: string;
  scheduled_time: string;
  actual_time?: string;
  completed: boolean;
  notes?: string;
  created_at: string;
}

export function useMedicationLogs(medicationId?: string, date?: string) {
  return useQuery({
    queryKey: ['medication-logs', medicationId, date],
    queryFn: async () => {
      try {
        let query = supabase
          .from('medication_logs')
          .select('*')
          .order('scheduled_time', { ascending: false });
        
        if (medicationId) {
          query = query.eq('medication_id', medicationId);
        }
        
        if (date) {
          const startOfDay = new Date(date);
          startOfDay.setHours(0, 0, 0, 0);
          const endOfDay = new Date(date);
          endOfDay.setHours(23, 59, 59, 999);
          
          query = query
            .gte('scheduled_time', startOfDay.toISOString())
            .lte('scheduled_time', endOfDay.toISOString());
        }
        
        const { data, error } = await query;
        
        if (error) {
          console.error('Error fetching medication logs:', error);
          throw error;
        }
        
        return data as MedicationLog[];
      } catch (error: any) {
        console.error('Error in useMedicationLogs:', error);
        throw error;
      }
    },
  });
}

export function useCreateMedicationLog() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (log: Omit<MedicationLog, 'id' | 'created_at'>) => {
      try {
        const { data, error } = await supabase
          .from('medication_logs')
          .insert([log])
          .select()
          .single();
        
        if (error) {
          console.error('Error creating medication log:', error);
          throw error;
        }
        
        return data;
      } catch (error: any) {
        console.error('Error in useCreateMedicationLog:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medication-logs'] });
    },
  });
}

export function useUpdateMedicationLog() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<MedicationLog> & { id: string }) => {
      try {
        const { data, error } = await supabase
          .from('medication_logs')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        
        if (error) {
          console.error('Error updating medication log:', error);
          throw error;
        }
        
        return data;
      } catch (error: any) {
        console.error('Error in useUpdateMedicationLog:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medication-logs'] });
    },
  });
}
