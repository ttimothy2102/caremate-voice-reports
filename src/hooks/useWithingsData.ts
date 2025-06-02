
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface WithingsData {
  id: string;
  resident_id: string;
  measurement_type: string;
  value: number;
  unit: string;
  measured_at: string;
  device_id: string;
  synced_at: string;
  created_at: string;
}

export function useWithingsData(residentId?: string) {
  return useQuery({
    queryKey: ['withings-data', residentId],
    queryFn: async () => {
      let query = supabase
        .from('withings_data')
        .select('*')
        .order('measured_at', { ascending: false });
      
      if (residentId) {
        query = query.eq('resident_id', residentId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching Withings data:', error);
        throw error;
      }
      
      return data as WithingsData[];
    },
  });
}

export function useCreateWithingsData() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Omit<WithingsData, 'id' | 'created_at' | 'synced_at'>) => {
      const { data: result, error } = await supabase
        .from('withings_data')
        .insert([data])
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['withings-data'] });
    },
  });
}
