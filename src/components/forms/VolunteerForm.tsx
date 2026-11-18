'use client'

import { sendVolunteer } from '@/app/(frontend)/formActions'
import {
  availabilityOptions,
  toOptions,
  volunteerLocations,
  volunteerModes,
} from '@/fields/formOptions'
import { OTHER_WAY } from '@/lib/forms/constants'

import { Checkbox, ChoiceGroup, SiteForm, TextField } from './SiteForm'

/** `ways` are the "Ways to volunteer" from the About page, so both stay in step. */
export function VolunteerForm({ ways }: { ways: string[] }) {
  return (
    <SiteForm action={sendVolunteer} submitLabel="Send my offer to help">
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
      />
      <ChoiceGroup
        name="location"
        legend="Where are you based?"
        options={toOptions(volunteerLocations)}
      />
      <ChoiceGroup
        name="ways"
        legend="How would you like to help?"
        hint="Choose all that apply."
        multiple
        options={[...ways, OTHER_WAY].map((way) => ({ value: way, label: way }))}
      />
      <ChoiceGroup
        name="availability"
        legend="When are you usually available?"
        hint="Choose all that apply."
        multiple
        options={toOptions(availabilityOptions)}
      />
      <ChoiceGroup
        name="mode"
        legend="Would you help in person or online?"
        options={toOptions(volunteerModes)}
      />
      <TextField
        name="skills"
        label="Your skills or experience"
        multiline
        rows={4}
        optional
        hint="For example teaching, assistive technology, law, design, fundraising or social media."
      />
      <TextField
        name="accessNeeds"
        label="Is there anything we should know so you can take part fully?"
        multiline
        rows={3}
        optional
        hint="For example a screen reader, sign language, step-free access or a support person."
      />
      <TextField
        name="message"
        label="Anything else you’d like to tell us"
        multiline
        rows={4}
        optional
      />
      <Checkbox name="adult">I am 18 or older.</Checkbox>
    </SiteForm>
  )
}
