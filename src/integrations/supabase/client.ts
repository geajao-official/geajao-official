import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://wnszaohqcqawzjuunpdo.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_Pj76kS9KMRWjgb20reYWww_04dud3Pm";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
