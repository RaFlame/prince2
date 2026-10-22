# User login (invite by email)

PRINCE2 Control uses **Supabase Auth** with email + password. There is **no public sign-up**. You create each user and send them their login details.

## 1. One-time setup

1. In Supabase → **Authentication** → **Providers** → Email: enable Email.
2. In **Authentication** → **Providers** → Email: turn **off** “Confirm email” if you want users to log in immediately with the password you set (recommended for small internal teams). Or leave confirm on and use Invite instead.
3. Optional but recommended: **Authentication** → **Settings** → disable public sign-ups if the toggle is available (or simply never expose a sign-up page — this app has none).
4. Run the full SQL in `supabase/schema.sql` (creates `card_content`, `project_state`, and `usage_events`, with RLS for authenticated users only). Re-run after schema updates so new tables/policies apply.
5. Ensure Vercel has the same `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` as `.env.local`.

## What syncs across devices

Signed-in users share the same **project workspace** via Supabase (last write wins; refresh to see others’ changes):

- Editable card text (`card_content`)
- Stage statuses and start/end dates (`project_state`)
- SCRUM board tasks and placements (`project_state`)
- Custom projects (`project_state`, global row)

**Stays on the device only:** theme, language (IS/EN), and which project is selected in the switcher.

## Usage monitoring

The app writes rows to `public.usage_events`:

| `event_type` | When |
| --- | --- |
| `login` | Successful password sign-in |
| `session` | App shell loads while signed in |
| `section` | User opens a sidebar section |
| `heartbeat` | About every 5 minutes while the tab is visible |

Inspect activity in Supabase → **Table Editor → usage_events** (or SQL Editor). Example queries:

```sql
-- Logins per user (last 30 days)
select user_email, count(*) as logins
from public.usage_events
where event_type = 'login'
  and created_at > now() - interval '30 days'
group by user_email
order by logins desc;

-- Active days (any heartbeat/session)
select user_email, count(distinct created_at::date) as active_days
from public.usage_events
where event_type in ('session', 'heartbeat')
  and created_at > now() - interval '30 days'
group by user_email
order by active_days desc;
```

## 2. Create a user and email them credentials

### Option A — You choose the password (simplest)

1. Supabase → **Authentication** → **Users** → **Add user** → **Create new user**.
2. Enter their **email** and a **temporary password**. Check **Auto Confirm User**.
3. Email them something like:

```
Subject: Aðgangur að PRINCE2 Control — Fiskistofa

Halló,

Þú hefur fengið aðgang að PRINCE2 Control:
https://YOUR-VERCEL-URL.vercel.app/login

Netfang: their@email.is
Lykilorð (tímabundið): ********

Skiptu um lykilorð eftir fyrstu innskráningu ef þú vilt (hægt að bæta við síðar).
```

### Option B — Supabase Invite (they set their own password)

1. Supabase → **Authentication** → **Users** → **Invite**.
2. Enter their email. Supabase sends them an invite link.
3. They open the link, set a password, then use `/login`.

Configure the Site URL and redirect URLs under **Authentication** → **URL Configuration** to your production domain (and `http://localhost:3000` for local).

## 3. Sign out

Users sign out from **Stillingar / Settings**.

## 4. Local development

With Supabase env vars set, `localhost` also requires login. Create a test user the same way as above.
