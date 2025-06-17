
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
      try {
        let query = supabase
          .from('schedules')
          .select('*')
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
      } catch (error: any) {
        console.error('Error in useSchedules:', error);
        throw error;
      }
    },
  });
}

export function useCreateSchedule() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (schedule: Omit<Schedule, 'id' | 'created_at'>) => {
      try {
        const { data, error } = await supabase
          .from('schedules')
          .insert([schedule])
          .select()
          .single();
        
        if (error) {
          console.error('Error creating schedule:', error);
          throw error;
        }
        
        return data;
      } catch (error: any) {
        console.error('Error in useCreateSchedule:', error);
        throw error;
      }
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
      try {
        const { data, error } = await supabase
          .from('schedules')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        
        if (error) {
          console.error('Error updating schedule:', error);
          throw error;
        }
        
        return data;
      } catch (error: any) {
        console.error('Error in useUpdateSchedule:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
    },
  });
}

export function useDeleteSchedule() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const { error } = await supabase
          .from('schedules')
          .delete()
          .eq('id', id);
        
        if (error) {
          console.error('Error deleting schedule:', error);
          throw error;
        }
        
        return id;
      } catch (error: any) {
        console.error('Error in useDeleteSchedule:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
    },
  });
}
