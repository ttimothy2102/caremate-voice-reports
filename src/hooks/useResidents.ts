
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Resident {
  id: string;
  name: string;
  age: number;
  room: string;
  care_level: string;
  admission_date: string;
  emergency_contact: string;
  emergency_phone: string;
  medical_conditions: string[];
  allergies: string[];
  created_at: string;
  updated_at: string;
}

export function useResidents() {
  return useQuery({
    queryKey: ['residents'],
    queryFn: async () => {
      console.log('Fetching residents...');
      const { data, error } = await supabase
        .from('residents')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching residents:', error);
        throw error;
      }
      
      console.log('Fetched residents:', data);
      return data as Resident[];
    },
  });
}

export function useCreateResident() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (resident: Omit<Resident, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('residents')
        .insert([resident])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['residents'] });
    },
  });
}
