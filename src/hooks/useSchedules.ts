
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Schedule {
  id: string;
  resident_id: string;
  title: string;
  event_type: 'medical' | 'therapy' | 'social' | 'hygiene' | 'meal' | 'rest' | 'custom';
  start_time: string;
  end_time: string;
  recurring_pattern: 'none' | 'daily' | 'weekly' | 'monthly';
  color_code: string;
  description: string;
  assigned_staff: string;
  completed: boolean;
  created_at: string;
}

export function useSchedules(residentId?: string) {
  return useQuery({
    queryKey: ['schedules', residentId],
    queryFn: async () => {
      let query = supabase
        .from('schedules')
        .select(`
          *,
          residents(name),
          profiles(full_name)
        `)
        .order('start_time');
      
      if (residentId) {
        query = query.eq('resident_id', residentId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching schedules:', error);
        throw error;
      }
      
      return data as Schedule[];
    },
  });
}

export function useCreateSchedule() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (schedule: Omit<Schedule, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('schedules')
        .insert([schedule])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
    },
  });
}

export function useUpdateSchedule() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Schedule> & { id: string }) => {
      const { data, error } = await supabase
        .from('schedules')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
    },
  });
}
