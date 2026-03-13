import { createClient } from '@/lib/supabase/client';

export const getSupabaseImageUrl = (path: string | null | undefined): string => {
  if (!path) return '/placeholder.jpg';
  
  if (path.startsWith('http://') || path.startsWith('https://')) {
    const url = new URL(path);
    if (url.pathname.includes('/storage/v1/object/images/')) {
      url.pathname = url.pathname.replace('/storage/v1/object/images/', '/storage/v1/object/public/images/');
      return url.toString();
    }
    return path;
  }
  
  const supabase = createClient();
  const { data } = supabase.storage.from('images').getPublicUrl(path);
  return data.publicUrl;
};

export const uploadImageToSupabase = async (
  file: File,
  folder: 'products' | 'slides' = 'products'
): Promise<{ url: string | null; error: string | null }> => {
  try {
    const supabase = createClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(fileName, file, { cacheControl: '3600', upsert: false });

    if (uploadError) {
      return { url: null, error: uploadError.message };
    }

    const { data } = supabase.storage.from('images').getPublicUrl(fileName);
    return { url: data.publicUrl, error: null };
  } catch (err) {
    return { url: null, error: err instanceof Error ? err.message : 'Upload failed' };
  }
};
