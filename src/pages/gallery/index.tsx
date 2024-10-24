/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useRef } from "react";
import { type PutBlobResult } from "@vercel/blob";
import { upload } from "@vercel/blob/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Upload as UploadIcon } from "lucide-react";
import ImageGallery from "@/components/Gallery/ImageGallery";
import withAuth from "@/lib/withAuth";

const Gallery = () => {
  const [isOpen, setIsOpen] = useState(false);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [blobs, setBlobs] = useState<PutBlobResult[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);

    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prevUrls) => [...prevUrls, ...urls]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setPreviewUrls((prevUrls) => {
      const newUrls = prevUrls.filter((_, i) => i !== index);
      prevUrls[index] && URL.revokeObjectURL(prevUrls[index]);
      return newUrls;
    });
  };

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (selectedFiles.length === 0) {
      throw new Error("No files selected");
    }

    setUploading(true);
    setProgress(0);

    const uploadedBlobs: PutBlobResult[] = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const newBlob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
      });
      uploadedBlobs.push(newBlob);
      setProgress(((i + 1) / selectedFiles.length) * 100);
    }

    setBlobs((prevBlobs) => [...prevBlobs, ...uploadedBlobs]);
    setUploading(false);
    setSelectedFiles([]);
    setPreviewUrls((prevUrls) => {
      prevUrls.forEach(URL.revokeObjectURL);
      return [];
    });
    setIsOpen(false);
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Image Gallery</h1>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setIsOpen(true)}>
            <UploadIcon className="mr-2 h-4 w-4" />
            Upload Images
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Upload Your Images</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="flex items-center space-x-2">
              <Input
                name="file"
                ref={inputFileRef}
                type="file"
                multiple
                required
                className="hidden"
                onChange={handleFileSelect}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => inputFileRef.current?.click()}
              >
                <UploadIcon className="mr-2 h-4 w-4" /> Choose Files
              </Button>
              <Button
                type="submit"
                disabled={uploading || selectedFiles.length === 0}
              >
                {uploading ? "Uploading..." : "Upload"}
              </Button>
            </div>
            {uploading && <Progress value={progress} className="w-full" />}
            {previewUrls.length > 0 && (
              <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                <div className="grid grid-cols-2 gap-4">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-full aspect-square object-cover rounded-md"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.preventDefault();
                          removeFile(index);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </form>
        </DialogContent>
      </Dialog>

      <ImageGallery />
    </div>
  );
};

export default withAuth(Gallery, ["Administrador", "Vendedor"]);
