import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { storageService } from '@/services/storageService';

export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Server Error: Missing Supabase environment variables for Storage Upload");
      return NextResponse.json({ error: "Configuration error. Please contact support." }, { status: 500 });
    }

    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    // 1. Verify authenticated user
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const fileBuffer = await file.arrayBuffer();

    // 3. Path format: {userId}/{filename}
    const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${user.id}/${Date.now()}-${safeFileName}`;

    // 2. Upload to Supabase storage bucket 'labreports'
    await storageService.uploadFile(new Uint8Array(fileBuffer), fileName, file.type);

    // 5. Save file metadata in table 'storage_files'
    await storageService.saveFileMetadata(user.id, file.name, fileName, file.size, file.type);

    // 4. Return uploaded file path
    return NextResponse.json({ success: true, file_path: fileName }, { status: 201 });
  } catch (err: any) {
    console.error('Server Error (Upload API):', err);
    return NextResponse.json({ error: 'Something went wrong with the file upload. Please try again.' }, { status: 500 });
  }
}
