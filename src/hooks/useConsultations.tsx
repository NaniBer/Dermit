import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type Consultation = Database['public']['Tables']['consultations']['Row'];

export const useConsultations = (status?: string) => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch consultations
  const fetchConsultations = async () => {
    if (!user) return;

    try {
      let query = supabase
        .from('consultations')
        .select('*')
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) throw error;
      setConsultations(data || []);
    } catch (error) {
      console.error('Error fetching consultations:', error);
      toast({
        title: "Error",
        description: "Failed to load consultations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;

    fetchConsultations();

    const channel = supabase
      .channel('consultations')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'consultations',
        },
        (payload) => {
          console.log('Consultation update:', payload);
          fetchConsultations(); // Refetch to get updated data
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    consultations,
    loading,
    refetch: fetchConsultations,
  };
};