import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://vihsrmhbzlejvueultdq.supabase.co";
const SUPABASE_KEY = "sb_publishable_HMy-TLDNjSGsWNrgFIRhHw_O_0wJjYb";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
