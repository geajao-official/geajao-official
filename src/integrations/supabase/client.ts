import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://cbkytofseyhcqskkmxhj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_kdxuZ2qlZ0c92R_8RhHkng_z47u8RF1";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
