# Polaris Production Deployment Checklist

This checklist ensures a safe, secure, and functional launch of the Polaris platform into a live production environment.

---

## 1. Supabase Database Provisioning

> [!IMPORTANT]
> Before deploying the Next.js build, your production Supabase instance must be prepared with the security-hardened schema.

- [ ] **Create Supabase Project**: Provision a fresh Supabase project via the Supabase Dashboard.
- [ ] **Apply DB Schema**: Copy the contents of [supabase/schema.sql](file:///home/da/idt/project/supabase/schema.sql) and execute them inside your Supabase SQL Editor to create tables, indexes, and RLS policies.
- [ ] **Establish Sync Trigger**: Copy and execute the trigger function script defined in [supabase/schema_setup.md](file:///home/da/idt/project/supabase/schema_setup.md#L15-L35). This binds incoming registrations to the secure `public.users` table.
- [ ] **Disable Email Confirmation (Optional)**: If you require immediate onboarding for the demo/launch, disable "Confirm email" under *Authentication -> Providers -> Email*.

---

## 2. Production Environment Variables

Configure the following variables in your hosting provider (e.g., **Vercel** Project Settings -> Environment Variables):

| Variable | Environment / Visibility | Expected Value |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | **Production & Preview** (Shared) | Your production Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **Production & Preview** (Shared) | Your production Supabase `anon` `public` key |
| `SUPABASE_SERVICE_ROLE_KEY` | **Production ONLY** (Secret/Server) | Your production Supabase `service_role` key |
| `NEXT_PUBLIC_MOCK_MODE` | **Production & Preview** (Shared) | **`false`** (Enforces real database connectivity) |

> [!CAUTION]
> Ensure `NEXT_PUBLIC_MOCK_MODE` is explicitly set to **`false`** in your production environment settings. If left `true` or omitted (depending on configurations), the UI will render mock data instead of real Supabase records.

---

## 3. Application Compilation & Vercel Settings

- [ ] **Framework Preset**: Set to **Next.js**.
- [ ] **Build Command**: `npm run build`
- [ ] **Install Command**: `npm ci`
- [ ] **Root Directory**: `./`

---

## 4. Post-Deployment Verification

Once the deployment completes:
1. [ ] Visit your production URL.
2. [ ] Click **Register** and create a test **Founder** account.
3. [ ] Confirm that the user is correctly visible in your Supabase **Auth** panel AND the **`public.users`** table.
4. [ ] Verify that the Dashboard fetches real, initialized state (empty state screen or live data) rather than simulated mock data.

---

🚀 **Ready for Launch.** The CI/CD pipeline in `.github/workflows/ci.yml` is locked and will validate all incoming updates before they can be merged into production.
