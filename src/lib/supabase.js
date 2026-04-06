import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.REACT_APP_SUPABASE_SERVICE_KEY;

// Cliente público — para lectura desde el sitio
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Cliente admin — para operaciones de escritura/borrado desde el dashboard
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
