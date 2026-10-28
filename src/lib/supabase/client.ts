import { createBrowserClient } from "@supabase/ssr";

/**
 * Creates a browser-side Supabase client
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://demo-appie.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "demo-anon-key";

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
