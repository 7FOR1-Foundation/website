import type { TextFieldSingleValidation } from 'payload'

/** A page on this site ("/volunteer") or a full web address ("https://…"). */
export const validateLink: TextFieldSingleValidation = (value) =>
  !value || value.startsWith('/') || /^https?:\/\/\S+\.\S+/.test(value)
    ? true
    : 'Use a page on this site starting with “/” (e.g. /volunteer) or a full web address starting with https://'

/** A full web address only ("https://…"), e.g. for social media profiles. */
export const validateWebAddress: TextFieldSingleValidation = (value) =>
  !value || /^https:\/\/\S+\.\S+/.test(value) ? true : 'Use a full web address starting with https://'

/** A colour written as a six-digit hex code, e.g. #1C78C3. */
export const validateHexColour: TextFieldSingleValidation = (value) =>
  !value || /^#[0-9a-f]{6}$/i.test(value) ? true : 'Use a six-digit colour code starting with #, e.g. #1C78C3'
