"use client";

import { useCallback, useState } from "react";
import { useDropzone, } from "react-dropzone";
import { Loader2, UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";

interface ImageDropzoneProps {
  value?: string | null; // Accept current value from form
  onChange?: (url: string | null) => void; // Send file back to form
  onFilesSelected?: (files: File[]) => void;
  maxFiles?: number;
}

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export function ImageDropzone({ 
  onFilesSelected, 
  maxFiles = 1,
  onChange,
  value,
}: ImageDropzoneProps) {

  const [uploading, setUploading] = useState<boolean>(false);
  const [files, setFiles] = useState<(File & { preview: string })[]>([]);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[], rejectedFiles: any[]) => {
      // Handle rejected files
    if (rejectedFiles.length > 0) {
      const reason = rejectedFiles[0].errors[0]?.message;
      setError(reason || "Invalid file");
      return;
    }

    setError(null);

    const file = acceptedFiles[0];

    if(!file) {
      return;
    }

    setUploading(true);

    // Create preview URLs
    const newFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );

    const formData = new FormData();

    formData.append("file", file);
    const folderName = "billam-logos";
    formData.append("folderName", folderName);

    const { data: resData } = await axios.post("/api/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (resData.error) {
      toast.error("Error uploading logo");

      return;
    }

    setUploading(false);

    if (resData.res.secure_url as string && onChange) {
      onChange(resData.res.secure_url);
    }

    setFiles(newFiles);
    if (onFilesSelected) onFilesSelected(acceptedFiles);

  }, [onFilesSelected, onChange]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles,
    maxSize: MAX_FILE_SIZE, // 🚀 built-in size validation
  });

  return (
    <div className="w-full space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "relative flex flex-col items-center justify-center w-full h-50 border-2 border-dashed bg-white rounded-lg cursor-pointer transition-colors",
          isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          isDragReject ? "border-destructive bg-destructive/5" : "hover:bg-accent",
        )}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
          <div className="p-3 mb-4 rounded-full bg-primary/10 text-primary">
            <UploadCloud className="w-8 h-8" />
          </div>
          <p className="mb-2 text-sm font-semibold">
            {isDragActive ? "Drop the images here" : "Click to upload or drag and drop"}
            {uploading && (<Loader2 className="animate-spin ml-22" />)}
          </p>
          {!uploading && (
            <p className="text-xs text-muted-foreground">
              PNG, JPG or WEBP (Max file size: 2MB)
            </p>
          )}
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}


      {/* Preview Section */}
      {value && (
        <ul className="grid grid-cols-1 gap-4 mt-4">
          <li className="flex items-center justify-between p-3 border rounded-md bg-background">
            <div className="flex items-center space-x-3">
              <div className="relative w-auto h-12 overflow-hidden rounded bg-muted">
                <img src={value} alt="business-logo" className="object-cover w-full h-full" />
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              type="button"
              onClick={() => onChange?.(null)}
              className="text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </Button>
          </li>
        </ul>
      )}
    </div>
  );
}