'use client'

import { sendContact } from '@/app/(frontend)/formActions'
import { contactReasons, toOptions } from '@/fields/formOptions'

import { SelectField, SiteForm, TextField } from './SiteForm'

export function ContactForm() {
  return (
    <SiteForm action={sendContact} submitLabel="Send message">
      <TextField name="name" label="Your name" autoComplete="name" />
      <TextField
        name="email"
        label="Email address"
        type="email"
        autoComplete="email"
        inputMode="email"
      />
      <TextField
        name="phone"
        label="Phone or WhatsApp number"
        type="tel"
        autoComplete="tel"
        inputMode="tel"
        optional
        hint="Add it if you’d rather we call or message you."
      />
      <SelectField
        name="reason"
        label="What is your message about?"
        options={toOptions(contactReasons)}
      />
      <TextField name="organisation" label="Organisation" autoComplete="organization" optional />
      <TextField name="message" label="Your message" multiline rows={6} />
    </SiteForm>
  )
}
