import { createClient } from "@supabase/supabase-js";

// Strictly hardcoded credentials to prevent ANY environment variable mismatch
const supabaseUrl = "https://iqktqhgnnivhygrytous.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlxa3RxaGdubml2aHlncnl0b3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5NDg2MTEsImV4cCI6MjA5NTUyNDYxMX0.epILdTsggdB-rOZI5pPTvW0ofj7YAsZ0-WeIpWecuuA";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: typeof window !== "undefined",
    detectSessionInUrl: false,
  }
});
