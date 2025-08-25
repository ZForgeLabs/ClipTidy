-- Create videos storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('videos', 'videos', true)
ON CONFLICT (id) DO NOTHING;

-- Create videos table
CREATE TABLE IF NOT EXISTS videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  original_filename TEXT NOT NULL,
  original_size BIGINT NOT NULL,
  original_format TEXT NOT NULL,
  converted_filename TEXT,
  converted_size BIGINT,
  converted_format TEXT,
  status TEXT DEFAULT 'uploading' CHECK (status IN ('uploading', 'processing', 'completed', 'error')),
  progress INTEGER DEFAULT 0,
  settings JSONB DEFAULT '{}',
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies for videos table
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Users can only see their own videos
CREATE POLICY "Users can view own videos" ON videos
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own videos
CREATE POLICY "Users can insert own videos" ON videos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own videos
CREATE POLICY "Users can update own videos" ON videos
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own videos
CREATE POLICY "Users can delete own videos" ON videos
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for videos storage bucket
CREATE POLICY "Users can upload videos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'videos' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view own videos" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'videos' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update own videos" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'videos' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own videos" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'videos' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_videos_updated_at 
    BEFORE UPDATE ON videos 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
