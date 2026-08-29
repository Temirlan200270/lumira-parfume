import { readFileSync, readdirSync } from 'node:fs'
import { extname, resolve } from 'node:path'
import { createClient } from '@supabase/supabase-js'

function loadEnvLocal(): void {
  const raw = readFileSync(resolve(process.cwd(), '.env.local'), 'utf8')
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq < 0) continue
    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (!process.env[key]) process.env[key] = value
  }
}

loadEnvLocal()

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const secret = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !secret) {
  throw new Error('Supabase env is missing')
}

const admin = createClient(url, secret, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const uploads: Array<{ fileName: string, match: (name: string) => boolean }> = [
  {
    fileName: 'thomas-kosmala-no-12-oud-douze.jpg',
    match: (name) => /kosmala|oud|douze/i.test(name),
  },
  {
    fileName: 'mancera-cedrat-boise.jpg',
    match: (name) => /cedrat/i.test(name),
  },
  {
    fileName: 'mancera-red-tobacco.jpg',
    match: (name) => /red\s*tobacco/i.test(name),
  },
]

const picturesDir = resolve(process.cwd(), 'pictures')
const localFiles = readdirSync(picturesDir).filter((name) => /\.(jpe?g|png|webp)$/i.test(name))

for (const upload of uploads) {
  const local = localFiles.find((name) => upload.match(name))
  if (!local) {
    throw new Error(`No local file for ${upload.fileName}`)
  }
  const body = readFileSync(resolve(picturesDir, local))
  const contentType = extname(local).toLowerCase() === '.png' ? 'image/png' : 'image/jpeg'
  const { error } = await admin.storage.from('product-images').upload(upload.fileName, body, {
    contentType,
    upsert: true,
  })
  if (error) throw new Error(`${upload.fileName}: ${error.message}`)
  console.info(`Uploaded ${local} -> ${upload.fileName}`)
}
