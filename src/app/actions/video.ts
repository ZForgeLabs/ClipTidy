"use server";

import { createClient } from "../../../supabase/server";
import { revalidatePath } from "next/cache";

export interface VideoUploadData {
  original_filename: string;
  original_size: number;
  original_format: string;
  settings: {
    format: 'mp4' | 'mov' | 'avi';
    quality: 'low' | 'medium' | 'high' | 'ultra';
    fps: number;
    bitrate: number;
    autoCrop: boolean;
    watermark: boolean;
  };
}

export interface VideoRecord {
  id: string;
  user_id: string;
  original_filename: string;
  original_size: number;
  original_format: string;
  converted_filename: string | null;
  converted_size: number | null;
  converted_format: string | null;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  settings: any;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export async function uploadVideo(file: File, settings: VideoUploadData['settings']): Promise<{ success: boolean; videoId?: string; error?: string }> {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return { success: false, error: "Not authenticated" };
    }

    // Create video record in database
    const videoData: Omit<VideoUploadData, 'settings'> & { user_id: string; settings: any } = {
      user_id: user.id,
      original_filename: file.name,
      original_size: file.size,
      original_format: file.type.split('/')[1] || 'mp4',
      settings
    };

    const { data: videoRecord, error: dbError } = await supabase
      .from('videos')
      .insert([videoData])
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return { success: false, error: "Failed to create video record" };
    }

    // Upload file to Supabase Storage
    const fileName = `${user.id}/${videoRecord.id}/${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('videos')
      .upload(fileName, file);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      // Clean up database record if upload fails
      await supabase.from('videos').delete().eq('id', videoRecord.id);
      return { success: false, error: "Failed to upload file" };
    }

    // Update video record status to processing
    await supabase
      .from('videos')
      .update({ status: 'processing', progress: 10 })
      .eq('id', videoRecord.id);

    // Simulate video processing (in real app, this would trigger a background job)
    setTimeout(async () => {
      const supabaseClient = await createClient();
      await supabaseClient
        .from('videos')
        .update({ 
          status: 'completed', 
          progress: 100,
          converted_filename: `converted_${file.name}`,
          converted_size: file.size * 0.8, // Simulate smaller converted file
          converted_format: settings.format
        })
        .eq('id', videoRecord.id);
      
      revalidatePath('/dashboard');
    }, 5000); // Simulate 5 second processing

    revalidatePath('/dashboard');
    return { success: true, videoId: videoRecord.id };

  } catch (error) {
    console.error('Upload error:', error);
    return { success: false, error: "Upload failed" };
  }
}

export async function getVideos(): Promise<VideoRecord[]> {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return [];
    }

    const { data: videos, error } = await supabase
      .from('videos')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching videos:', error);
      return [];
    }

    return videos || [];
  } catch (error) {
    console.error('Error fetching videos:', error);
    return [];
  }
}

export async function deleteVideo(videoId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return { success: false, error: "Not authenticated" };
    }

    // Get video record to check ownership
    const { data: video, error: fetchError } = await supabase
      .from('videos')
      .select('*')
      .eq('id', videoId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !video) {
      return { success: false, error: "Video not found" };
    }

    // Delete from storage
    const fileName = `${user.id}/${videoId}/${video.original_filename}`;
    await supabase.storage
      .from('videos')
      .remove([fileName]);

    // Delete from database
    const { error: deleteError } = await supabase
      .from('videos')
      .delete()
      .eq('id', videoId)
      .eq('user_id', user.id);

    if (deleteError) {
      return { success: false, error: "Failed to delete video" };
    }

    revalidatePath('/dashboard');
    return { success: true };

  } catch (error) {
    console.error('Delete error:', error);
    return { success: false, error: "Delete failed" };
  }
}

export async function getVideoDownloadUrl(videoId: string): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return { success: false, error: "Not authenticated" };
    }

    // Get video record
    const { data: video, error: fetchError } = await supabase
      .from('videos')
      .select('*')
      .eq('id', videoId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !video) {
      return { success: false, error: "Video not found" };
    }

    if (video.status !== 'completed') {
      return { success: false, error: "Video not ready for download" };
    }

    // Generate download URL
    const fileName = `${user.id}/${videoId}/${video.converted_filename || video.original_filename}`;
    const { data: urlData, error: urlError } = await supabase.storage
      .from('videos')
      .createSignedUrl(fileName, 3600); // 1 hour expiry

    if (urlError) {
      return { success: false, error: "Failed to generate download URL" };
    }

    return { success: true, url: urlData.signedUrl };

  } catch (error) {
    console.error('Download URL error:', error);
    return { success: false, error: "Failed to generate download URL" };
  }
}
