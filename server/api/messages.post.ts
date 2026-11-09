import { useSupabaseAdmin } from '../utils/supabase'

type MessagePayload = {
  text?: string
  dedication?: string
}

export default defineEventHandler(async (event) => {
  const body = await readBody<MessagePayload>(event)
  const text = body.text?.replace(/\s+/g, ' ').trim()
  const dedication = body.dedication?.replace(/\s+/g, ' ').trim()

  if (!text || text.length > 700 || (dedication && dedication.length > 80)) {
    throw createError({ statusCode: 400, statusMessage: 'Bitte prüfe die Länge deiner Nachricht.' })
  }

  const supabase = useSupabaseAdmin()
  const { error } = await supabase.from('messages').insert({
    text,
    dedication: dedication || null,
    status: 'pending'
  })

  if (error) {
    throw createError({ statusCode: 500, statusMessage: 'Deine Nachricht konnte nicht gespeichert werden.' })
  }

  setResponseStatus(event, 201)
  return { ok: true }
})
