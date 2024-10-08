import React, { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface InputFieldProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}) => (
  <div className="space-y-2">
    <Label htmlFor={name}>{label}</Label>
    <Input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  </div>
);

interface TextAreaFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
}

export const TextAreaField: React.FC<TextAreaFieldProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder,
}) => (
  <div className="space-y-2">
    <Label htmlFor={name}>{label}</Label>
    <Textarea
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={3}
    />
  </div>
);

interface ImageUploadFieldProps {
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  preview: string;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  onChange,
  preview,
}) => {
  const inputFileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center">
        <Input
          type="file"
          ref={inputFileRef}
          onChange={onChange}
          className="hidden"
          accept="image/*"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => inputFileRef.current?.click()}
        >
          <Upload className="mr-2 h-4 w-4" /> Choose Image
        </Button>
        {preview && (
          <div className="relative h-20 w-20 ml-4">
            <img
              src={preview}
              alt="Preview"
              className="object-cover rounded-md w-full h-full"
            />
          </div>
        )}
      </div>
    </div>
  );
};
