import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://imeundhhnmoiwukwtqtm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_Lsn0nLOpxpGlIY0939XW1g_P0cF5-zy";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
  },
});
