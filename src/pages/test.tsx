import { type PutBlobResult } from "@vercel/blob";
import { upload } from "@vercel/blob/client";
import { useState, useRef } from "react";

export default function ImageUploadPage() {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [blobs, setBlobs] = useState<PutBlobResult[]>([]);

  return (
    <>
      <h1>Upload Your Images</h1>
      <form
        onSubmit={async (event) => {
          event.preventDefault();

          if (!inputFileRef.current?.files) {
            throw new Error("No files selected");
          }

          const files = Array.from(inputFileRef.current.files);
          const uploadedBlobs: PutBlobResult[] = [];

          for (const file of files) {
            const newBlob = await upload(file.name, file, {
              access: "public",
              handleUploadUrl: "/api/upload",
            });
            uploadedBlobs.push(newBlob);
          }

          setBlobs(uploadedBlobs);
        }}
      >
        <input name="file" ref={inputFileRef} type="file" multiple required />
        <button type="submit">Upload</button>
      </form>
      {blobs.length > 0 && (
        <div>
          <h2>Uploaded Images:</h2>
          {blobs.map((blob, index) => (
            <div key={index}>
              Blob url: <a href={blob.url}>{blob.url}</a>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
