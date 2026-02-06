# Supabase Security & Constraints

## Database Constraints

### profiles table
- **RLS enabled** with policies for SELECT/UPDATE/INSERT per user
- **Check constraint** on `onboarding_status`: must be 'incomplete' or 'complete'
- **Index** on `onboarding_status` for performance

### onboarding_responses table
- **RLS enabled** with policies for SELECT/INSERT/UPDATE per user
- **UNIQUE constraint** on `(user_id, version)`: prevents duplicate responses for same version
- **CHECK constraint** on `answers` JSONB: must contain keys 'goal', 'horizon', 'drawdown_reaction'
- **Foreign key** on `user_id` → `auth.users(id)` with CASCADE DELETE
- **Indexes** on `user_id` and `version` for performance

## Functions

### `public.increment_login_count(p_user_id uuid)`
- **SECURITY INVOKER**: runs with the calling user's RLS context (safer than DEFINER)
- **Explicit auth check**: `auth.uid() = p_user_id` to prevent unauthorized increments
- **Permissions**: EXECUTE granted only to `authenticated` role (not PUBLIC)
- **Atomicity**: updates `login_count` and `last_login_at` in one transaction

### `public.handle_new_user()`
- **SECURITY DEFINER**: elevated privileges to insert into profiles
- **Trigger**: auto-creates profile row on user signup
- **Idempotent**: ON CONFLICT DO NOTHING prevents errors on re-runs

## RLS Policies

All policies are user-scoped using `auth.uid()` to ensure isolation:

```sql
-- Users can only read/update their own profile
USING (auth.uid() = id)

-- Users can only read/insert/update their own onboarding responses
USING (auth.uid() = user_id)
```

## Client-Side Security

### Server Actions
- Always use server-side Supabase client with cookie authentication
- Validate all input with Zod schemas before DB operations
- User ID extracted from authenticated session, not client input

### Upsert Logic
```typescript
// Safe upsert with conflict resolution
.upsert(data, { 
  onConflict: 'user_id,version',
  ignoreDuplicates: false 
})
```

## Best Practices

1. **Type Casting**: Use `(supabase as any)` for new schema fields until types are regenerated
2. **Error Handling**: Always log errors with context but return generic messages to client
3. **Validation**: Parse with Zod schemas before any DB operation
4. **Session Tracking**: Use `sessionStorage` to avoid duplicate login counts per session
5. **Snooze Logic**: Use `localStorage` for client-side snooze (7 days default)

## Testing Checklist

- [ ] User cannot read another user's profile
- [ ] User cannot insert duplicate onboarding response for same version
- [ ] User cannot increment another user's login count
- [ ] Invalid JSON structure rejected by CHECK constraint
- [ ] Profile auto-created on signup via trigger
- [ ] RLS policies prevent unauthorized access
