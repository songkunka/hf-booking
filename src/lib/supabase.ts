import { createClient } from "@supabase/supabase-js";

// These are PUBLIC credentials (anon key). They are safe to embed in client-side code.
// Supabase uses Row Level Security (RLS) to protect data.
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://iqktqhgnnivhygrytous.supabase.co";

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlxa3RxaGdubml2aHlncnl0b3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5NDg2MTEsImV4cCI6MjA5NTUyNDYxMX0.epILdTsggdB-rOZI5pPTvW0ofj7YAsZ0-WeIpWecuuA";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
