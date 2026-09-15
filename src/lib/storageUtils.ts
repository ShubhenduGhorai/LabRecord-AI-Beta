import { createSupabaseClient } from "./supabaseClient";

/**
 * Uploads a lab report PDF to securely isolated Supabase Storage.
 * @param file The PDF File blob.
 * @param experimentId The unique identifier of the experiment to associate this report with.
 * @returns The resulting namespaced file path inside the bucket.
 */
export async function uploadLabReport(file: File, experimentId: string): Promise<string> {
  const supabase = createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be authenticated to upload a report.");
  }

  const filePath = `${user.id}/${experimentId}-report.pdf`;

  const { data, error } = await supabase.storage
    .from("labreports")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true, // Enabling upsert so multiple revisions of the same report can overwrite
    });

  if (error) {
    throw error;
  }

  // Update backend experiment record with payload pointer
  const { error: dbError } = await supabase
    .from('experiments')
    .update({ report_path: filePath })
    .eq('id', experimentId)
    .eq('user_id', user.id); // Secure ownership assertion

  if (dbError) {
    console.error("Failed to link report path to DB:", dbError);
  }

  return filePath;
}

/**
 * Generates a temporarily signed URL securely granting 60 seconds of read access to the specific file.
 * @param filePath The Supabase storage path constructed dynamically via the upload function.
 * @returns A temporary URL string.
 */
export async function generateDownloadLink(filePath: string): Promise<string> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase.storage
    .from("labreports")
    .createSignedUrl(filePath, 60);

  if (error) {
    throw error;
  }

  return data.signedUrl;
}
