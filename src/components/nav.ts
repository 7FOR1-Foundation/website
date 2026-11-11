export const mainNav = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/initiatives', label: 'Initiatives' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
]

export const footerNav = [
  { href: '/about', label: 'About Us' },
  { href: '/initiatives', label: 'Our Initiatives and Projects' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact Us' },
]

/** Pages planned for later. Until they are built they show a short “coming soon” page. */
export const comingSoonPages: Record<string, string> = {
  about: 'About Us',
  contact: 'Contact Us',
  volunteer: 'Volunteer With Us',
  donate: 'Donate',
}
