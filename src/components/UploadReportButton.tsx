"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, UploadCloud, DownloadCloud, FileText } from "lucide-react";
import { uploadLabReport, generateDownloadLink } from "@/lib/storageUtils";

export function UploadReportButton({ experimentId }: { experimentId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedPath, setUploadedPath] = useState<string | null>(null);
  const [downloadLink, setDownloadLink] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== "application/pdf") {
        setError("Only PDF files are supported.");
        setFile(null);
      } else {
        setFile(selectedFile);
        setError(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const filePath = await uploadLabReport(file, experimentId);
      setUploadedPath(filePath);
      
      const link = await generateDownloadLink(filePath);
      setDownloadLink(link);
    } catch (err: any) {
      setError(err.message || "Failed to upload the lab report. Make sure your storage bucket exists and policies are applied.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRefreshLink = async () => {
    if (!uploadedPath) return;
    try {
      const link = await generateDownloadLink(uploadedPath);
      setDownloadLink(link);
    } catch (err: any) {
      setError("Failed to refresh download link.");
    }
  };

  if (downloadLink) {
    return (
      <div className="flex flex-col items-start gap-3 p-4 border border-emerald-200 bg-emerald-50 rounded-lg">
        <div className="flex items-center gap-2 text-emerald-700 font-medium">
          <FileText className="h-5 w-5" />
          Report Uploaded Successfully
        </div>
        <div className="flex items-center gap-2">
           <a href={downloadLink} target="_blank" rel="noopener noreferrer">
             <Button variant="outline" className="border-emerald-600 text-emerald-700 hover:bg-emerald-100">
               <DownloadCloud className="w-4 h-4 mr-2" />
               Download Report (Valid 60s)
             </Button>
           </a>
           <Button variant="ghost" onClick={handleRefreshLink} className="text-xs h-9">
              Refresh Link
           </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 max-w-sm">
      <Input 
        type="file" 
        accept="application/pdf"
        onChange={handleFileChange} 
        disabled={isUploading}
        className="cursor-pointer file:cursor-pointer"
      />
      {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
      <Button 
        onClick={handleUpload} 
        disabled={!file || isUploading}
        className="bg-indigo-600 hover:bg-indigo-700 w-full"
      >
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading to Cloud...
          </>
        ) : (
          <>
            <UploadCloud className="mr-2 h-4 w-4" />
            Securely Upload Report
          </>
        )}
      </Button>
    </div>
  );
}
