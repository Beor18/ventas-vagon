/* eslint-disable @next/next/no-img-element */
import { type PutBlobResult } from "@vercel/blob";
import { upload } from "@vercel/blob/client";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Upload as UploadIcon } from "lucide-react";

export default function ImageUploadPage() {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [blobs, setBlobs] = useState<PutBlobResult[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);

    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const removePreviewFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newUrls = previewUrls.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setPreviewUrls(newUrls);
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
    setPreviewUrls([]);
  };

  const removeUploadedImage = (index: number) => {
    setBlobs((prevBlobs) => prevBlobs.filter((_, i) => i !== index));
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Upload Your Images</CardTitle>
      </CardHeader>
      <CardContent>
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
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removePreviewFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
