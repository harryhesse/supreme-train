import React, { useState } from "react";
import DropzoneControl from "./DropzoneControl";

const BUCKET = "user-files";
const TABLE = "documents";
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_OR_ANON_KEY;

export default function InsertDocumentForm() {
  const [title, setTitle] = useState("");
  const [files, setFiles] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/documents-create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_KEY}`,
          apikey: SUPABASE_KEY,
        },
        body: JSON.stringify({ title, files }),
      });

      if (!res.ok) throw new Error("Insert failed");

      const data = await res.json();
      alert("Document created successfully!");
      setTitle("");
      setFiles([]);
      console.log("Created document:", data);
    } catch (err) {
      console.error(err);
      alert("Insert failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Document</h2>
      <label>Title</label>
      <input value={title} onChange={(e) => setTitle(e.target.value)} />
      <DropzoneControl files={files} setFiles={setFiles} bucket={BUCKET} />
      <button type="submit">Create</button>
    </form>
  );
}
