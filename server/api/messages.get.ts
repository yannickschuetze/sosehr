import { useSupabaseAdmin } from '../utils/supabase'

export default defineEventHandler(async () => {
  try {
    const supabase = useSupabaseAdmin()
    const { data, error } = await supabase
      .from('messages')
      .select('id, text, dedication, created_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(60)

    if (error) throw error
    return data
  } catch (error: any) {
    if (error?.statusCode === 503) return []
    throw createError({ statusCode: 500, statusMessage: 'Der Raum konnte nicht geladen werden.' })
  }
})
