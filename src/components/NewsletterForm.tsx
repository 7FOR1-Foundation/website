'use client'

import { useActionState, useEffect, useId, useRef } from 'react'

import { subscribe, type SubscribeState } from '@/app/(frontend)/actions'

import { MailIcon } from './icons'

const initial: SubscribeState = { status: 'idle', message: '' }

export function NewsletterForm({ source = 'home' }: { source?: string }) {
  const [state, action, pending] = useActionState(subscribe, initial)
  const id = useId()
  const inputId = `${id}-email`
  const messageId = `${id}-message`
  const successRef = useRef<HTMLParagraphElement>(null)

  // Keep keyboard and screen-reader users in place after submitting: back to
  // the email box when there is an error, onto the thank-you message on success.
  useEffect(() => {
    if (state.status === 'error') document.getElementById(inputId)?.focus()
    if (state.status === 'success') successRef.current?.focus()
  }, [state, inputId])

  if (state.status === 'success') {
    return (
      <p
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="mx-auto max-w-xl rounded-lg bg-white/10 px-6 py-4 text-lg font-semibold"
      >
        {state.message}
      </p>
    )
  }

  return (
    <form action={action} className="mx-auto w-full max-w-xl" noValidate>
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-0">
        <label htmlFor={inputId} className="sr-only">
          Email address
        </label>
        <div className="relative flex-1">
          <MailIcon className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-body" />
          <input
            id={inputId}
            name="email"
            type="email"
            autoComplete="email"
            required
            defaultValue={state.email}
            key={state.email ?? 'empty'}
            placeholder="Type email here"
            aria-invalid={state.status === 'error' || undefined}
            aria-describedby={messageId}
            className="h-12 w-full rounded-lg bg-white pr-3 pl-11 text-ink placeholder:text-body sm:rounded-r-none"
          />
        </div>
        <input type="hidden" name="source" value={source} />
        <div aria-hidden="true" className="hidden">
          <label>
            Website <input type="text" name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <button
          type="submit"
          disabled={pending}
          className="h-12 rounded-lg bg-brand-600 px-8 font-semibold text-white hover:bg-brand-700 disabled:opacity-70 sm:w-56 sm:rounded-l-none"
        >
          {pending ? 'Subscribing…' : 'Subscribe'}
        </button>
      </div>
      <p id={messageId} role="alert" className="mt-3 min-h-6 text-sm text-red-200">
        {state.status === 'error' ? state.message : ''}
      </p>
    </form>
  )
}
