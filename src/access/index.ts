import type { Access, FieldAccess, Where } from 'payload'

type Role = 'admin' | 'editor'

const hasRole = (user: unknown, roles: Role[]): boolean => {
  const role = (user as { role?: Role } | null | undefined)?.role
  return Boolean(role && roles.includes(role))
}

/** Logged-in staff (admins and editors). */
export const isStaff: Access = ({ req }) => hasRole(req.user, ['admin', 'editor'])

/** Admins only. Used for personal data (subscribers, volunteers, messages) and user management. */
export const isAdmin: Access = ({ req }) => hasRole(req.user, ['admin'])

export const isAdminField: FieldAccess = ({ req }) => hasRole(req.user, ['admin'])

export const isStaffField: FieldAccess = ({ req }) => hasRole(req.user, ['admin', 'editor'])

/** Anyone can read published documents; staff also see drafts. */
export const publishedOrStaff: Access = ({ req }) => {
  if (hasRole(req.user, ['admin', 'editor'])) return true
  const published: Where = { _status: { equals: 'published' } }
  return published
}

export const anyone: Access = () => true
