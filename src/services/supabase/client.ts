import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

type SupabaseConfig = {
  url: string;
  anonKey: string;
};

const expoConfig = Constants.expoConfig?.extra as { supabase?: SupabaseConfig } | undefined;

const supabaseUrl = expoConfig?.supabase?.url ?? process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey =
  expoConfig?.supabase?.anonKey ?? process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase credentials are missing. Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.',
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    detectSessionInUrl: false,
  },
});
