"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HardDrive, UploadCloud, File, AlertCircle, CheckCircle2 } from "lucide-react";
import { ErrorFallback } from "@/components/ErrorFallback";

export default function CloudStoragePage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successPath, setSuccessPath] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError(null);
      setSuccessPath(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    setIsUploading(true);
    setError(null);
    setSuccessPath(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/storage/upload', {
        method: 'POST',
        headers: {
          // Note: don't set Content-Type header manually when using FormData
          // Browser will automatically set boundary
        },
        body: formData
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to upload file.");
      }

      setSuccessPath(data.file_path);
      setFile(null); // Reset after success
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  if (error && !file && !isUploading) {
    return <ErrorFallback error={error} reset={() => setError(null)} />;
  }

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8 w-full">
      <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-slate-50 to-white">
        <CardHeader className="pb-4 border-b border-slate-100">
          <div className="flex gap-4 items-start">
            <div className="p-2 bg-slate-200 rounded-lg w-fit">
              <HardDrive className="h-8 w-8 text-slate-700" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold text-slate-800">Cloud Storage</CardTitle>
              <CardDescription className="text-lg mt-1">
                Securely store attachments, datasets, and archives directly to your vault.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-8">

          <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl border-2 border-dashed border-slate-200 hover:border-slate-300 transition-colors text-center">

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.csv,.xlsx,.doc,.docx"
            />

            {!file ? (
              <div
                className="cursor-pointer space-y-4 flex flex-col items-center"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                  <UploadCloud className="h-8 w-8 text-slate-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-700">Click to Browse</h3>
                  <p className="text-sm text-slate-500 mt-1">Upload PDF, CSV, Excel or Word documents up to 50MB</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <File className="h-8 w-8 text-indigo-500" />
                  <div className="text-left">
                    <p className="font-semibold text-slate-700 break-all">{file.name}</p>
                    <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    disabled={isUploading}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 bg-slate-800 hover:bg-slate-900"
                    onClick={handleUpload}
                    disabled={isUploading}
                  >
                    {isUploading ? "Uploading..." : "Upload to Vault"}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-6 max-w-xl mx-auto flex justify-center items-start gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-100">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          {successPath && (
            <div className="mt-6 max-w-xl mx-auto flex justify-center items-start gap-2 p-4 text-sm text-emerald-700 bg-emerald-50 rounded-lg border border-emerald-100 animate-in fade-in slide-in-from-bottom-4">
              <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5 text-emerald-500" />
              <div>
                <p className="font-semibold text-emerald-800 text-base mb-1">Upload Successful!</p>
                <p>File saved to secure path: <code className="bg-emerald-100/50 px-1 py-0.5 rounded text-xs select-all text-emerald-600 font-mono">{successPath}</code></p>
              </div>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
