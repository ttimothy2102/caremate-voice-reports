
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
      // For now, return mock data until the Supabase types are updated
      const mockSchedules: Schedule[] = [
        {
          id: '1',
          resident_id: 'sample-resident-1',
          title: 'Morning Medication',
          event_type: 'medical',
          start_time: '2025-06-03T08:00:00Z',
          end_time: '2025-06-03T08:30:00Z',
          recurring_pattern: 'daily',
          color_code: '#EF4444',
          description: 'Daily morning medication routine',
          assigned_staff: 'staff-1',
          completed: false,
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          resident_id: 'sample-resident-1',
          title: 'Physiotherapy',
          event_type: 'therapy',
          start_time: '2025-06-03T10:00:00Z',
          end_time: '2025-06-03T11:00:00Z',
          recurring_pattern: 'weekly',
          color_code: '#3B82F6',
          description: 'Weekly physiotherapy session',
          assigned_staff: 'staff-2',
          completed: false,
          created_at: new Date().toISOString(),
        },
        {
          id: '3',
          resident_id: 'sample-resident-2',
          title: 'Doctor Visit',
          event_type: 'medical',
          start_time: '2025-06-03T14:00:00Z',
          end_time: '2025-06-03T15:00:00Z',
          recurring_pattern: 'none',
          color_code: '#EF4444',
          description: 'Regular check-up',
          assigned_staff: 'staff-3',
          completed: false,
          created_at: new Date().toISOString(),
        },
        {
          id: '4',
          resident_id: 'sample-resident-3',
          title: 'Group Activity',
          event_type: 'social',
          start_time: '2025-06-03T16:00:00Z',
          end_time: '2025-06-03T17:00:00Z',
          recurring_pattern: 'daily',
          color_code: '#10B981',
          description: 'Afternoon social activities',
          assigned_staff: 'staff-4',
          completed: false,
          created_at: new Date().toISOString(),
        }
      ];

      if (residentId) {
        return mockSchedules.filter(schedule => schedule.resident_id === residentId);
      }
      
      return mockSchedules;
    },
  });
}

export function useCreateSchedule() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (schedule: Omit<Schedule, 'id' | 'created_at'>) => {
      // For now, simulate creating schedule
      console.log('Creating schedule:', schedule);
      
      const newSchedule: Schedule = {
        ...schedule,
        id: Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString(),
      };
      
      return newSchedule;
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
      // For now, simulate updating schedule
      console.log('Updating schedule:', id, updates);
      
      return { id, ...updates };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
    },
  });
}
