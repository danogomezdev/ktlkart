import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
  )

  const { error } = await supabase.from('_ping').select('1').limit(1).maybeSingle()
  // La query puede fallar (tabla no existe) pero igual despierta la DB

  res.status(200).json({ ok: true, ts: new Date().toISOString() })
}