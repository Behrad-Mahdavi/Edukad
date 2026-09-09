import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ebofcxfajhbomzqyysxl.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVib2ZjeGZhamhib216cXl5c3hsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg5ODQzMzksImV4cCI6MjEwNDU2MDMzOX0.tEV2JGgQIoNDOnecJEtR8RNbth6srt38PnSUx4sH-l4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});
