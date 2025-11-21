import { createClient } from '@supabase/supabase-js'

export const supabasePrivateMain = createClient(
  process.env.SUPABASE_MAIN_URL!,
  process.env.SUPABASE_MAIN_SEC_KEY!,
)

export const supabaseTest = createClient(
    process.env.SUPABASE_TEST_URL!,
    process.env.SUPABASE_TEST_SEC_KEY!,
)