import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || 'https://onouxbiwzovtwkueyrnn.supabase.co';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_fd11qwM94g3q8uip0GDOqA_KYxgJ9-R';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
