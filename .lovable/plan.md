## What you uploaded vs. what this project is

Your zip (`tri-nation-web-main`) is a **Vite + React Router + Firebase** app with these pages:
- Public: Index, Services, About, Contact, FormDetail (`/form/:name`), Apply (`/apply/:name`), ThankYou, NotFound
- Account: Account, Profile, Applications, Wallet, Orders
- Admin

This current project is a **TanStack Start** template (file-based routing under `src/routes/`, server functions, no React Router, no Firebase). The two stacks are not drop-in compatible — code must be ported.

## Plan

### 1. Port the UI from the zip into this project
- Copy `src/components/*` (Navbar, Footer, JobBanner, MobileBottomNav, WhatsAppButton, AccountLayout, NavLink), `src/data/services.ts`, `src/assets/*`, and Tailwind/index CSS tokens.
- Recreate each page as a TanStack route file:
  - `src/routes/index.tsx`, `services.tsx`, `about.tsx`, `contact.tsx`, `thank-you.tsx`
  - `src/routes/form.$name.tsx`, `src/routes/apply.$name.tsx`
  - `src/routes/account.tsx` (layout with `<Outlet/>`) + `account.profile.tsx`, `account.applications.tsx`, `account.wallet.tsx`, `account.orders.tsx`
  - `src/routes/admin.tsx`
- Replace `react-router-dom` imports (`Link`, `useNavigate`, `useParams`) with `@tanstack/react-router` equivalents.

### 2. Connect to your Supabase
You gave me:
- URL: `https://imeundhhnmoiwukwtqtm.supabase.co`
- Publishable key: `sb_publishable_Lsn0nLOpxpGlIY0939XW1g_P0cF5-zy`

I'll add `@supabase/supabase-js`, create `src/integrations/supabase/client.ts` using these (publishable key is safe in the browser), and remove all Firebase code (`firebase` dep, auth/firestore calls in pages).

### 3. Database schema (you run this in Supabase SQL editor)
I'll generate SQL for:
- `profiles` (id ref auth.users, full_name, phone, avatar_url, wallet_balance)
- `services` (slug, title, description, price, fields jsonb) — to back `/form/:name` and `/apply/:name`
- `applications` (id, user_id, service_slug, form_data jsonb, status, created_at)
- `orders` (id, user_id, amount, status, created_at)
- `wallet_transactions` (id, user_id, type, amount, note, created_at)
- `user_roles` + `app_role` enum + `has_role()` SECURITY DEFINER fn (for admin)
- RLS on every table: users see only their own rows; admins see all.
- Trigger to auto-create `profiles` row on signup.

### 4. Auth + features wiring
- Email/password auth via Supabase (login/signup screens added to `/account` when logged out).
- `/account/*` gated by an `_authenticated` layout (`beforeLoad` redirects to login).
- Apply form writes to `applications`; Applications page lists user's rows; Wallet/Orders read their tables; Admin page lists all applications (role-gated by `has_role(uid,'admin')`).

### 5. What I will NOT do without confirmation
- Hide Firebase migration data (you said nothing about existing data).
- Add payments — the Wallet page will just track balance/transactions in the DB; top-up will be a stubbed action unless you want Stripe.

## Technical notes
- Publishable key goes in `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY` and is bundled into the client — that's correct, it's the public anon-style key. The service role key is NOT needed for this site.
- Pages that need server-only logic (none anticipated besides what RLS already covers) would use `createServerFn`. For this site, browser-side Supabase calls with RLS are sufficient.
- After I push the SQL, you'll paste it into Supabase → SQL Editor and run it. I cannot run migrations against an external Supabase from here.

## Confirm before I start
1. Proceed with the migration as above? (Big change — replaces everything currently in `src/routes/`.)
2. OK to drop Firebase entirely and use only your Supabase?
3. Wallet top-up: stub for now, or do you want Stripe integration?
