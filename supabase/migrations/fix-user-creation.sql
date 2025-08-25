-- Quick fix for user creation issue
-- This script fixes the RLS policy problem for user creation

-- Drop the existing trigger first, then the function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create the function with SECURITY DEFINER to bypass RLS during user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert user record with SECURITY DEFINER (bypasses RLS)
  INSERT INTO public.users (
    id,
    user_id,
    email,
    name,
    full_name,
    avatar_url,
    token_identifier,
    created_at,
    updated_at,
    subscription_tier,
    credits_remaining,
    total_conversions
  ) VALUES (
    NEW.id,
    NEW.id::text,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.email,
    NEW.created_at,
    NEW.updated_at,
    'free',
    10,
    0
  );
  
  -- Create default user settings
  INSERT INTO public.user_settings (
    user_id,
    default_output_format,
    default_quality,
    auto_crop,
    watermark_enabled
  ) VALUES (
    NEW.id,
    'mp4',
    'high',
    true,
    false
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Also fix the user update function
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
DROP FUNCTION IF EXISTS public.handle_user_update();

CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.users
  SET
    email = NEW.email,
    name = COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    full_name = COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    avatar_url = NEW.raw_user_meta_data->>'avatar_url',
    updated_at = NEW.updated_at
  WHERE user_id = NEW.id::text;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the update trigger exists
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_update();
