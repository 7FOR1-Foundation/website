/** Notes a blog post can end with. "custom" uses the post's own text instead. */
export const readerNotes = {
  legal: {
    label: 'Legal: not legal advice',
    text: 'This article is general information, not legal advice. For advice about your own situation, please speak to a qualified lawyer.',
  },
  health: {
    label: 'Health: not medical advice',
    text: 'This article is general information, not medical advice. For advice about your own health, please speak to a qualified health professional.',
  },
  opinion: {
    label: 'Opinion: the author’s own views',
    text: 'The views in this article are the author’s own and do not necessarily reflect those of Seven For One Association.',
  },
  custom: { label: 'Write my own note', text: '' },
} as const

export type ReaderNote = keyof typeof readerNotes
