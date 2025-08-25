"use client";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { uploadPdf } from "../lib/pdf";

export default function Dropzone() {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      await uploadPdf(file);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className="border-dashed border-2 border-gray-400 p-6 text-center cursor-pointer rounded-lg"
    >
      <input {...getInputProps()} />
      <p>Drag & drop PDF here, or click to upload</p>
    </div>
  );
}
