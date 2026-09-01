'use client'

import { FormEvent, useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/browser'
import { AppStrings } from '@/lib/strings'
import AdminHeader from './AdminHeader'

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
    <>
      <AdminHeader />
      <main className="flex-1 px-4 pb-[max(5rem,env(safe-area-inset-bottom))] pt-10 sm:px-6">
      <form onSubmit={onSubmit} className="mx-auto max-w-sm space-y-4">
        <h1 className="mb-6 text-2xl font-light text-stone-900">{AppStrings.admin.title}</h1>
        <label className="block space-y-2">
          <span className="text-[11px] tracking-[0.18em] uppercase text-stone-400">
            {AppStrings.admin.email}
          </span>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            className="h-12 w-full border border-stone-200 px-3 text-base focus:border-stone-900 focus:outline-none md:text-sm"
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
            autoComplete="current-password"
            className="h-12 w-full border border-stone-200 px-3 text-base focus:border-stone-900 focus:outline-none md:text-sm"
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
    </>
  )
}
