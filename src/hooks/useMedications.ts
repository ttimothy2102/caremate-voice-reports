
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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
      let query = supabase
        .from('medications')
        .select('*')
        .order('drug_name');
      
      if (residentId) {
        query = query.eq('resident_id', residentId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching medications:', error);
        throw error;
      }
      
      return data as Medication[];
    },
  });
}

export function useCreateMedication() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (medication: Omit<Medication, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('medications')
        .insert([medication])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications'] });
    },
  });
}
