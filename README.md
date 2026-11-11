# 7FOR1 Foundation Website

The official website of the **7FOR1 (Seven For One) Foundation**, which trains Africans with disabilities in digital skills, builds accessible learning, and advocates for lasting inclusion.

> **Status:** MVP in development.

## Features

**Public site**
- Home, About, Blog
- Initiatives: each initiative's page shows its goal and the projects carried out for it, and each project has its own page
- Contact form (messages are saved and forwarded to the foundation inbox)
- Volunteer sign-up
- Newsletter subscription (double opt-in)

**Admin panel** (`/admin`)
- Create, edit and publish blog posts
- Manage initiatives and add the projects carried out under each one
- View and manage volunteer sign-ups (with CSV export)
- Read and track contact messages
- Edit site-wide content: contact details, social links, impact numbers

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | [Next.js](https://nextjs.org) (App Router), React, TypeScript |
| CMS / admin | [Payload CMS 3](https://payloadcms.com), running inside the Next.js app |
| Database | PostgreSQL |
| Media storage | Vercel Blob |
| Email | Brevo (form notifications and newsletter) |
| Styling | Tailwind CSS |
| Spam protection | Cloudflare Turnstile |
| Hosting | Vercel |

See the architecture doc for the full design: data model, key flows, security and hosting.

## Getting started

### Prerequisites
- Node.js 24.22 or later (see `.nvmrc`; `nvm use` picks it up)
- pnpm 10 (`corepack enable pnpm`)
- A PostgreSQL database: local (for example `brew install postgresql@17`) or a free Neon database

### Setup

```bash
git clone git@github.com:7FOR1-Foundation/website.git
cd website
pnpm install
cp .env.example .env   # then fill in DATABASE_URI and PAYLOAD_SECRET
pnpm payload migrate   # create the database tables
pnpm seed              # optional: fill in the home page and initiatives from the design
pnpm dev
```

- Website: http://localhost:3000
- Admin panel: http://localhost:3000/admin. On first run you'll be asked to create the first account, which becomes an admin.

Without `BLOB_READ_WRITE_TOKEN`, uploaded images are saved to the local `media/` folder (not committed).

### Changing the content model

After editing a collection or global in `src/collections` or `src/globals`:

```bash
pnpm generate:types                  # update src/payload-types.ts
pnpm payload migrate:create <name>   # write a migration for the database change
```

Commit the new migration; it runs automatically on the next deploy.

### Environment variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URI` | PostgreSQL connection string |
| `PAYLOAD_SECRET` | Long random string used to sign admin sessions |
| `NEXT_PUBLIC_SITE_URL` | Public URL of the site |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob media storage (created automatically when a Blob store is connected to the Vercel project) |
| `BREVO_API_KEY` | Email sending and newsletter list sync |
| `CONTACT_INBOX` | Where contact and volunteer notifications are sent |
| `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | Spam protection on public forms |

Never commit `.env`. Only `.env.example` (with empty values) belongs in the repo.

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Start the development server |
| `pnpm build` | Build for production |
| `pnpm start` | Run the production build |
| `pnpm lint` | Lint the code |
| `pnpm payload migrate` | Apply database migrations |
| `pnpm seed` | Fill an empty database with the starting content |
| `pnpm build:vercel` | Apply migrations, then build (used by Vercel) |

## Deployment

Pushing to `main` deploys to production on Vercel. Each pull request gets its own preview URL.

Vercel project settings:
- **Build Command:** `pnpm build:vercel` (runs database migrations, then builds)
- **Environment variables:** `DATABASE_URI`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SITE_URL`, plus `BLOB_READ_WRITE_TOKEN`, which Vercel adds when you connect a Blob store

Pages are built ahead of time and refreshed automatically when content is saved in the admin.

## Contributing

1. Create a branch from `main`.
2. Make your changes and test them locally, including on a narrow (mobile) screen.
3. Open a pull request with a short description and screenshots of any visual changes.

## Content and brand assets

The 7FOR1 name, logo, photographs and written content belong to the 7FOR1 Foundation and are not covered by any code license in this repository. Photos of program participants must not be published without their consent.

## Contact

7FOR1 Foundation: info7for1@gmail.com
