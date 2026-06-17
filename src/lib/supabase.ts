import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://emmqksusyknnvxgypzxs.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseAnonKey && import.meta.env.DEV) {
    console.error('Missing Supabase Anon Key. Check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
