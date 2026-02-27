import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Confession } from '../types';

export function useConfessions() {
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) {
      setError('Supabase credentials are missing. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your secrets.');
      setIsLoading(false);
      return;
    }
    fetchConfessions();
  }, []);

  const fetchConfessions = async () => {
    if (!supabase) return;
    try {
      // First try to fetch with created_at ordering (standard Supabase column)
      const { data, error } = await supabase
        .from('just for fun')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      if (data) {
        setConfessions(data);
      }
    } catch (error) {
      console.error('Error fetching with created_at, falling back to unordered:', error);
      // Fallback if created_at doesn't exist in their table
      const { data: fallbackData } = await supabase
        .from('just for fun')
        .select('*');
      
      if (fallbackData) {
        setConfessions(fallbackData.reverse());
      }
    } finally {
      setIsLoading(false);
    }
  };

  const addConfession = async (text: string) => {
    if (!supabase) return;
    // Optimistic update
    const newConfession: Confession = { confessions: text, likes: 0, created_at: new Date().toISOString() };
    setConfessions(prev => [newConfession, ...prev]);

    const { error } = await supabase
      .from('just for fun')
      .insert([{ confessions: text, likes: 0 }]);

    if (error) {
      console.error('Error adding confession:', error);
      fetchConfessions(); // Revert on error
    } else {
      fetchConfessions(); // Refresh to get the actual ID
    }
  };

  const likeConfession = async (confession: Confession) => {
    if (!supabase) return;
    // Optimistic update
    setConfessions(prev => 
      prev.map(c => 
        (c.id === confession.id && c.confessions === confession.confessions) 
          ? { ...c, likes: c.likes + 1 } 
          : c
      )
    );

    // Update in DB
    // We match by id if it exists, otherwise fallback to matching the exact text
    const matchColumn = confession.id ? 'id' : 'confessions';
    const matchValue = confession.id ? confession.id : confession.confessions;

    const { error } = await supabase
      .from('just for fun')
      .update({ likes: confession.likes + 1 })
      .eq(matchColumn, matchValue);

    if (error) {
      console.error('Error liking confession:', error);
      fetchConfessions(); // Revert on error
    }
  };

  return { confessions, addConfession, likeConfession, isLoading, error };
}
