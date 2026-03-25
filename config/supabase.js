import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY } from "./index.js";

// Supabase client with anon key (for authenticated user-level requests)
const supabaseAuth = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Supabase client with service role key (for admin-level actions)
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export { supabaseAdmin, supabaseAuth };