import React from "react";
import { useDropzone } from "react-dropzone";
import { supabase } from "../lib/supabaseClient";

export default function DropzoneControl({
  files,
  setFiles,
  bucket,
  maxFiles = 1,
  maxFileSize = 5 * 1024 * 1024, // 5 MB
  accept = ["image/*"], // array of accepted MIME types
}) {
  const onDrop = async (acceptedFiles, fileRejections) => {
    try {
      // Handle validation errors from react-dropzone
      fileRejections.forEach((rejection) => {
        rejection.errors.forEach((error) => {
          if (error.code === "file-too-large") {
            alert(`File "${rejection.file.name}" is too large.`);
          } else if (error.code === "file-invalid-type") {
            alert(`File type of "${rejection.file.name}" is not accepted.`);
          }
        });
      });

      // Check max file count
      const totalFiles = files.length + acceptedFiles.length;
      if (totalFiles > maxFiles) {
        alert(
          `You cannot add more files. You currently have ${files.length} file(s) uploaded. ` +
            `The maximum allowed is ${maxFiles}. Please remove at least ${
              totalFiles - maxFiles
            } file(s) before adding more.`
        );
        // Only take allowed files
        acceptedFiles = acceptedFiles.slice(0, maxFiles - files.length);
      }

      if (acceptedFiles.length === 0) return;

      const uploadedFiles = [];

      for (const file of acceptedFiles) {
        // Extra size check just in case
        if (file.size > maxFileSize) {
          alert(
            `File "${file.name}" exceeds the maximum size of ${
              maxFileSize / 1024 / 1024
            } MB.`
          );
          continue;
        }

        const tmpPath = `tmp/${crypto.randomUUID()}-${file.name}`;

        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(tmpPath, file);

        if (uploadError) {
          console.error("Upload failed:", uploadError);
          alert(`Upload failed for "${file.name}"`);
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
      }

      if (uploadedFiles.length > 0) {
        setFiles((prev) => [...prev, ...uploadedFiles]);
        alert(`${uploadedFiles.length} file(s) uploaded successfully!`);
        console.log("Uploaded files:", uploadedFiles);
      }
    } catch (err) {
      console.error("File upload failed:", err);
      alert("File upload failed");
    }
  };

  const removeFile = (file) => {
    setFiles((prev) => prev.filter((f) => f !== file));
    alert(`Removed file "${file.name}"`);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: maxFileSize,
    maxFiles,
    accept: accept.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
  });

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
        {isDragActive
          ? "Drop files here"
          : `Drag files or click to upload (Max: ${maxFiles} files, ${
              maxFileSize / 1024 / 1024
            } MB each)`}
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
