import { createClient } from '@supabase/supabase-js';
import { AUTH_ENV } from './config.js';

const supabaseUrl = AUTH_ENV.supabaseUrl;
const supabaseAnonKey = AUTH_ENV.supabaseAnonKey;

export const hasSupabaseClient = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = hasSupabaseClient
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;
