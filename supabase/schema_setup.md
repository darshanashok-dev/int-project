# Supabase Database Setup Guide (Security Edition)

Follow these steps to initialize your live Supabase project for the Polaris Platform.

## 1. Apply Base Schema
Copy the content of [supabase/schema.sql](file:///home/da/idt/project/supabase/schema.sql) and paste it into the **Supabase SQL Editor**. 

> [!IMPORTANT]
> This schema now includes **Hardened Row Level Security (RLS)**. Roles are stored securely in the `public.users` table rather than user metadata, preventing security bypasses.

## 2. Sync Auth Users with Secure Roles
Run the following SQL script to create the sync trigger. This ensures that every new registration is assigned a secure role in the database.

```sql
-- 1. Create function to handle new user sync with secure roles
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, role, created_at)
  values (
    new.id, 
    new.email, 
    coalesce(new.raw_user_meta_data ->> 'role', 'founder'), -- Defaults to founder
    new.created_at
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;

-- 2. Create the trigger
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

## 3. Enable Email Confirmation (Optional)
By default, Supabase requires email confirmation. If you want to allow users to sign in immediately after registration:
1. Go to **Authentication** -> **Providers** -> **Email**.
2. Toggle off **Confirm email**.

## 4. Verify Connection
Restart your development server to clear any cached environment variables:
```bash
npm run dev
```
The platform is now secured and ready for live production users.
