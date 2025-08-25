import { createClient } from "../../supabase/server";

export async function checkUserExists(userId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', userId)
    .single();
    
  if (error) {
    console.error('Error checking user:', error);
    return null;
  }
  
  return data;
}

export async function createUserManually(userId: string, email: string, name?: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('users')
    .insert({
      id: userId,
      user_id: userId,
      email: email,
      name: name || email,
      full_name: name || email,
      token_identifier: email,
      subscription_tier: 'free',
      credits_remaining: 10,
      total_conversions: 0
    })
    .select()
    .single();
    
  if (error) {
    console.error('Error creating user manually:', error);
    return null;
  }
  
  return data;
}

export async function getUserSettings(userId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', userId)
    .single();
    
  if (error) {
    console.error('Error getting user settings:', error);
    return null;
  }
  
  return data;
}
