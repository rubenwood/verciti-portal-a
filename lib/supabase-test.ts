import { createClient } from '@supabase/supabase-js'

export const supabaseTest = createClient(
    process.env.SUPABASE_TEST_URL!,
    process.env.SUPABASE_TEST_SEC_KEY!,
)