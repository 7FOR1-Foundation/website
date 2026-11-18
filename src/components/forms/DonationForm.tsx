'use client'

import { sendDonation } from '@/app/(frontend)/formActions'
import { GENERAL_DONATION } from '@/lib/forms/constants'

import { Checkbox, ChoiceGroup, SiteForm, TextField } from './SiteForm'

/** `campaigns` are the campaign titles on the Donate page. */
export function DonationForm({ campaigns }: { campaigns: string[] }) {
  return (
    <SiteForm action={sendDonation} submitLabel="Send">
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
        hint="Add it if you’d like us to call or message you about your gift."
      />
      <ChoiceGroup
        name="campaign"
        legend="What would you like to support?"
        options={[...campaigns, GENERAL_DONATION].map((campaign) => ({
          value: campaign,
          label: campaign,
        }))}
      />
      <TextField
        name="amount"
        label="How much would you like to give?"
        optional
        hint="An approximate amount is fine, e.g. 25,000 FCFA or $50."
      />
      <TextField name="message" label="Message" multiline rows={4} optional />
      <Checkbox name="thankPublicly">
        You may thank me publicly by name. Leave this unticked to stay anonymous.
      </Checkbox>
    </SiteForm>
  )
}
