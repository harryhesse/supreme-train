import React, { useEffect, useState } from "react";
import DropzoneControl from "./DropzoneControl";

const BUCKET = "user-files";
const TABLE = "documents";
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_OR_ANON_KEY;

export default function EditDocumentForm({ id }) {
  const [title, setTitle] = useState("");
  const [files, setFiles] = useState([]);
  const [initialFiles, setInitialFiles] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const resDoc = await fetch(
          `${SUPABASE_URL}/rest/v1/${TABLE}?id=eq.${id}`,
          {
            headers: { apikey: SUPABASE_KEY },
          }
        );
        const [doc] = await resDoc.json();
        if (!doc) return;
        setTitle(doc.title);

        const resFiles = await fetch(
          `${SUPABASE_URL}/rest/v1/files?document_id=eq.${id}&deleted_at=is.null`,
          { headers: { apikey: SUPABASE_KEY } }
        );
        const filesData = await resFiles.json();
        setFiles(filesData.map((f) => ({ ...f, tmp: false })));
        setInitialFiles(filesData.map((f) => ({ ...f, tmp: false })));
      } catch (err) {
        console.error(err);
      }
    })();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/documents-update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_KEY}`,
          apikey: SUPABASE_KEY,
        },
        body: JSON.stringify({
          id,
          fields: { title },
          initialFiles,
          currentFiles: files,
        }),
      });

      if (!res.ok) throw new Error("Update failed");
      const updatedFiles = await res.json();
      setFiles(updatedFiles);
      setInitialFiles(updatedFiles);
      alert("Document updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Document</h2>
      <label>Title</label>
      <input value={title} onChange={(e) => setTitle(e.target.value)} />
      <DropzoneControl files={files} setFiles={setFiles} bucket={BUCKET} />
      <button type="submit">Save</button>
    </form>
  );
}
