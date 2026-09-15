import { createSupabaseServerClient } from '@/lib/supabaseServer';

export const storageService = {
    /**
     * Uploads a file buffer to the 'labreports' bucket.
     */
    async uploadFile(buffer: ArrayBuffer | Uint8Array, path: string, contentType: string) {
        const supabase = await createSupabaseServerClient();

        const { data, error } = await supabase
            .storage
            .from('labreports')
            .upload(path, buffer, {
                contentType,
                upsert: false
            });

        if (error) {
            console.error('Storage upload error:', error);
            throw new Error(`Failed to upload file: ${error.message}`);
        }

        return data;
    },

    /**
     * Saves file metadata to the 'storage_files' table.
     */
    async saveFileMetadata(userId: string, fileName: string, filePath: string, size: number, contentType: string) {
        const supabase = await createSupabaseServerClient();

        const { error } = await supabase
            .from('storage_files')
            .insert({
                user_id: userId,
                file_name: fileName,
                file_path: filePath,
                file_size: size,
                content_type: contentType,
                created_at: new Date().toISOString()
            });

        if (error) {
            console.error('Database insertion error for file metadata:', error);
            // Not throwing error here to avoid failing the upload flow if only metadata insert fails,
            // but you can adjust based on requirements.
        }
    }
};
