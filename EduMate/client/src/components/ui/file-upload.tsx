import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, File, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number; // in bytes
  className?: string;
}

export function FileUpload({ onFileSelect, accept, maxSize = 10 * 1024 * 1024, className }: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    setError("");
    
    if (maxSize && file.size > maxSize) {
      setError(`File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB`);
      return;
    }

    setSelectedFile(file);
    onFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer",
          isDragOver ? "border-primary bg-primary/5" : "border-slate-300 hover:border-slate-400",
          error && "border-red-300 bg-red-50"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        data-testid="file-upload-area"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
          data-testid="input-file"
        />
        
        {selectedFile ? (
          <div className="flex items-center justify-center space-x-2">
            <File className="w-6 h-6 text-primary" />
            <span className="text-sm font-medium text-slate-900">{selectedFile.name}</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                clearFile();
              }}
              data-testid="button-clear-file"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div>
            <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-sm text-slate-600 mb-2">
              Drag and drop your file here, or click to browse
            </p>
            <p className="text-xs text-slate-500">
              Max file size: {Math.round(maxSize / (1024 * 1024))}MB
            </p>
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-600" data-testid="text-upload-error">{error}</p>
      )}
    </div>
  );
}
