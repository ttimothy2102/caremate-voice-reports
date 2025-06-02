
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
      // For now, return mock data until the Supabase types are updated
      // This will be replaced with real data once the types include withings_data table
      const mockData: WithingsData[] = [
        {
          id: '1',
          resident_id: residentId || 'sample-resident-id',
          measurement_type: 'heart_rate',
          value: 72,
          unit: 'bpm',
          measured_at: new Date().toISOString(),
          device_id: 'withings-device-1',
          synced_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          resident_id: residentId || 'sample-resident-id',
          measurement_type: 'weight',
          value: 68.5,
          unit: 'kg',
          measured_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          device_id: 'withings-device-2',
          synced_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
        },
        {
          id: '3',
          resident_id: residentId || 'sample-resident-id',
          measurement_type: 'steps',
          value: 8420,
          unit: 'steps',
          measured_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          device_id: 'withings-device-3',
          synced_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
        }
      ];

      if (residentId) {
        return mockData.filter(item => item.resident_id === residentId);
      }
      
      return mockData;
    },
  });
}

export function useCreateWithingsData() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Omit<WithingsData, 'id' | 'created_at' | 'synced_at'>) => {
      // For now, simulate creating data
      // This will be replaced with real Supabase insert once types are updated
      console.log('Creating Withings data:', data);
      
      const newItem: WithingsData = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        synced_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };
      
      return newItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['withings-data'] });
    },
  });
}
