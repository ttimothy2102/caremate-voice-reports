
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { validateResident, sanitizeInput } from '@/utils/securityValidation';
import { logDataAccess } from '@/utils/securityLogger';
import { Resident } from './useResidents';

export function useUpdateResident() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Resident> & { id: string }) => {
      // Validate input data
      const validationErrors = validateResident(updates as any);
      if (validationErrors.length > 0) {
        const errorMessage = validationErrors.join(', ');
        logDataAccess('UPDATE', 'residents', id, false, `Validation failed: ${errorMessage}`);
        throw new Error(`Validation failed: ${errorMessage}`);
      }
      
      // Sanitize string inputs
      const sanitizedUpdates = {
        ...updates,
        name: updates.name ? sanitizeInput(updates.name) : undefined,
        first_name: updates.first_name ? sanitizeInput(updates.first_name) : undefined,
        last_name: updates.last_name ? sanitizeInput(updates.last_name) : undefined,
        room: updates.room ? sanitizeInput(updates.room) : undefined,
        emergency_contact: updates.emergency_contact ? sanitizeInput(updates.emergency_contact) : undefined,
        doctor: updates.doctor ? sanitizeInput(updates.doctor) : undefined,
      };
      
      try {
        const { data, error } = await supabase
          .from('residents')
          .update(sanitizedUpdates)
          .eq('id', id)
          .select()
          .single();
        
        if (error) {
          logDataAccess('UPDATE', 'residents', id, false, error.message);
          throw error;
        }
        
        logDataAccess('UPDATE', 'residents', id);
        return data;
      } catch (error: any) {
        logDataAccess('UPDATE', 'residents', id, false, error.message);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['residents'] });
    },
  });
}
