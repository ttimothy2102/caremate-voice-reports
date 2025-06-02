
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface VitalSign {
  id: string;
  resident_id: string;
  heart_rate: number;
  blood_pressure_systolic: number;
  blood_pressure_diastolic: number;
  temperature: number;
  oxygen_saturation: number;
  weight: number;
  source: string;
  recorded_at: string;
  created_at: string;
}

export function useVitalSigns(residentId?: string) {
  return useQuery({
    queryKey: ['vital-signs', residentId],
    queryFn: async () => {
      let query = supabase
        .from('vital_signs')
        .select('*')
        .order('recorded_at', { ascending: false });
      
      if (residentId) {
        query = query.eq('resident_id', residentId);
      }
      
      const { data, error } = await query.limit(100);
      
      if (error) {
        console.error('Error fetching vital signs:', error);
        throw error;
      }
      
      return data as VitalSign[];
    },
  });
}

export function useVitalSignsChart(residentId?: string) {
  return useQuery({
    queryKey: ['vital-signs-chart', residentId],
    queryFn: async () => {
      let query = supabase
        .from('vital_signs')
        .select('heart_rate, recorded_at')
        .order('recorded_at', { ascending: true });
      
      if (residentId) {
        query = query.eq('resident_id', residentId);
      }
      
      const { data, error } = await query.limit(24);
      
      if (error) throw error;
      
      return data.map(item => ({
        time: new Date(item.recorded_at).toLocaleTimeString('de-DE', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        value: item.heart_rate
      }));
    },
  });
}
