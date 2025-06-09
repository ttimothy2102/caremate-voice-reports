import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { validateResident, sanitizeInput } from '@/utils/securityValidation';
import { logDataAccess } from '@/utils/securityLogger';

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
  // Neue erweiterte Felder
  first_name?: string;
  last_name?: string;
  birth_date?: string;
  gender?: string;
  nationality?: string;
  previous_address?: string;
  marital_status?: string;
  religion?: string;
  language?: string;
  emergency_relation?: string;
  legal_guardian?: string;
  guardian_scope?: string;
  guardian_contact?: string;
  advance_directive?: boolean;
  doctor?: string;
  doctor_address?: string;
  doctor_phone?: string;
  insurance_type?: string;
  diagnoses?: string;
  medications?: string;
  blood_pressure?: string;
  pulse?: string;
  blood_sugar?: string;
  temperature?: string;
  respiratory_rate?: string;
  height?: string;
  weight?: string;
  bmi?: string;
  mobility?: string;
  cognition?: string;
  communication?: string;
  nutrition?: string;
  incontinence?: string[];
  decubitus_risk?: boolean;
  fall_risk?: boolean;
  sleep_behavior?: string;
  psychological_state?: string;
  profession?: string;
  hobbies?: string;
  rituals?: string;
  music_preferences?: string;
  pet_connection?: string;
  aids?: string[];
  care_aids?: boolean;
  room_equipment?: string;
  nutrition_plan?: string;
  billing_carrier?: string;
  profile_image_url?: string;
  // Color coding fields for important notes
  shift_notes?: string;
  shift_notes_color?: string;
  care_deviations?: string;
  care_deviations_color?: string;
  medication_deviations?: string;
  medication_deviations_color?: string;
  emergency_medication?: string;
  care_situation?: string;
  hygiene_data?: string;
}

export function useResidents() {
  return useQuery({
    queryKey: ['residents'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('residents')
          .select('*')
          .order('name');
        
        if (error) {
          logDataAccess('READ', 'residents', undefined, false, error.message);
          throw error;
        }
        
        logDataAccess('READ', 'residents');
        return data as Resident[];
      } catch (error: any) {
        logDataAccess('READ', 'residents', undefined, false, error.message);
        throw error;
      }
    },
  });
}

export function useCreateResident() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (resident: Omit<Resident, 'id' | 'created_at' | 'updated_at'>) => {
      // Validate input data
      const validationErrors = validateResident(resident);
      if (validationErrors.length > 0) {
        const errorMessage = validationErrors.join(', ');
        logDataAccess('CREATE', 'residents', undefined, false, `Validation failed: ${errorMessage}`);
        throw new Error(`Validation failed: ${errorMessage}`);
      }
      
      // Sanitize string inputs
      const sanitizedResident = {
        ...resident,
        name: sanitizeInput(resident.name),
        first_name: resident.first_name ? sanitizeInput(resident.first_name) : undefined,
        last_name: resident.last_name ? sanitizeInput(resident.last_name) : undefined,
        room: resident.room ? sanitizeInput(resident.room) : undefined,
        emergency_contact: resident.emergency_contact ? sanitizeInput(resident.emergency_contact) : undefined,
        doctor: resident.doctor ? sanitizeInput(resident.doctor) : undefined,
      };
      
      try {
        const { data, error } = await supabase
          .from('residents')
          .insert([sanitizedResident])
          .select()
          .single();
        
        if (error) {
          logDataAccess('CREATE', 'residents', undefined, false, error.message);
          throw error;
        }
        
        logDataAccess('CREATE', 'residents', data.id);
        return data;
      } catch (error: any) {
        logDataAccess('CREATE', 'residents', undefined, false, error.message);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['residents'] });
    },
  });
}
