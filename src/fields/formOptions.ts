/** Choices on the public Contact, Volunteer and Donate forms. */
export const contactReasons = {
  question: 'A general question',
  partnership: 'Partnership',
  media: 'Media or press',
  writing: 'Writing for our blog',
  invite: 'Inviting us to run a training',
  other: 'Something else',
} as const

export const volunteerLocations = {
  douala: 'Douala',
  buea: 'Buea',
  cameroon: 'Elsewhere in Cameroon',
  abroad: 'Outside Cameroon (online only)',
} as const

export const availabilityOptions = {
  weekdays: 'Weekdays',
  weekends: 'Weekends',
  evenings: 'Evenings',
  occasional: 'Occasionally, for one-off events',
} as const

export const volunteerModes = {
  inPerson: 'In person',
  online: 'Online',
  both: 'Either',
} as const

export const messageTypes = {
  contact: 'Contact',
  volunteer: 'Volunteer',
  donation: 'Donation',
} as const

export type MessageType = keyof typeof messageTypes

export const toOptions = (record: Record<string, string>) =>
  Object.entries(record).map(([value, label]) => ({ value, label }))
