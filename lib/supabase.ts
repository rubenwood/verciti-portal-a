import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

export const supabaseTest = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_TEST_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_TEST_ANON_KEY!,
)