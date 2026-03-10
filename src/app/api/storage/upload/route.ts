import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseServer';

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const fileBuffer = await file.arrayBuffer();
    const fileName = `${user.id}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    // Upload to Supabase Storage
    const { data: storageData, error: storageError } = await supabase
      .storage
      .from('labreports')
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        upsert: false
      });

    if (storageError) {
      console.error('Upload error:', storageError);
      return NextResponse.json({ error: 'Failed to upload file to storage' }, { status: 500 });
    }

    // Optional: save to storage_files table
    const { error: dbError } = await supabase
      .from('storage_files')
      .insert({
        user_id: user.id,
        file_name: file.name,
        file_path: storageData.path,
        file_size: file.size,
        content_type: file.type,
        created_at: new Date().toISOString()
      });

    if (dbError) {
      console.error('Database insertion error:', dbError);
    }

    return NextResponse.json({ success: true, file_path: storageData.path }, { status: 201 });
  } catch (err: any) {
    console.error('API Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
