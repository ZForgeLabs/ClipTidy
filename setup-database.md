# Database Setup Guide for ClipTidy

## How to Set Up Your Database

### Step 1: Access Supabase SQL Editor
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**

### Step 2: Run the Complete Setup
1. Copy the entire contents of `supabase/migrations/complete-setup.sql`
2. Paste it into the SQL Editor
3. Click **Run** to execute the script

### Step 3: Verify Setup
After running the script, you should see:
- ✅ All tables created successfully
- ✅ RLS policies enabled
- ✅ Functions and triggers created
- ✅ Indexes created for performance

## Database Schema Overview

### Tables Created:

1. **`users`** - User profiles and account information
   - Basic user info (name, email, avatar)
   - Subscription tier and credits
   - Conversion statistics

2. **`videos`** - Video uploads and conversions
   - Original and converted video metadata
   - Processing status and settings
   - File information and URLs

3. **`conversion_jobs`** - Background processing jobs
   - Job status and progress tracking
   - Error handling and priority management

4. **`user_settings`** - User preferences
   - Default output formats and quality
   - Auto-crop and watermark settings

5. **`subscriptions`** - Subscription management
   - Stripe integration fields
   - Plan types and billing periods

### Security Features:
- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Users can only access their own data
- ✅ Proper INSERT, SELECT, UPDATE, DELETE policies
- ✅ Automatic user creation on signup

### Performance Optimizations:
- ✅ Database indexes on frequently queried columns
- ✅ Automatic timestamp updates
- ✅ Efficient foreign key relationships

## Testing the Setup

After running the script, try:
1. **Sign up a new user** - Should automatically create user record
2. **Sign in** - Should work without RLS errors
3. **Access dashboard** - Should load user data correctly

## Troubleshooting

If you encounter issues:
1. Check the **Logs** section in Supabase for error messages
2. Verify all policies were created in **Authentication > Policies**
3. Test with a fresh user signup to ensure triggers work

The database is now ready for your ClipTidy video conversion application! 🎉
