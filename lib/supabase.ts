import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Supabase client dla użycia w API routes (server-side)
export function createSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials not found. Using fallback to file storage.');
    return null;
  }
  
  return createClient(supabaseUrl, supabaseAnonKey);
}

// Klucze dla ustawień w bazie danych
export const SETTINGS_KEYS = {
  PRODUCT_SETTINGS: 'productSettings',
  GLOBAL_COMMISSION: 'globalCommission',
} as const;

