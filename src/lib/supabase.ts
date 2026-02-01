
import { createClient } from '@supabase/supabase-js';

// Use environment variables or fall back to placeholders to prevent crashes during development
// The app checks for valid sessions, so placeholders won't grant access but will stop the 'URL required' error.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
