'use client'

import { FormEvent, useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/browser'
import { AppStrings } from '@/lib/strings'

export default function AdminLoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const supabase = createSupabaseBrowserClient()
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (signInError) {
        setError(signInError.message)
        setLoading(false)
        return
      }
      window.location.assign('/admin')
    } catch {
      setError('Не удалось войти')
      setLoading(false)
    }
  }

  return (
    <main className="flex-1 pt-32 pb-20 px-6">
      <form onSubmit={onSubmit} className="max-w-sm mx-auto space-y-4">
        <h1 className="text-2xl font-light text-stone-900 mb-6">{AppStrings.admin.title}</h1>
        <label className="block space-y-2">
          <span className="text-[11px] tracking-[0.18em] uppercase text-stone-400">
            {AppStrings.admin.email}
          </span>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full h-12 px-3 border border-stone-200 text-sm focus:outline-none focus:border-stone-900"
          />
        </label>
        <label className="block space-y-2">
          <span className="text-[11px] tracking-[0.18em] uppercase text-stone-400">
            {AppStrings.admin.password}
          </span>
          <input
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full h-12 px-3 border border-stone-200 text-sm focus:outline-none focus:border-stone-900"
          />
        </label>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-stone-900 text-white text-[11px] tracking-[0.2em] uppercase"
        >
          {AppStrings.admin.login}
        </button>
      </form>
    </main>
  )
}
