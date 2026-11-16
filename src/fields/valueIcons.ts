/**
 * Icons a value on the About page can use, each with its own colour.
 * The colours all keep white icons at 4.5:1 contrast or better.
 * The drawings live in src/components/ValueIcon.tsx.
 */
export const valueIcons = {
  action: { label: 'Lightning bolt (action)', colour: '#B5541A' },
  equality: { label: 'Balance scale (equality, fairness)', colour: '#6A3FA0' },
  accessibility: { label: 'Accessibility figure', colour: '#136D94' },
  growth: { label: 'Seedling (growth, children, early start)', colour: '#2E7D32' },
  accountability: { label: 'Checklist (accountability)', colour: '#B4235A' },
  partnership: { label: 'People (partnership, community)', colour: '#00796B' },
  heart: { label: 'Heart (care, compassion)', colour: '#C62828' },
  idea: { label: 'Light bulb (ideas, innovation)', colour: '#8A5A00' },
  globe: { label: 'Globe (Africa, the world)', colour: '#1565C0' },
  learning: { label: 'Book (learning, education)', colour: '#4E5BA6' },
} as const

export type ValueIconName = keyof typeof valueIcons

export const valueIconOptions = Object.entries(valueIcons).map(([value, { label }]) => ({ value, label }))
