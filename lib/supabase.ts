import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hxxeflinbdcgilbrsdsp.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_eyS-HoBge-t5cl3nckyVVQ_Zizfepap';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Admin client (for server-side operations only)
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

