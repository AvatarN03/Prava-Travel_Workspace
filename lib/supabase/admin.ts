import { createClient } from "@supabase/supabase-js";

/**
 * Creates an administrative Supabase client using the server-only secret / service-role key.
 * This client bypasses RLS and can execute admin auth commands like deleteUser().
 * STRICT RULE: Only use in verified server-side Server Actions or Route Handlers. Never export to client.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey =
    process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !secretKey) {
    throw new Error(
      "Missing Supabase admin environment variables (NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY)."
    );
  }

  return createClient(supabaseUrl, secretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
