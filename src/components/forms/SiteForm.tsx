'use client'

import Link from 'next/link'
import {
  createContext,
  type ReactNode,
  useActionState,
  useContext,
  useEffect,
  useId,
  useRef,
} from 'react'

import type { FormState } from '@/lib/forms/submit'

type Action = (state: FormState, formData: FormData) => Promise<FormState>

const initial: FormState = { status: 'idle', message: '' }
const FormContext = createContext<{ state: FormState; prefix: string }>({
  state: initial,
  prefix: 'form',
})

const useField = (name: string) => {
  const { state, prefix } = useContext(FormContext)
  const id = `${prefix}-${name}`
  const error = state.errors?.[name]
  const value = state.values?.[name]
  return { id, error, value, errorId: `${id}-error`, hintId: `${id}-hint` }
}

const describedBy = (...ids: unknown[]) =>
  ids.filter((id): id is string => typeof id === 'string' && id !== '').join(' ') || undefined

const inputClass =
  'mt-2 block w-full rounded-lg border-2 border-[#767676] bg-white px-4 py-3 text-base text-ink placeholder:text-body aria-invalid:border-red-700'

function Label({
  htmlFor,
  children,
  optional,
}: {
  htmlFor: string
  children: ReactNode
  optional?: boolean
}) {
  return (
    <label htmlFor={htmlFor} className="block font-bold text-ink">
      {children}
      {optional ? <span className="font-normal text-body"> (optional)</span> : null}
    </label>
  )
}

function Hint({ id, children }: { id: string; children?: ReactNode }) {
  return children ? (
    <p id={id} className="mt-1 text-sm leading-6 text-body">
      {children}
    </p>
  ) : null
}

function ErrorText({ id, error }: { id: string; error?: string }) {
  return error ? (
    <p id={id} className="mt-2 font-semibold text-red-700">
      <span className="sr-only">Error: </span>
      {error}
    </p>
  ) : null
}

export function TextField({
  name,
  label,
  type = 'text',
  optional,
  hint,
  autoComplete,
  multiline,
  rows = 5,
  inputMode,
}: {
  name: string
  label: string
  type?: 'text' | 'email' | 'tel'
  optional?: boolean
  hint?: ReactNode
  autoComplete?: string
  multiline?: boolean
  rows?: number
  inputMode?: 'text' | 'email' | 'tel' | 'numeric'
}) {
  const { id, error, value, errorId, hintId } = useField(name)
  const props = {
    id,
    name,
    defaultValue: typeof value === 'string' ? value : undefined,
    required: !optional,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy(hint && hintId, error && errorId),
    className: inputClass,
  }
  return (
    <div>
      <Label htmlFor={id} optional={optional}>
        {label}
      </Label>
      <Hint id={hintId}>{hint}</Hint>
      {multiline ? (
        <textarea rows={rows} {...props} />
      ) : (
        <input type={type} autoComplete={autoComplete} inputMode={inputMode} {...props} />
      )}
      <ErrorText id={errorId} error={error} />
    </div>
  )
}

export function SelectField({
  name,
  label,
  options,
  hint,
}: {
  name: string
  label: string
  options: { value: string; label: string }[]
  hint?: ReactNode
}) {
  const { id, error, value, errorId, hintId } = useField(name)
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Hint id={hintId}>{hint}</Hint>
      <select
        id={id}
        name={name}
        required
        defaultValue={typeof value === 'string' ? value : ''}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(hint && hintId, error && errorId)}
        className={inputClass}
      >
        <option value="" disabled>
          Choose one
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ErrorText id={errorId} error={error} />
    </div>
  )
}

/** Radio buttons (one answer) or checkboxes (several), grouped under a legend. */
export function ChoiceGroup({
  name,
  legend,
  options,
  multiple,
  hint,
}: {
  name: string
  legend: string
  options: { value: string; label: string }[]
  multiple?: boolean
  hint?: ReactNode
}) {
  const { id, error, value, errorId, hintId } = useField(name)
  const chosen = Array.isArray(value) ? value : typeof value === 'string' ? [value] : []
  return (
    <fieldset
      id={id}
      tabIndex={-1}
      aria-describedby={describedBy(hint && hintId, error && errorId)}
    >
      <legend className="font-bold text-ink">{legend}</legend>
      <Hint id={hintId}>{hint}</Hint>
      <ErrorText id={errorId} error={error} />
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border-2 border-brand-100 bg-white px-4 py-2 has-checked:border-brand-600 has-checked:bg-brand-50"
          >
            <input
              type={multiple ? 'checkbox' : 'radio'}
              name={name}
              value={option.value}
              defaultChecked={chosen.includes(option.value)}
              className="size-5 shrink-0 accent-brand-600"
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export function Checkbox({ name, children }: { name: string; children: ReactNode }) {
  const { id, error, value, errorId } = useField(name)
  return (
    <div>
      <ErrorText id={errorId} error={error} />
      <label htmlFor={id} className="mt-1 flex cursor-pointer items-start gap-3">
        <input
          id={id}
          type="checkbox"
          name={name}
          value="yes"
          defaultChecked={value === 'yes'}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className="mt-1 size-5 shrink-0 accent-brand-600"
        />
        <span className="leading-7">{children}</span>
      </label>
    </div>
  )
}

/**
 * A form that sends to a server action. On errors it lists them at the top
 * (focused, with links to each field) and keeps what was typed; on success it
 * replaces itself with the thank-you message, which takes focus.
 */
export function SiteForm({
  action,
  submitLabel,
  children,
}: {
  action: Action
  submitLabel: string
  children: ReactNode
}) {
  const [state, formAction, pending] = useActionState(action, initial)
  const prefix = useId().replace(/:/g, '')
  const summaryRef = useRef<HTMLDivElement>(null)
  const successRef = useRef<HTMLDivElement>(null)
  const startedRef = useRef<HTMLInputElement>(null)
  const startedAt = useRef(0)

  // When the form first appeared (set in the browser, not during server rendering),
  // for the bot check. Kept across re-renders, so fixing an error quickly is fine.
  useEffect(() => {
    if (!startedAt.current) startedAt.current = Date.now()
    if (startedRef.current) startedRef.current.value = String(startedAt.current)
  })
  useEffect(() => {
    if (state.status === 'error') summaryRef.current?.focus()
    if (state.status === 'success') successRef.current?.focus()
  }, [state])

  if (state.status === 'success') {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="rounded-xl border-l-4 border-brand-600 bg-brand-50 p-6 sm:p-8"
      >
        <p className="text-xl font-bold text-ink">Sent</p>
        <p className="mt-2 text-lg leading-8">{state.message}</p>
      </div>
    )
  }

  const errors = Object.entries(state.errors ?? {})
  return (
    <FormContext.Provider value={{ state, prefix }}>
      <form
        action={formAction}
        noValidate
        key={JSON.stringify(state.values ?? {})}
        className="space-y-7"
      >
        {state.status === 'error' ? (
          <div
            ref={summaryRef}
            tabIndex={-1}
            role="alert"
            className="rounded-xl border-2 border-red-700 bg-white p-5"
          >
            <p className="font-bold text-red-700">{state.message}</p>
            {errors.length ? (
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {errors.map(([field, message]) => (
                  <li key={field}>
                    <a href={`#${prefix}-${field}`} className="text-red-700 underline">
                      {message}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}

        {children}

        <Checkbox name="consent">
          I agree to 7FOR1 storing these details so they can reply to me. Read our{' '}
          <Link
            href="/privacy"
            className="font-semibold text-brand-600 underline underline-offset-4"
          >
            privacy policy
          </Link>
          .
        </Checkbox>

        {/* Spam traps: people never see or fill these. */}
        <div aria-hidden="true" className="hidden">
          <label>
            Website <input type="text" name="website" tabIndex={-1} autoComplete="off" />
          </label>
          <input ref={startedRef} type="hidden" name="startedAt" defaultValue="" />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="btn bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-70"
        >
          {pending ? 'Sending…' : submitLabel}
        </button>
      </form>
    </FormContext.Provider>
  )
}
