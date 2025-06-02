
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface DrugOrder {
  id: string;
  medication_id: string;
  ordered_by: string;
  quantity_ordered: number;
  order_date: string;
  expected_delivery: string;
  cost: number;
  status: string;
  supplier: string;
  notes: string;
}

export function useDrugOrders() {
  return useQuery({
    queryKey: ['drug-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('drug_orders')
        .select(`
          *,
          medications(drug_name)
        `)
        .order('order_date', { ascending: false });
      
      if (error) {
        console.error('Error fetching drug orders:', error);
        throw error;
      }
      
      return data as DrugOrder[];
    },
  });
}

export function useCreateDrugOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (order: Omit<DrugOrder, 'id'>) => {
      const { data, error } = await supabase
        .from('drug_orders')
        .insert([order])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drug-orders'] });
    },
  });
}
