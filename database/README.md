# Database Setup Guide

## Supabase PostgreSQL Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in:
   - **Name**: majestic-projects
   - **Database Password**: (save this securely)
   - **Region**: Choose closest to you
4. Wait for project to be created (~2 minutes)

### 2. Get Your Credentials

From your Supabase project dashboard:

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://larlvheshwmsphzjaloa.supabase.co`
   - **anon/public key**: `sb_publishable_d83vCqxh8nsIxJZI9idglA_wXliQsP4`

### 3. Run Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire contents of `schema.sql`
4. Paste and click **Run**
5. Verify tables created:
   - Go to **Table Editor**
   - You should see: `users`, `projects`

### 4. Configure Environment Variables

**Frontend** (`.env.local`):
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Backend** (`.env`):
```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=your_supabase_service_role_key # Get from Settings → API → service_role key
```

### 5. Test Connection

Run the test script:
```bash
cd database
python test_connection.py
```

## Database Schema Overview

### Tables

**users**
- `id` (UUID, PK)
- `email` (TEXT, UNIQUE)
- `name` (TEXT)
- `image` (TEXT)
- `provider` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**projects**
- `id` (UUID, PK)
- `user_id` (UUID, FK → users)
- `title` (TEXT)
- `domain` (TEXT)
- `difficulty` (TEXT)
- `purpose` (TEXT)
- `output_type` (TEXT)
- `project_json` (JSONB) - Full project data
- `favorite` (BOOLEAN)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Security

- **Row Level Security (RLS)** enabled on all tables
- Users can only access their own data
- Policies enforce user isolation

### Indexes

- User ID index for fast project lookups
- Domain index for filtering
- Favorite index for dashboard
- Full-text search on titles

## Maintenance

### Backup

Supabase automatically backs up your database daily.

### Monitoring

Check database health in Supabase dashboard:
- **Database** → **Health**
- Monitor query performance
- Check storage usage

### Migrations

For schema changes:
1. Create new SQL file: `migrations/001_add_feature.sql`
2. Test in development
3. Apply to production via SQL Editor
