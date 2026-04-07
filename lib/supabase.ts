import { createClient } from '@supabase/supabase-js'

export const supabaseMain = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: { storageKey: "sb-live" }
  }
)

export const supabaseTest = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_TEST_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_TEST_ANON_KEY!,
  {
    auth: { storageKey: "sb-test" }
  }
)


export const supabaseMainApple = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: { storageKey: "sb-live", autoRefreshToken: false,
    persistSession: false, }
  }
)

export const supabaseTestApple = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_TEST_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_TEST_ANON_KEY!,
  {
    auth: { storageKey: "sb-test", autoRefreshToken: false,
    persistSession: false, }
  }
)