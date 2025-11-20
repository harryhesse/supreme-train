import React from "react";
import { useDropzone } from "react-dropzone";
import { supabase } from "../lib/supabaseClient";

export default function DropzoneControl({ files, setFiles, bucket }) {
  const onDrop = async (acceptedFiles) => {
    const uploadedFiles = [];

    for (const file of acceptedFiles) {
      try {
        const tmpPath = `tmp/${crypto.randomUUID()}-${file.name}`;

        // upload to supabase
        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(tmpPath, file);
        if (uploadError) {
          console.error("Upload failed:", uploadError);
          continue;
        }

        const { data } = supabase.storage.from(bucket).getPublicUrl(tmpPath);

        uploadedFiles.push({
          path: tmpPath,
          name: file.name,
          size: file.size,
          tmp: true,
          url: data?.publicUrl || "",
        });
      } catch (err) {
        console.error("File upload error:", err);
      }
    }

    setFiles((prev) => [...prev, ...uploadedFiles]);
  };

  const removeFile = (file) => {
    setFiles((prev) => prev.filter((f) => f !== file));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div>
      <div
        {...getRootProps()}
        style={{
          border: "2px dashed #999",
          padding: "24px",
          cursor: "pointer",
          marginBottom: "16px",
        }}
      >
        <input {...getInputProps()} />
        {isDragActive ? "Drop files here" : "Drag files or click to upload"}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {files.map((file, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              border: "1px solid #ddd",
              padding: "8px",
            }}
          >
            <span>{file.name || file.path.split("/").pop()}</span>
            <button type="button" onClick={() => removeFile(file)}>
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
