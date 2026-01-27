import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'


export function createServerTestClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_TEST_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_TEST_ANON_KEY!
    );
}

export function createServerLiveClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
}

async function createClient(url: string, key: string) {
  const cookieStore = await cookies()

  return createServerClient(
    url,
    key,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}