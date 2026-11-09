# so sehr

An open, gentle space for short messages to people who have died.

## Run locally

Requires Node 20.19 or newer.

```bash
npm install
npm run dev
```

The visual interface works without a database. To enable submissions and published messages, copy `.env.example` to `.env` and add the values from your Supabase project:

```bash
NUXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NUXT_SUPABASE_SECRET_KEY=your-secret-key
```

Run `supabase/migrations/20261109000000_create_messages.sql` in the Supabase SQL Editor. New messages are stored as `pending`; only messages marked `published` appear in the public space.

## Netlify

Set `NUXT_PUBLIC_SUPABASE_URL` and `NUXT_SUPABASE_SECRET_KEY` in Netlify’s environment variables, then deploy from the `main` branch. The included `netlify.toml` selects Nuxt's Netlify runtime and Node 24. Never expose the secret key in client-side code or commit it to Git.
