import { createClient } from '@supabase/supabase-js'

export const useSupabaseAdmin = () => {
  const config = useRuntimeConfig()

  if (!config.public.supabaseUrl || !config.supabaseSecretKey) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Die Datenbank ist noch nicht verbunden.'
    })
  }

  return createClient(config.public.supabaseUrl, config.supabaseSecretKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  })
}
